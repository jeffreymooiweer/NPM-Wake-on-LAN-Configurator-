import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button 
} from '@mui/material';

const EditDeviceModal = ({ open, handleClose, device, handleSave }) => {
  const [formData, setFormData] = useState({ ...device });

  useEffect(() => {
    setFormData({ ...device });
  }, [device]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSave = () => {
    if (!formData.domain || !formData.ip || !formData.mac) {
      // Je kunt hier een notificatie triggeren als je wilt
      return;
    }
    // Eenvoudige validatie van IP en MAC
    const ipRegex = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (!ipRegex.test(formData.ip)) {
      // Trigger een notificatie voor ongeldig IP
      return;
    }
    if (!macRegex.test(formData.mac)) {
      // Trigger een notificatie voor ongeldig MAC
      return;
    }
    handleSave(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Apparaat Bewerken</DialogTitle>
      <DialogContent>
        <TextField
          label="Domeinnaam"
          name="domain"
          value={formData.domain}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="dense"
        />
        <TextField
          label="Intern IP-adres"
          name="ip"
          value={formData.ip}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="dense"
        />
        <TextField
          label="MAC-adres"
          name="mac"
          value={formData.mac}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuleren</Button>
        <Button onClick={onSave} color="primary" variant="contained">
          Opslaan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDeviceModal;
