// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    // Responsive font sizes
    h4: {
      fontSize: '1.5rem',
      '@media (min-width:600px)': {
        fontSize: '2rem',
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
