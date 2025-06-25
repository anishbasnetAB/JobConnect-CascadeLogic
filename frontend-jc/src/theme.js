// Corporate-looking palette + Roboto (MUI default)
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0b5ed7' },      // Job Connect blue
    secondary: { main: '#4b4b4b' },    // Neutral gray for text / icons
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
  },
  components: {
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true, size: 'small' },
    },
    MuiButton: { defaultProps: { variant: 'contained', size: 'medium' } },
  },
});

export default theme;
