import React, { useState } from 'react';
import { TextField, Button, Box, Paper } from '@mui/material';

const AddDeviceForm = ({ addDevice, setNotification }) => {
  const [formData, setFormData] = useState({ domain: '', ip: '', mac: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.domain || !formData.ip || !formData.mac) {
      setNotification({ open: true, message: 'Vul alle velden in.', severity: 'warning' });
      return;
    }
    // Eenvoudige validatie van IP en MAC
    const ipRegex = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(\1)\.(\1)\.(\1)$/;
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (!ipRegex.test(formData.ip)) {
      setNotification({ open: true, message: 'Ongeldig IP-adres.', severity: 'warning' });
      return;
    }
    if (!macRegex.test(formData.mac)) {
      setNotification({ open: true, message: 'Ongeldig MAC-adres.', severity: 'warning' });
      return;
    }
    addDevice(formData);
    setFormData({ domain: '', ip: '', mac: '' });
  };

  return (
    <Paper elevation={3} sx={{ padding: '1rem', marginBottom: '2rem' }}>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
        <TextField
          label="Domeinnaam"
          name="domain"
          value={formData.domain}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Intern IP-adres"
          name="ip"
          value={formData.ip}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="MAC-adres"
          name="mac"
          value={formData.mac}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add Device
        </Button>
      </Box>
    </Paper>
  );
};

export default AddDeviceForm;
