import React, { useState, useEffect } from 'react';
import { Container, Typography, Snackbar, Alert } from '@mui/material';
import AddDeviceForm from './AddDeviceForm';
import DeviceTable from './DeviceTable';
import EditDeviceModal from './EditDeviceModal';

function App() {
  const [devices, setDevices] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);

  // Fetch devices
  const fetchDevices = () => {
    fetch('/api/devices')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(err => {
        setNotification({ open: true, message: 'Fout bij het ophalen van apparaten.', severity: 'error' });
      });
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000); // Polling elke 5 seconden
    return () => clearInterval(interval);
  }, []);

  // Voeg apparaat toe
  const addDevice = (device) => {
    fetch('/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(device),
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw err; });
        }
        return res.json();
      })
      .then(data => {
        setDevices([...devices, data]);
        setNotification({ open: true, message: 'Apparaat toegevoegd!', severity: 'success' });
      })
      .catch(err => {
        setNotification({ open: true, message: err.error || 'Fout bij het toevoegen van apparaat.', severity: 'error' });
      });
  };

  // Bewerken apparaat
  const editDevice = (updatedDevice) => {
    fetch(`/api/devices/${updatedDevice.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDevice),
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw err; });
        }
        return res.json();
      })
      .then(data => {
        setDevices(devices.map(device => device.id === data.id ? data : device));
        setNotification({ open: true, message: 'Apparaat bijgewerkt!', severity: 'success' });
      })
      .catch(err => {
        setNotification({ open: true, message: err.error || 'Fout bij het bijwerken van apparaat.', severity: 'error' });
      });
  };

  // Open bewerkmodal
  const handleEdit = (device) => {
    setCurrentDevice(device);
    setEditModalOpen(true);
  };

  return (
    <Container sx={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Typography variant="h4" gutterBottom align="center">
        NPM Wake-on-LAN Configurator
      </Typography>
      
      {/* Formulier om apparaat toe te voegen */}
      <AddDeviceForm addDevice={addDevice} setNotification={setNotification} />

      {/* Tabel met apparaten */}
      <DeviceTable 
        devices={devices} 
        handleEdit={handleEdit} 
        setDevices={setDevices} 
        setNotification={setNotification} 
      />

      {/* Bewerken apparaat modal */}
      {currentDevice && (
        <EditDeviceModal
          open={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          device={currentDevice}
          handleSave={editDevice}
        />
      )}

      {/* Snackbar notificatie */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
