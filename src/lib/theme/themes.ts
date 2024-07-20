import {darkPalette, lightPalette} from '#/lib/ui/palette';

import {colors} from './palette';
import {Theme} from './ThemeContext';

export const defaultTheme: Theme = {
  colorScheme: 'light',
  palette: {
    default: {
      background: lightPalette.white,
      backgroundLight: lightPalette.contrast_25,
      text: lightPalette.black,
      textLight: lightPalette.contrast_700,
      textInverted: lightPalette.white,
      link: lightPalette.primary_500,
      border: lightPalette.contrast_100,
      borderDark: lightPalette.contrast_200,
      icon: lightPalette.contrast_500,
    },
    primary: {
      background: colors.grayblue,
      backgroundLight: colors.graygreen,
      text: colors.light,
      textLight: colors.graygreen,
      textInverted: colors.grayblue,
      link: colors.graygreen,
      border: colors.beige,
      borderDark: colors.beige,
      icon: colors.beige,
    },
    secondary: {
      background: colors.graygreen,
      backgroundLight: colors.beige,
      text: colors.light,
      textLight: colors.grayblue,
      textInverted: colors.beige,
      link: colors.grayblue,
      border: colors.beige,
      borderDark: colors.beige,
      icon: colors.beige,
    },
    inverted: {
      background: darkPalette.black,
      backgroundLight: darkPalette.contrast_50,
      text: darkPalette.white,
      textLight: darkPalette.contrast_700,
      textInverted: darkPalette.black,
      link: darkPalette.primary_500,
      border: darkPalette.contrast_100,
      borderDark: darkPalette.contrast_200,
      icon: darkPalette.contrast_500,
    },
    error: {
      background: colors.error_light,
      backgroundLight: colors.error_light,
      text: colors.light,
      textLight: colors.error,
      textInverted: colors.error_light,
      link: colors.error,
      border: colors.error_light,
      borderDark: colors.error_light,
      icon: colors.error_light,
    },
  },
};

export const darkTheme: Theme = {
  ...defaultTheme,
  colorScheme: 'dark',
  palette: {
    ...defaultTheme.palette,
    default: {
      background: darkPalette.black,
      backgroundLight: darkPalette.contrast_50,
      text: darkPalette.white,
      textLight: darkPalette.contrast_700,
      textInverted: darkPalette.black,
      border: darkPalette.contrast_100,
      borderDark: darkPalette.contrast_200,
      icon: darkPalette.contrast_500,
      link: darkPalette.primary_500,
    },
    inverted: {
      background: lightPalette.white,
      backgroundLight: lightPalette.contrast_50,
      text: lightPalette.black,
      textLight: lightPalette.contrast_700,
      textInverted: lightPalette.white,
      link: lightPalette.primary_500,
      border: lightPalette.contrast_100,
      borderDark: lightPalette.contrast_200,
      icon: lightPalette.contrast_500,
    },
    primary: {
      ...defaultTheme.palette.default,
      textInverted: colors.graygreen,
    },
    secondary: {
      ...defaultTheme.palette.secondary,
      textInverted: colors.beige,
    },
  },
};
