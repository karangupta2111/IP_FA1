import { createTheme } from '@mui/material/styles';

const common = {
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
    body1: { fontWeight: 400 },
    h4: { fontWeight: 700, letterSpacing: '0.1em' },
  },
  shape: { borderRadius: 16 },
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff72d7' },
    secondary: { main: '#4928df' },
    background: {
      default: '#20003a',
      paper: 'rgba(33,24,51,0.85)'
    }
  },
  ...common
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4928df' },
    secondary: { main: '#ff72d7' },
    background: {
      default: '#f7edff',
      paper: '#ffffffee'
    }
  },
  ...common
});

export { theme, lightTheme };
