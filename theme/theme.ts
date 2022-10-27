import { DefaultMantineColor, MantineThemeOverride, Tuple } from '@mantine/core';

type ExtendedCustomColors = 'brandOrange' | 'brandGray' | 'twitter' | 'youtube' | 'facebook' | 'instagram' | DefaultMantineColor;

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}

const appTheme: MantineThemeOverride = {
  colorScheme: 'light',
  colors: {
    'brandOrange': ['#FFF4E5', '#FFE0B8', '#FFCC8A', '#FFB95C', '#FFA52E', '#FF9100', '#CC7400', '#995700', '#663A00', '#331D00'],
    'brandGray': ['#565656', '#474747', '#3A3A3A', '#303030', '#282828', '#212121', '#1A1A1A', '#101010', '#0D0D0D', '#0A0A0A'],
    'light': ['#FFFFFF', '#E0E0E0', '#CCCCCC', '#B8B8B8', '#A3A3A3', '#8F8F8F', '#7A7A7A', '#666666', '#525252', '#212121'],

    'twitter': ["#CDEAFC", "#A2D8FA", "#7BC8F7", "#58BAF5", "#39ADF4", "#1DA1F2", "#0D92E4", "#0C82CB", "#0A74B5", "#0967A1",],
    'youtube': ["#FFAFAF", "#FF8484", "#FF5E5E", "#FF3B3B", "#FF1C1C", "#FF0000", "#E30000", "#CA0000", "#B40000", "#A00000",],
    'facebook': ["#B7C6E4", "#99AED9", "#7E99CF", "#6686C6", "#5175BE", "#4267B2", "#3B5C9E", "#34528D", "#2F497D", "#294170",],
    'instagram': ["#CEADE4", "#BC8FDB", "#AC73D2", "#9E5BCA", "#9045C3", "#833AB4", "#7534A0", "#682E8F", "#5C297F", "#522471",]
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