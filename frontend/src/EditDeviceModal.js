// EditDeviceModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const EditDeviceModal = ({ open, handleClose, device, onUpdate }) => {
  const [domain, setDomain] = useState('');
  const [ip, setIp] = useState('');
  const [mac, setMac] = useState('');

  useEffect(() => {
    if (device) {
      setDomain(device.domain);
      setIp(device.ip);
      setMac(device.mac);
    }
  }, [device]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!domain || !ip || !mac) return;
    onUpdate({ ...device, domain, ip, mac });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-device-title"
      aria-describedby="edit-device-description"
    >
      <Box component="form" onSubmit={handleSubmit} sx={style}>
        <Typography id="edit-device-title" variant="h6" component="h2" gutterBottom>
          Edit Apparaat
        </Typography>
        <TextField
          label="Domeinnaam"
          variant="outlined"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
        />
        <TextField
          label="Intern IP"
          variant="outlined"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
        />
        <TextField
          label="MAC-adres"
          variant="outlined"
          value={mac}
          onChange={(e) => setMac(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
        />
        <Box display="flex" justifyContent="flex-end" gap={2} marginTop={2}>
          <Button variant="contained" color="primary" type="submit" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
            Save
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleClose}
            sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditDeviceModal;
