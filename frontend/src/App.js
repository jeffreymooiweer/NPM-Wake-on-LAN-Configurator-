// App.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Snackbar, Alert, Box } from '@mui/material';
import AddDeviceForm from './AddDeviceForm';
import DeviceTable from './DeviceTable';
import DeviceActions from './DeviceActions';
import EditDeviceModal from './EditDeviceModal';

const App = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);

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
          setNotification({ open: true, message: data.error || 'Error fetching devices.', severity: 'error' });
        }
      })
      .catch(err => {
        setNotification({ open: true, message: 'Error fetching devices.', severity: 'error' });
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
          setNotification({ open: true, message: 'Device added!', severity: 'success' });
        }
      })
      .catch(err => {
        setNotification({ open: true, message: 'Error adding device.', severity: 'error' });
      });
  };

  const handleEdit = (device) => {
    console.log('handleEdit called with device:', device); // Debugging lijn
    setDeviceToEdit(device);
    setIsEditModalOpen(true);
  };

  const handleUpdateDevice = (updatedDevice) => {
    fetch(`/api/devices/${updatedDevice.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: updatedDevice.domain,
        ip: updatedDevice.ip,
        mac: updatedDevice.mac,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setNotification({ open: true, message: data.error, severity: 'error' });
        } else {
          setDevices(devices.map(device => device.id === data.id ? data : device));
          setNotification({ open: true, message: 'Device updated!', severity: 'success' });
          setIsEditModalOpen(false);
          setDeviceToEdit(null);
        }
      })
      .catch(err => {
        setNotification({ open: true, message: 'Error updating device.', severity: 'error' });
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this device?')) return;
    fetch(`/api/devices/${id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setNotification({ open: true, message: data.error, severity: 'error' });
        } else {
          setDevices(devices.filter(device => device.id !== id));
          setNotification({ open: true, message: 'Device deleted!', severity: 'success' });
          if (selectedDeviceId === id) setSelectedDeviceId(null);
        }
      })
      .catch(err => {
        setNotification({ open: true, message: 'Error deleting device.', severity: 'error' });
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
        setNotification({ open: true, message: 'Error testing WOL.', severity: 'error' });
      });
  };

  const selectedDevice = devices.find(device => device.id === selectedDeviceId);

  return (
    <Container>
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        minHeight="100vh"
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem' },
            fontFamily: 'Montserrat, sans-serif',
            textAlign: 'center',
            marginTop: '1rem',
            marginBottom: '1rem'
          }}
        >
          ProxyWake
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
        <EditDeviceModal 
          open={isEditModalOpen} 
          handleClose={() => { setIsEditModalOpen(false); setDeviceToEdit(null); }} 
          device={deviceToEdit} 
          onUpdate={handleUpdateDevice} 
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
      </Box>
    </Container>
  );
};

export default App;
