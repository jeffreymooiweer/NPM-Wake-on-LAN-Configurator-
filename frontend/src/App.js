// src/App.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Snackbar, Alert } from '@mui/material';
import AddDeviceForm from './AddDeviceForm';
import DeviceTable from './DeviceTable';
import DeviceActions from './DeviceActions';
import EditDeviceModal from './EditDeviceModal';
import GenerateScriptButton from './GenerateScriptButton';

const App = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
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
      .catch(() => {
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
      .catch(() => {
        setNotification({ open: true, message: 'Error adding device.', severity: 'error' });
      });
  };

  const handleEdit = (device) => {
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
      .catch(() => {
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
      .catch(() => {
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
      .catch(() => {
        setNotification({ open: true, message: 'Error testing WOL.', severity: 'error' });
      });
  };

  const selectedDevice = devices.find(device => device.id === selectedDeviceId);

  return (
    <Container 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: { xs: '1rem', sm: '2rem' }
      }}
    >
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontFamily: 'Roboto Slab, serif', 
          fontSize: { xs: '2rem', sm: '3rem' }, 
          textAlign: 'center',
          marginBottom: { xs: '1rem', sm: '2rem' }
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
      <GenerateScriptButton 
        selectedDevice={selectedDevice} 
        setNotification={setNotification} 
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
    </Container>
  );
};

export default App;
