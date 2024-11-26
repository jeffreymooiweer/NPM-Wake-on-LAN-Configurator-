// src/GenerateScriptButton.js
import React from 'react';
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField } from '@mui/material';

const GenerateScriptButton = ({ selectedDevice, setNotification }) => {
  const [open, setOpen] = React.useState(false);
  const [script, setScript] = React.useState('');

  const handleClickOpen = () => {
    if (!selectedDevice) {
      setNotification({ open: true, message: 'Please select a device first.', severity: 'error' });
      return;
    }
    fetch(`/api/generate-script/${selectedDevice.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setNotification({ open: true, message: data.error, severity: 'error' });
        } else {
          setScript(data.script);
          setOpen(true);
        }
      })
      .catch(() => {
        setNotification({ open: true, message: 'Error generating script.', severity: 'error' });
      });
  };

  const handleClose = () => {
    setOpen(false);
    setScript('');
  };

  return (
    <Box display="flex" justifyContent="center" marginTop={2} width="100%" maxWidth="800px">
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={handleClickOpen}
        disabled={!selectedDevice}
        fullWidth
        sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
      >
        Generate Script
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Generated Script</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Copy and paste the following script into the advanced settings of your proxy host in Nginx Proxy Manager:
          </Typography>
          <TextField
            multiline
            fullWidth
            minRows={6}
            value={script}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GenerateScriptButton;
