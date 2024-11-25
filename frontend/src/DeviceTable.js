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
            <TableCell>Select</TableCell>
            <TableCell>Domeinnaam</TableCell>
            <TableCell>Intern IP</TableCell>
            <TableCell>MAC-adres</TableCell>
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
                />
              </TableCell>
              <TableCell>{device.domain}</TableCell>
              <TableCell>{device.ip}</TableCell>
              <TableCell>{device.mac}</TableCell>
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
