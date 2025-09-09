import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS

// Colors
const neutral = {
  100: '#FFFFFF',
  200: '#F3F4F5',
  300: '#F5F6F8',
  400: '#9B9B9B',
  500: '#6B7280',
  600: '#4B5864',
  700: '#686B78',
  800: '#1F2937',
  900: '#414141',
  1000: '#141313',
  1100: '#FBFBFB',
  1200: '#4B566B',
  1300: '#EF78224D',
  1400: 'rgba(255, 255, 255, 0.8)',
  1500: 'rgba(239, 120, 34, 0.3)',
  1600: '#FFEBDD',
  1700: '#fff5cf',
  1800: '#FCFCFC',
};

const blue = {
  50: '#d3e4fb75',
  100: '#D3E4FB',
  200: '#3B79E4',
  300: '#215C9C',
  400: '#4C8CD1',
};

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

const PRIMARY = {
  lighter: '#C8FACD',
  light: '#5BE584',
  main: '#00AB55',
  dark: '#007B55',
  darker: '#005249',
  contrastText: '#fff',
};

const SECONDARY = {
  // lighter: '#D6E4FF',
  // light: '#84A9FF',
  // main: '#4c8cd1',
  // dark: '#1939B7',
  // darker: '#091A7A',
  // contrastText: '#fff',
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FB811F',
  dark: '#B76E00',
  darker: '#05274E',
  contrastText: GREY[800],
};

const INFO = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
  contrastText: '#fff',
};

const SUCCESS = {
  lighter: '#D8FBDE',
  light: '#86E8AB',
  main: '#36B37E',
  dark: '#1B806A',
  darker: '#0A5554',
  contrastText: '#fff',
};

const WARNING = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: GREY[800],
};
const MIXED = {
  // lighter: '#FFF5CC',
  // light: '#FFD666',
  // main: '#FB811F',
  // dark: '#B76E00',
  // darker: '#05274E',
  // contrastText: GREY[800],
  lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#4c8cd1',
  dark: '#1939B7',
  darker: '#091A7A',
  contrastText: '#fff',
};

const ERROR = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#fff',
};

const paperBoxShadow = '#E5EAF1';
const sectionBg = '#F5F6F8';
// const footerTopBg = '#3e4655'
const footerAppBg = '#fff';
const footerTopBgColor = '#00000050';
const footerCenterBg = '#2f3645';
const footerMiddleBg = '#343c4d';
const cardBackground1 = '#FFFFFF';
const cardBackground2 = '#FFFFFF';

const borderBottomBg = '#D1D5DB';
const navbarBg = '#4c8cd1';
const footerTopBg = neutral[1500];
const skeletonColor = 'linear-gradient(78.58deg, #F5F6F8 3.23%, #FBFBFB 53.13%, #F6F7F8 100%)';
const skeletonColorAfter = 'linear-gradient(78.58deg, #F5F6F8 3.23%, #FDFDFD 53.13%, #F6F7F8 100%)';
const background = {
  default: '#FFFFFF',
  paper: '#FFFFFF',
  neutral: GREY[200],
  buttonBackground: 'rgba(82, 102, 208, 0.05)',
  profileBackground: '#FBFBFB',
  toaster: '#FFFFFF',
  trans: '#ffffff33',
  black: '#101010',
  blue: '#215C9C',
  lightBlue: '#D1E5FF',
  red: '#80340E',
  gray: '#F4F4F4',
  gray2: '#F6F6F6',
  green: '#94FF42',
  lightBg: '#F1FAFE',
};
const whiteContainer = {
  main: '#F9FAFC',
  light: '#EF7822',
  dark: '#ff903f',
  contrastText: '#EF7822',
};

const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  mixed: MIXED,
  error: ERROR,
  grey: GREY,

  divider: alpha(GREY[500], 0.24),
  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
  paperBoxShadow,
  background,
  neutral: neutral,
  blue: blue,
  footerAppBg,
  footerTopBg,
  footerCenterBg,
  footerMiddleBg,
  footerTopBgColor,
  sectionBg,
  cardBackground1,
  cardBackground2,
  borderBottomBg,
  navbarBg,
  skeletonColorAfter,
  whiteContainer,
};

export default function palette(themeMode) {
  const light = {
    ...COMMON,
    mode: 'light',
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500],
      gray: GREY[400],
      offWhite: GREY[300],
      light: GREY[200],
      white: GREY[0],
    },
    action: {
      ...COMMON.action,
      active: GREY[600],
    },
  };

  const dark = {
    ...COMMON,
    mode: 'dark',
    text: {
      primary: '#fff',
      secondary: GREY[500],
      disabled: GREY[600],
      gray: GREY[400],
      offWhite: GREY[300],
      light: GREY[200],
      white: GREY[0],
    },
    background: {
      paper: GREY[800],
      default: GREY[900],
      neutral: alpha(GREY[500], 0.16),
    },
    action: {
      ...COMMON.action,
      active: GREY[500],
    },
  };

  return themeMode === 'light' ? light : dark;
}
