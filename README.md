# ProxyWake

**ProxyWake** is een handige tool die Wake-on-LAN-functionaliteit integreert met [Nginx Proxy Manager (NPM)](https://nginxproxymanager.com/). Het stelt je in staat om apparaten automatisch te activeren via een Magic Packet wanneer een domeinnaam of proxy wordt benaderd.

Met ProxyWake kun je eenvoudig apparaten configureren, beheren en activeren binnen een netwerk. Het is speciaal ontworpen om te draaien op een Unraid-server en maakt gebruik van een Docker-container voor eenvoudige implementatie.

---

## Features

- **Wake-on-LAN (WOL):** Verstuur Magic Packets om apparaten op je netwerk te activeren.
- **NPM Integratie:** Genereer scripts voor geavanceerde instellingen van Nginx Proxy Manager.
- **Apparaatbeheer:** Voeg, verwijder en bewerk apparaten (domeinnaam, intern IP-adres, MAC-adres).
- **Responsieve Webinterface:** Intuïtief ontworpen met React en Material-UI.
- **Docker Ready:** Eenvoudige installatie via een Docker-container.
- **Polling of Websockets:** Live updates van apparaatstatussen.
- **Logboek:** Volg alle acties, inclusief verstuurde WOL-pakketten.

---

## Screenshots

### Dashboard
![ProxyWake Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Image)

---

## Installatie

### Vereisten

- **Unraid** of een vergelijkbaar systeem met Docker-ondersteuning.
- Nginx Proxy Manager.
- Een netwerkconfiguratie die Wake-on-LAN ondersteunt.

### Stappen

1. **Docker-container installeren:**
   - Voeg de Docker-image toe vanuit de repository:
     ```
     https://hub.docker.com/repository/docker/jeffersonmouze/proxywake/
     ```
   - Zorg ervoor dat de volgende poorten en volumes correct zijn ingesteld:
     - **Poorten:**
       - `8462:5001` (Host:Container)
     - **Volumes:**
       - `/mnt/user/appdata/proxywake/devices.db` → `/app/backend/devices.db`
       - `/mnt/user/appdata/proxywake/app.log` → `/app/backend/app.log`

2. **Webinterface openen:**
   - Navigeer naar: `http://<UNRAID-IP>:8462/`

3. **Apparaten configureren:**
   - Voeg apparaten toe via de interface door domeinnaam, intern IP en MAC-adres op te geven.

4. **Script genereren:**
   - Genereer een script in de interface en voeg het toe aan de "Geavanceerde instellingen" van je NPM-host.

5. **Wake-on-LAN activeren:**
   - Wanneer een domeinnaam wordt benaderd, verstuurt ProxyWake automatisch een Magic Packet.

---

## Gebruik

### Webinterface

- **Add Device:** Voeg apparaten toe met hun domeinnaam, intern IP en MAC-adres.
- **Edit Device:** Bewerk bestaande apparaatconfiguraties.
- **Delete Device:** Verwijder apparaten uit de configuratie.
- **Test WOL:** Test direct of een Magic Packet succesvol wordt verzonden.
- **Generate Script:** Genereer een script voor Nginx Proxy Manager.

---

## API Documentatie

### Basis-URL

`http://<UNRAID-IP>:5001/api`

### Eindpunten

| Methode | Endpoint           | Beschrijving                   |
|---------|--------------------|--------------------------------|
| GET     | `/devices`         | Haal alle apparaten op.        |
| POST    | `/devices`         | Voeg een nieuw apparaat toe.   |
| PUT     | `/devices/:id`     | Bewerk een apparaat.           |
| DELETE  | `/devices/:id`     | Verwijder een apparaat.        |
| POST    | `/devices/:id/wake`| Verstuur een Magic Packet.     |

---

## Probleemoplossing

### Ik krijg een foutmelding "Ongeldig IP-adres" bij het toevoegen van een apparaat.

- Controleer of je een geldig IPv4-adres hebt ingevoerd (bijv. `192.168.1.100`).

### De webinterface toont "Resource niet gevonden."

- Controleer of de Docker-container correct draait.
- Zorg ervoor dat je het juiste IP en poort gebruikt.

### Magic Packet wordt niet verzonden.

- Controleer of je netwerk Wake-on-LAN ondersteunt.
- Controleer of het juiste MAC-adres is ingevoerd.

---

## Toekomstige Functionaliteiten

- **Meerdere NPM-hosts ondersteunen:** Voeg apparaten toe voor meerdere Nginx Proxy Manager-instanties.
- **Export en import:** Configureerbare apparaatlijsten exporteren en importeren (JSON/CSV).
- **Wake-on-LAN over WAN:** Ondersteuning voor apparaten activeren via een extern netwerk.

---

## Licentie

Dit project wordt uitgebracht onder de MIT-licentie. Zie het bestand `LICENSE` voor meer informatie.

---

## Bijdragen

Bijdragen zijn welkom! Maak een fork van de repository, doe je wijzigingen en open een pull request.

---


Veel plezier met **ProxyWake**!
