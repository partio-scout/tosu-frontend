import { createMuiTheme } from '@material-ui/core'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: 'PT Sans',
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
    MuiButton: {
      contained: {
        boxShadow: 'none',
      },
    },
  },
})
export default theme
