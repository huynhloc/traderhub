import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          backgroundColor: 'rgb(255, 253, 248)',
        },
        a: {
          textDecoration: 'none',
        },
        p: {
          margin: 0,
        },
        blockquote: {
          margin: 0,
        },
        h1: {
          margin: 0,
          marginBottom: '0.5rem',
        },
        h2: {
          margin: 0,
          marginBottom: '0.5rem',
          scrollMarginTop: '90px',
        },
        h3: {
          margin: 0,
          marginBottom: '0.5rem',
        },
        h4: {
          margin: 0,
          marginBottom: '0.5rem',
        },
        h5: {
          margin: 0,
          marginBottom: '0.5rem',
        },
        h6: {
          margin: 0,
          marginBottom: '0.5rem',
        },
        '.mention': {
          fontWeight: 500,
          color: '#cd9303',
        },
        '.truncate': {
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          display: '-webkit-box',
          boxOrient: 'vertical',
          // whiteSpace: 'nowrap',
          lineClamp: 1,
          '&--2': {
            lineClamp: 2,
          },
          '&--3': {
            lineClamp: 3,
          },
        },
        '.rec.rec-slider-container': {
          margin: 0,
        },
      },
    },
    MuiButton: {
      root: {
        '&$disabled': {
          backgroundColor: '#fac011 !important',
          '& .MuiButton-label': {
            color: 'white',
          },
        },
      },
      text: {
        '&$disabled': {
          backgroundColor: 'transparent !important',
        },
      },
    },
    MuiDialogTitle: {
      root: {
        color: 'rgba(56, 56, 56, 0.84)',
      },
    },
  },
  spacing: 16,
  palette: {
    primary: {
      light: '#fcdf88',
      main: '#fac011',
      dark: '#bf953f',
      contrastText: '#fff',
    },
    secondary: {
      light: '#a4d0d7',
      main: '#4CA1AF',
      dark: '#255057',
      contrastText: '#fff',
    },
    text: {
      primary: '#383838', // 56,56,56
      secondary: 'rgba(56, 56, 56, 0.84)',
      disabled: 'rgba(56, 56, 56, 0.56)',
      hint: '#cd9303',
    },
    background: {
      paper: 'rgb(255, 253, 248)',
      default: 'rgba(56, 56, 56, 0.05)',
    },
    // mui default action color
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      hoverOpacity: 0.04,
      selected: 'rgba(0, 0, 0, 0.08)',
      selectedOpacity: 0.08,
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
      disabledOpacity: 0.38,
      focus: 'rgba(0, 0, 0, 0.12)',
      focusOpacity: 0.12,
      activatedOpacity: 0.12,
    },
  },
  typography: {
    htmlFontSize: 16,
    fontSize: 14,
    fontFamily: 'AvenirNext, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'capitalize',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '0.875rem', // 14px
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.625rem', // 10px
    },
  },
  shadows: [
    'none',
    '0px 2px 12px rgba(0, 0, 0, 0.05)',
    '0px 0px 12px #EEEEEE',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
  ],
});

export default theme;
