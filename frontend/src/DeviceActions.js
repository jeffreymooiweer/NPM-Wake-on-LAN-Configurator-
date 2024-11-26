// DeviceActions.js
import React, { useState } from 'react';
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const DeviceActions = ({ selectedDevice, handleEdit, handleDelete, handleTestWOL }) => {
  const [script, setScript] = useState('');
  const [isScriptDialogOpen, setIsScriptDialogOpen] = useState(false);

  const generateScript = () => {
    if (!selectedDevice) return;
    const scriptContent = `
