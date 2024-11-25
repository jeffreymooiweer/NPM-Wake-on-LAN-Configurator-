import React, { useState, useEffect } from 'react';
import { Container, Typography, Snackbar, Alert } from '@mui/material';
import AddDeviceForm from './AddDeviceForm';
import DeviceTable from './DeviceTable';
import DeviceActions from './DeviceActions';

const App = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000); // Polling elke 5 seconden
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = () => {
    fetch('/api/devices')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDevices(data);
        } else {
          setNotification({ open: true, message: data.error || 'Fout bij het ophalen van apparaten.', severity: 'error' });
        }
      })
      .catch(err => {
        setNotification({ open: true, message: 'Fout bij het ophalen van apparaten.', severity: 'error' });
      });
  };

  const handleAddDevice = (device) => {
    fetch('/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(device),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setNotification({ open: true, message: data.error, severity: 'error' });
        } else {
          setDevices([...devices, data]);
          setNotification({ open: true, message: 'Apparaat toegevoegd!', severity: 'success' });
        }
      })
      .catch(err => {
        setNotification({ open: true, message: 'Fout bij het toevoegen van apparaat.', severity: 'error' });
      });
  };

  const handleEdit = (device) => {
    // Implementatie van bewerken, bijvoorbeeld openen van een modal
    setNotification({ open: true, message: `Edit apparaat: ${device.domain}`, severity: 'info' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Weet je zeker dat je dit apparaat wilt verwijderen?')) return;
    fetch(`/api/devices/${id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setNotification({ open: true, message: data.error, severity: 'error' });
        } else {
          setDevices(devices.filter(device => device.id !== id));
          setNotification({ open: true, message: 'Apparaat verwijderd!', severity: 'success' });
          if (selectedDeviceId === id) setSelectedDeviceId(null);
        }
      })
      .catch(err => {
        setNotification({ open: true, message: 'Fout bij het verwijderen van apparaat.', severity: 'error' });
      });
  };

  const handleTestWOL = (device) => {
    fetch(`/api/devices/${device.id}/wake`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setNotification({ open: true, message: data.error, severity: 'error' });
        } else {
          setNotification({ open: true, message: data.message, severity: 'success' });
        }
      })
      .catch(err => {
        setNotification({ open: true, message: 'Fout bij testen WOL.', severity: 'error' });
      });
  };

  const selectedDevice = devices.find(device => device.id === selectedDeviceId);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        NPM Wake-on-LAN Configurator
      </Typography>
      <AddDeviceForm onAddDevice={handleAddDevice} setNotification={setNotification} />
      <DeviceTable 
        devices={devices} 
        selectedDeviceId={selectedDeviceId}
        setSelectedDeviceId={setSelectedDeviceId}
      />
      <DeviceActions 
        selectedDevice={selectedDevice} 
        handleEdit={handleEdit} 
        handleDelete={handleDelete} 
        handleTestWOL={handleTestWOL} 
      />
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
