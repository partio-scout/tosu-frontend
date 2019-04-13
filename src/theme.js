import { createMuiTheme } from '@material-ui/core'
import red from '@material-ui/core/colors/red'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: 'PT Sans, Source Sans Pro Black, sans-serif',
    fontSize: 16,
    body1: {
      fontWeight: 700,
    },
  },
  palette: {
    primary: {
      main: '#253264',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#28AAE0',
      contrastText: '#ffffff',
    },
    background: {
      paper: '#fff',
      default: '#fff',
    },
    error: {
      main: red[500],
      contrastText: '#ffffff',
    },
  },
  overrides: {
    MuiChip: {
      root: {
        borderRadius: '4px',
      },
      label: {
        fontWeight: 700,
      },
    },
  },
})
export default theme
