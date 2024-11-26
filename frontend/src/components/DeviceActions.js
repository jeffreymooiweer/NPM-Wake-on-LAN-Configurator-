import React from 'react';
import { Button, Box } from '@mui/material';

const DeviceActions = ({ selectedDevice, handleEdit, handleDelete, handleTestWOL }) => {
  return (
    <Box 
      display="flex" 
      flexDirection={{ xs: 'column', sm: 'row' }} 
      justifyContent="center" 
      gap={2} 
      marginTop={2}
    >
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => handleEdit(selectedDevice)}
        disabled={!selectedDevice}
        fullWidth={{ xs: true, sm: false }}
        sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
      >
        Edit
      </Button>
      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={() => handleDelete(selectedDevice?.id)}
        disabled={!selectedDevice}
        fullWidth={{ xs: true, sm: false }}
        sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
      >
        Delete
      </Button>
      <Button 
        variant="contained" 
        color="success" 
        onClick={() => handleTestWOL(selectedDevice)}
        disabled={!selectedDevice}
        fullWidth={{ xs: true, sm: false }}
        sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
      >
        Test WOL
      </Button>
    </Box>
  );
};

export default DeviceActions;
