import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const AddDeviceForm = ({ onAddDevice, setNotification }) => {
  const [domain, setDomain] = useState('');
  const [ip, setIp] = useState('');
  const [mac, setMac] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!domain || !ip || !mac) {
      setNotification({ open: true, message: 'Alle velden zijn vereist.', severity: 'error' });
      return;
    }
    onAddDevice({ domain, ip, mac });
    setDomain('');
    setIp('');
    setMac('');
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, marginBottom: 2 }}
    >
      <TextField
        label="Domeinnaam"
        variant="outlined"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        fullWidth
        sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
      />
      <TextField
        label="Intern IP"
        variant="outlined"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        fullWidth
        sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
      />
      <TextField
        label="MAC-adres"
        variant="outlined"
        value={mac}
        onChange={(e) => setMac(e.target.value)}
        fullWidth
        sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="primary"
        fullWidth={{ xs: true, sm: false }}
        sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, height: '56px' }}
      >
        Add Device
      </Button>
    </Box>
  );
};

export default AddDeviceForm;
