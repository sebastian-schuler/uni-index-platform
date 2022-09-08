import { MantineThemeOverride } from '@mantine/core';

const appTheme: MantineThemeOverride = {
  colorScheme: 'light',
  colors: {
    'brandOrange': ['#FFF4E5', '#FFE0B8', '#FFCC8A', '#FFB95C', '#FFA52E', '#FF9100', '#CC7400', '#995700', '#663A00', '#331D00'],
    'brandGray': ['#565656', '#474747', '#3A3A3A', '#303030', '#282828', '#212121', '#1A1A1A', '#101010', '#0D0D0D', '#0A0A0A'],
    'light': ['#FFFFFF'],
    'dark': ['#212121'],
  },
  fontFamily: 'roboto, arial, sans-serif',
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
  },
  white: '#F3F4F7',
  primaryColor: 'brandOrange',
  primaryShade: 5,
  defaultRadius: 0,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 32,
    xl: 64,
  },
  breakpoints: {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1400,
  }
};

export default appTheme;