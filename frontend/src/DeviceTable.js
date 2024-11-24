import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Button, 
  Radio, 
  Paper, 
  Box 
} from '@mui/material';

const DeviceTable = ({ devices, handleEdit, setDevices, setNotification }) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const handleDelete = (id) => {
    if (!window.confirm('Weet je zeker dat je dit apparaat wilt verwijderen?')) return;
    fetch(`/api/devices/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw err; });
        }
        return res.json();
      })
      .then(() => {
        setDevices(devices.filter(device => device.id !== id));
        setNotification({ open: true, message: 'Apparaat verwijderd!', severity: 'success' });
      })
      .catch(err => {
        setNotification({ open: true, message: err.error || 'Fout bij het verwijderen van apparaat.', severity: 'error' });
      });
  };

  const handleTestWOL = (device) => {
    fetch(`/api/devices/${device.id}/wake`, { method: 'POST' })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw err; });
        }
        return res.json();
      })
      .then(data => {
        setNotification({ open: true, message: data.message, severity: 'success' });
      })
      .catch(err => {
        setNotification({ open: true, message: err.error || 'Fout bij testen WOL.', severity: 'error' });
      });
  };

  return (
    <Paper elevation={3} sx={{ padding: '1rem' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Select</TableCell>
            <TableCell>Domeinnaam</TableCell>
            <TableCell>Intern IP</TableCell>
            <TableCell>MAC-adres</TableCell>
            <TableCell align="center">Acties</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map(device => (
            <TableRow key={device.id} hover>
              <TableCell>
                <Radio 
                  checked={selectedDeviceId === device.id}
                  onChange={() => setSelectedDeviceId(device.id)}
                  value={device.id}
                  name="selectedDevice"
                />
              </TableCell>
              <TableCell>{device.domain}</TableCell>
              <TableCell>{device.ip}</TableCell>
              <TableCell>{device.mac}</TableCell>
              <TableCell align="center">
                <Box display="flex" justifyContent="center" gap={1}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => handleEdit(device)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={() => handleDelete(device.id)}
                  >
                    Delete
                  </Button>
                  <Button 
                    variant="contained" 
                    color="success" 
                    onClick={() => handleTestWOL(device)}
                  >
                    Test WOL
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {devices.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Geen apparaten toegevoegd.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default DeviceTable;
