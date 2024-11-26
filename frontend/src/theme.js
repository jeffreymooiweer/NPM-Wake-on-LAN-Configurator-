// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    h4: {
      fontFamily: 'Roboto Slab, serif',
      fontSize: '2rem',
      '@media (min-width:600px)': {
        fontSize: '3rem',
      },
    },
    body1: {
      fontSize: '0.8rem',
      '@media (min-width:600px)': {
        fontSize: '1rem',
      },
    },
  },
});

export default theme;
