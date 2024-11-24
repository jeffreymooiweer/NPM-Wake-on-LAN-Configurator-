```markdown
# NPM Wake-on-LAN Configurator

**NPM Wake-on-LAN Configurator** is a web-based application designed to integrate Wake-on-LAN (WOL) functionality with Nginx Proxy Manager (NPM) on Unraid servers. This tool allows users to manage devices, send Magic Packets to wake them up remotely, and seamlessly integrate with their existing NPM setup.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [GitHub Actions Workflow](#github-actions-workflow)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Device Management:** Add, edit, and delete devices with ease.
- **Wake-on-LAN:** Send Magic Packets to wake up devices remotely.
- **Real-time Updates:** Automatically refresh device list every 5 seconds.
- **User-Friendly Interface:** Built with React and Material-UI for a modern and responsive design.
- **Docker Deployment:** Easily deployable using Docker and Docker Compose.
- **Continuous Integration:** Automated builds and deployments via GitHub Actions.

## Technologies Used

- **Frontend:**
  - [React](https://reactjs.org/)
  - [Material-UI](https://mui.com/)
- **Backend:**
  - [Flask](https://flask.palletsprojects.com/)
  - [SQLite](https://www.sqlite.org/index.html)
  - [WakeonLAN](https://pypi.org/project/wakeonlan/)
- **Deployment:**
  - [Docker](https://www.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/)
  - [GitHub Actions](https://github.com/features/actions)

## Project Structure

```
project-root/
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── App.js
│       ├── AddDeviceForm.js
│       ├── DeviceTable.js
│       ├── EditDeviceModal.js
│       └── index.css
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│
├── docker/
│   └── docker-compose.yml
│
├── .github/
│   └── workflows/
│       └── docker.yml
│
├── Dockerfile
├── .dockerignore
└── README.md
```

## Installation

### Prerequisites

- **Docker:** Ensure Docker is installed on your system. [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose:** Ensure Docker Compose is installed. [Install Docker Compose](https://docs.docker.com/compose/install/)
- **GitHub Repository:** Access to the project's GitHub repository.

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/npm-wake-on-lan-configurator.git
   cd npm-wake-on-lan-configurator
   ```

2. **Set Up GitHub Secrets:**

   - Navigate to your GitHub repository.
   - Go to `Settings` > `Secrets and variables` > `Actions`.
   - Add the following secrets:
     - `DOCKER_USERNAME`: Your Docker Hub username.
     - `DOCKER_PASSWORD`: Your Docker Hub password.

3. **Build and Start the Application with Docker Compose:**

   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```

   > **Note:** This command builds the Docker image, creates the container, and starts it in detached mode.

4. **Verify the Container is Running:**

   ```bash
   docker-compose -f docker/docker-compose.yml ps
   ```

   Ensure that the `wol-configurator` container is up and running without errors.

## Usage

1. **Access the Application:**

   Open your web browser and navigate to `http://<your-unraid-ip>:8462`.

2. **Add a New Device:**

   - Fill in the **Domain Name**, **Internal IP Address**, and **MAC Address**.
   - Click on **"Add Device"** to save the device.

3. **Manage Devices:**

   - **Edit:** Click on the **"Edit"** button next to a device to modify its details.
   - **Delete:** Click on the **"Delete"** button to remove a device.
   - **Test WOL:** Click on the **"Test WOL"** button to send a Magic Packet to the device.

4. **Nginx Proxy Manager Integration:**

   - Use the generated Nginx configuration in the advanced settings of your proxy host to integrate with NPM.

## API Endpoints

### GET `/api/devices`

**Description:** Retrieve all registered devices.

**Response:**

```json
[
  {
    "id": 1,
    "domain": "example.com",
    "ip": "192.168.1.100",
    "mac": "AA:BB:CC:DD:EE:FF"
  },
  ...
]
```

### POST `/api/devices`

**Description:** Add a new device.

**Request Body:**

```json
{
  "domain": "example.com",
  "ip": "192.168.1.100",
  "mac": "AA:BB:CC:DD:EE:FF"
}
```

**Response:**

```json
{
  "id": 1,
  "domain": "example.com",
  "ip": "192.168.1.100",
  "mac": "AA:BB:CC:DD:EE:FF"
}
```

### PUT `/api/devices/{id}`

**Description:** Update an existing device.

**Request Body:**

```json
{
  "domain": "newdomain.com",
  "ip": "192.168.1.101",
  "mac": "FF:EE:DD:CC:BB:AA"
}
```

**Response:**

```json
{
  "id": 1,
  "domain": "newdomain.com",
  "ip": "192.168.1.101",
  "mac": "FF:EE:DD:CC:BB:AA"
}
```

### DELETE `/api/devices/{id}`

**Description:** Delete a device.

**Response:**

```json
{
  "message": "Apparaat verwijderd."
}
```

### POST `/api/devices/{id}/wake`

**Description:** Send a Magic Packet to wake up the device.

**Response:**

```json
{
  "message": "Magic Packet verzonden naar example.com"
}
```

## Deployment

### Docker

The application is containerized using Docker with a multi-stage build process to optimize image size and efficiency.

1. **Build the Docker Image:**

   ```bash
   docker build -t yourdockerhubusername/npmwol:latest .
   ```

2. **Run the Docker Container:**

   ```bash
   docker run -d -p 8462:5001 --name wol-configurator yourdockerhubusername/npmwol:latest
   ```

   > **Note:** Ensure that port `8462` is available and not in use by other services.

### Docker Compose

Docker Compose simplifies the deployment by managing multi-container applications.

1. **Start Services:**

   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```

2. **Stop Services:**

   ```bash
   docker-compose -f docker/docker-compose.yml down
   ```

### GitHub Actions Workflow

Automate the build and deployment process using GitHub Actions.

#### `.github/workflows/docker.yml`

```yaml
name: Build and Push Docker Image

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'

      - name: Install backend dependencies
        run: |
          cd backend
          pip install --upgrade pip
          pip install -r requirements.txt

      - name: Log in to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v3
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/npmwol:latest
```

#### **Setup Instructions:**

1. **Add GitHub Secrets:**

   - `DOCKER_USERNAME`: Your Docker Hub username.
   - `DOCKER_PASSWORD`: Your Docker Hub password.

2. **Workflow Trigger:**

   - The workflow triggers on pushes and pull requests to the `main` branch.
   - It builds the Docker image and pushes it to Docker Hub automatically.

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. **Fork the Repository:**

   Click the "Fork" button at the top-right corner of the repository page.

2. **Create a Feature Branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit Your Changes:**

   ```bash
   git commit -m "Add a descriptive message about your feature"
   ```

4. **Push to the Branch:**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request:**

   Navigate to the repository on GitHub and click "Compare & pull request".

## License

This project is licensed under the [MIT License](LICENSE).

---

## Additional Information

### Environment Variables

Consider using environment variables for configuration settings such as ports and database paths. This enhances flexibility and security.

### Security

While the application is intended for local use, implementing basic security measures like endpoint restrictions is advisable to prevent unauthorized access.

### Logging and Monitoring

The application logs important events to `app.log`. Regularly monitor these logs to identify and address any issues promptly.

### Dependency Management

Use tools like Dependabot to automatically manage and update dependencies, ensuring the application remains secure and up-to-date.

---

For any further questions or assistance, please refer to the project's issue tracker or contact the maintainer.

```
