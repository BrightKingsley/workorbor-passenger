import {TextStyle, ViewStyle} from 'react-native';
import {PaletteColor, PaletteColorName, useTheme} from './ThemeContext';
import React from 'react';

export interface UsePaletteValue {
  colors: PaletteColor;
  view: ViewStyle;
  viewLight: ViewStyle;
  btn: ViewStyle;
  border: ViewStyle;
  borderDark: ViewStyle;
  text: TextStyle;
  link: TextStyle;
  icon: TextStyle;
}

export function usePalette(color: PaletteColorName): UsePaletteValue {
  const theme = useTheme();
  return React.useMemo(() => {
    const palette = theme.palette[color];
    return {
      colors: palette,
      view: {
        backgroundColor: palette.background,
      },
      viewLight: {
        backgroundColor: palette.backgroundLight,
      },
      btn: {
        backgroundColor: palette.backgroundLight,
      },
      border: {
        borderColor: palette.background,
      },
      borderDark: {
        borderColor: palette.border,
      },
      text: {
        color: palette.text,
      },
      link: {
        color: palette.background,
      },
      icon: {
        color: palette.icon,
      },
    };
  }, [theme, color]);
}
