import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Radio, 
  Paper 
} from '@mui/material';

const DeviceTable = ({ devices, selectedDeviceId, setSelectedDeviceId }) => {
  return (
    <Paper elevation={3} sx={{ padding: '1rem', overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Select</TableCell>
            <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Domeinnaam</TableCell>
            <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Intern IP</TableCell>
            <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>MAC-adres</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices && Array.isArray(devices) && devices.length > 0 ? devices.map(device => (
            <TableRow key={device.id} hover>
              <TableCell>
                <Radio 
                  checked={selectedDeviceId === device.id}
                  onChange={() => setSelectedDeviceId(device.id)}
                  value={device.id}
                  name="selectedDevice"
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>{device.domain}</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>{device.ip}</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>{device.mac}</TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Geen apparaten toegevoegd of er is een fout opgetreden.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default DeviceTable;
