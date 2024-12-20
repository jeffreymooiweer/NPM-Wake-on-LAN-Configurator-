from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from wakeonlan import send_magic_packet
import logging
import os
import re

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)

# Configuratie van de database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///devices.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Logging configureren
logging.basicConfig(
    filename='app.log',
    level=logging.INFO,
    format='%(asctime)s:%(levelname)s:%(message)s'
)

# Device model
class Device(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    domain = db.Column(db.String(255), nullable=False)
    ip = db.Column(db.String(15), nullable=False)
    mac = db.Column(db.String(17), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'domain': self.domain,
            'ip': self.ip,
            'mac': self.mac
        }

# Functie om IP-adres te valideren
def is_valid_ip(ip):
    pattern = re.compile(r"""
        ^
        (?:
          # Dotted variants:
          (?:
            # Decimal 1-255 (no leading zeros)
            (?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)
          \.){3}
          (?:
            25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d
          )
        )
        $
    """, re.VERBOSE)
    return pattern.match(ip) is not None

# Routes

@app.route('/api/devices', methods=['GET', 'POST'])
def manage_devices():
    if request.method == 'GET':
        try:
            devices = Device.query.all()
            return jsonify([device.to_dict() for device in devices]), 200
        except Exception as e:
            logging.error(f'Error fetching devices: {str(e)}')
            return jsonify({'error': 'Fout bij ophalen apparaten.'}), 500
    elif request.method == 'POST':
        data = request.get_json()
        domain = data.get('domain')
        ip = data.get('ip')
        mac = data.get('mac')

        # Validatie van input
        if not domain or not ip or not mac:
            return jsonify({'error': 'Alle velden zijn vereist.'}), 400

        if not is_valid_ip(ip):
            return jsonify({'error': 'Ongeldig IP-adres.'}), 400

        # Validatie van MAC-adres
        mac_pattern = re.compile(r'^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$')
        if not mac_pattern.match(mac):
            return jsonify({'error': 'Ongeldig MAC-adres.'}), 400

        new_device = Device(domain=domain, ip=ip, mac=mac)
        try:
            db.session.add(new_device)
            db.session.commit()
            logging.info(f'Apparaat toegevoegd: {new_device.domain}')
            return jsonify(new_device.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            logging.error(f'Error adding device: {str(e)}')
            return jsonify({'error': 'Fout bij toevoegen apparaat.'}), 500

@app.route('/api/devices/<int:device_id>', methods=['PUT', 'DELETE'])
def modify_device(device_id):
    device = Device.query.get_or_404(device_id)
    if request.method == 'PUT':
        data = request.get_json()
        domain = data.get('domain', device.domain)
        ip = data.get('ip', device.ip)
        mac = data.get('mac', device.mac)

        # Validatie van input
        if not domain or not ip or not mac:
            return jsonify({'error': 'Alle velden zijn vereist.'}), 400

        if not is_valid_ip(ip):
            return jsonify({'error': 'Ongeldig IP-adres.'}), 400

        # Validatie van MAC-adres
        mac_pattern = re.compile(r'^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$')
        if not mac_pattern.match(mac):
            return jsonify({'error': 'Ongeldig MAC-adres.'}), 400

        device.domain = domain
        device.ip = ip
        device.mac = mac
        try:
            db.session.commit()
            logging.info(f'Apparaat bijgewerkt: {device.domain}')
            return jsonify(device.to_dict()), 200
        except Exception as e:
            db.session.rollback()
            logging.error(f'Error updating device: {str(e)}')
            return jsonify({'error': 'Fout bij bijwerken apparaat.'}), 500
    elif request.method == 'DELETE':
        try:
            db.session.delete(device)
            db.session.commit()
            logging.info(f'Apparaat verwijderd: {device.domain}')
            return jsonify({'message': 'Apparaat verwijderd.'}), 200
        except Exception as e:
            db.session.rollback()
            logging.error(f'Error deleting device: {str(e)}')
            return jsonify({'error': 'Fout bij verwijderen apparaat.'}), 500

@app.route('/api/devices/<int:device_id>/wake', methods=['POST'])
def wake_device(device_id):
    device = Device.query.get_or_404(device_id)
    try:
        send_magic_packet(device.mac, ip_address=device.ip)
        logging.info(f'Magic Packet verzonden naar {device.domain} ({device.ip})')
        return jsonify({'message': f'Magic Packet verzonden naar {device.domain}'}), 200
    except Exception as e:
        logging.error(f'Error sending Magic Packet to {device.domain}: {str(e)}')
        return jsonify({'error': 'Fout bij verzenden Magic Packet.'}), 500

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path.startswith('api/'):
        return jsonify({'error': 'Resource niet gevonden.'}), 404
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Globale foutafhandeling
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource niet gevonden.'}), 404

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Verkeerd verzoek.'}), 400

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Interne serverfout.'}), 500

# Initialize the database binnen app context
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
