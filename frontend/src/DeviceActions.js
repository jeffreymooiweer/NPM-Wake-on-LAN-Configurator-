import React from 'react';
import { Button, Box } from '@mui/material';

const DeviceActions = ({ selectedDevice, handleEdit, handleDelete, handleTestWOL }) => {
  return (
    <Box display="flex" justifyContent="center" gap={2} marginTop={2}>
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => handleEdit(selectedDevice)}
        disabled={!selectedDevice}
      >
        Edit
      </Button>
      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={() => handleDelete(selectedDevice?.id)}
        disabled={!selectedDevice}
      >
        Delete
      </Button>
      <Button 
        variant="contained" 
        color="success" 
        onClick={() => handleTestWOL(selectedDevice)}
        disabled={!selectedDevice}
      >
        Test WOL
      </Button>
    </Box>
  );
};

export default DeviceActions;
