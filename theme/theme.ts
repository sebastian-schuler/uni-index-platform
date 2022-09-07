import { MantineThemeOverride } from '@mantine/core';


// declare module '@mui/material/styles' {
//   interface Palette {
//     tertiary: Palette['primary'];
//   }

//   // allow configuration using `createTheme`
//   interface PaletteOptions {
//     tertiary?: PaletteOptions['primary'];
//   }
// }

// Create a theme instance.

// const defaultTheme = createTheme();

// let theme = createTheme({
//   palette: {
//     primary: {
//       main: '#FF9100',
//       contrastText: '#fff',
//       '500': '#FFA733',
//     },
//     secondary: {
//       main: grey[900],
//     },
//     background: {
//       default: '#F3F4F7',
//     },
//     tertiary:{
//       main: '#AA0000',
//     },
//     error: {
//       main: '#ED254E',
//     },
//     common: {
//       white: '#fff',
//       black: '#000',
//     },
//     text: {
//       primary: '#212121',
//     },
//     mode: 'light',
//   },

// });

// theme = createTheme(theme,{
//   // components: {
//   //   MuiListItemButton: {
//   //     styleOverrides: {
//   //       root: {

//   //       }
//   //     }
//   //   }
//   // }
// });

const appTheme: MantineThemeOverride = {
  colorScheme: 'light',
  colors: {
    'brandOrange': ['#FFF4E5', '#FFE0B8', '#FFCC8A', '#FFB95C', '#FFA52E', '#FF9100', '#CC7400', '#995700', '#663A00', '#331D00'],
    'brandGray': ['#565656', '#474747', '#3A3A3A', '#303030', '#282828', '#212121', '#1A1A1A', '#101010', '#0D0D0D', '#0A0A0A'],
    'light': ['#FFFFFF'],
    'dark': ['#212121'],
  },
  white: '#F3F4F7',
  primaryColor: 'brandOrange',
  primaryShade: 5,
  defaultRadius: 0,
};



export default appTheme;