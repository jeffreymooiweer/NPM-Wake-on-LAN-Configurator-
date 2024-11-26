# backend/app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///backend/devices.db'
db = SQLAlchemy(app)

class Device(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    domain = db.Column(db.String(80), unique=True, nullable=False)
    ip = db.Column(db.String(120), unique=True, nullable=False)
    mac = db.Column(db.String(120), unique=True, nullable=False)

@app.route('/api/devices', methods=['GET'])
def get_devices():
    devices = Device.query.all()
    return jsonify([{'id': device.id, 'domain': device.domain, 'ip': device.ip, 'mac': device.mac} for device in devices])

@app.route('/api/devices', methods=['POST'])
def add_device():
    data = request.get_json()
    if not data or not 'domain' in data or not 'ip' in data or not 'mac' in data:
        return jsonify({'error': 'Invalid data'}), 400
    new_device = Device(domain=data['domain'], ip=data['ip'], mac=data['mac'])
    db.session.add(new_device)
    try:
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify({'error': 'Device already exists'}), 400
    return jsonify({'id': new_device.id, 'domain': new_device.domain, 'ip': new_device.ip, 'mac': new_device.mac}), 201

@app.route('/api/devices/<int:device_id>', methods=['PUT'])
def update_device(device_id):
    device = Device.query.get_or_404(device_id)
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid data'}), 400
    device.domain = data.get('domain', device.domain)
    device.ip = data.get('ip', device.ip)
    device.mac = data.get('mac', device.mac)
    try:
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify({'error': 'Update failed'}), 400
    return jsonify({'id': device.id, 'domain': device.domain, 'ip': device.ip, 'mac': device.mac})

@app.route('/api/devices/<int:device_id>', methods=['DELETE'])
def delete_device(device_id):
    device = Device.query.get_or_404(device_id)
    db.session.delete(device)
    db.session.commit()
    return jsonify({'message': 'Device deleted'})

@app.route('/api/devices/<int:device_id>/wake', methods=['POST'])
def wake_device(device_id):
    device = Device.query.get_or_404(device_id)
    # Implement WOL functionality here
    return jsonify({'message': f'Wake-on-LAN triggered for {device.domain}'}), 200

@app.route('/api/generate-script/<int:device_id>', methods=['GET'])
def generate_script(device_id):
    device = Device.query.get_or_404(device_id)
    script = f"""#!/bin/bash
# Script to wake device {device.domain}

curl -X POST http://{request.host}/api/devices/{device.id}/wake
"""
    return jsonify({'script': script}), 200

if __name__ == '__main__':
    db.create_all()
    app.run(host='0.0.0.0', port=5001)
