import {createMuiTheme} from "@material-ui/core";

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
            main: '#253264'
        },
        secondary: {
            main: '#28AAE0',
            contrastText: '#ffffff'
        }
    },
    overrides: {
        MuiFormControlLabel: {
            label: {
                color: 'white',
            },
        },
        MuiChip: {
            root: {
                borderRadius: '4px'
            },
            label: {
                fontWeight: 700,
            }
        }
    },
});

export default theme