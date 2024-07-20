import * as React from 'react';
import {ViewStyle, TextStyle} from 'react-native';
import {darkTheme, defaultTheme} from './themes';
import {ThemeName} from './types';

export type ColorScheme = 'light' | 'dark';

export type PaletteColorName =
  | 'default'
  | 'inverted'
  | 'secondary'
  | 'error'
  | 'primary';

export type PaletteColor = {
  background: string;
  backgroundLight: string;
  text: string;
  textLight: string;
  textInverted: string;
  border: string;
  borderDark: string;
  icon: string;
  link: string;
  [k: string]: string;
};

export type Palette = Record<PaletteColorName, PaletteColor>;

export type TypographyVariant =
  | '2xl-thin'
  | '2xl'
  | '2xl-medium'
  | '2xl-bold'
  | '2xl-heavy'
  | 'xl-thin'
  | 'xl'
  | 'xl-medium'
  | 'xl-bold'
  | 'xl-heavy'
  | 'lg-thin'
  | 'lg'
  | 'lg-medium'
  | 'lg-bold'
  | 'lg-heavy'
  | 'md-thin'
  | 'md'
  | 'md-medium'
  | 'md-bold'
  | 'md-heavy'
  | 'sm-thin'
  | 'sm'
  | 'sm-medium'
  | 'sm-bold'
  | 'sm-heavy'
  | 'xs-thin'
  | 'xs'
  | 'xs-medium'
  | 'xs-bold'
  | 'xs-heavy'
  | 'title-2xl'
  | 'title-xl'
  | 'title-lg'
  | 'title-md'
  | 'title-sm'
  | 'btn-text-xl'
  | 'btn-text-lg'
  | 'btn-text-md'
  | 'btn-text-sm';

export type Typography = Record<TypographyVariant, TextStyle>;

export type ShapeName = 'button' | 'bigButton' | 'smallButton';

export type Shape = Record<ShapeName, ViewStyle>;

export interface Theme {
  colorScheme: ColorScheme;
  palette: Palette;
  //   shape: Shape;
  //   typography: Typography;
}

export interface ThemeProviderProps {
  children?: React.ReactNode;
  theme: ThemeName;
}

export const ThemeContext = React.createContext<Theme>(defaultTheme);

export const useTheme = () => React.useContext(ThemeContext);

function getTheme(theme: ThemeName) {
  switch (theme) {
    case 'light':
      return defaultTheme;
    case 'dim':
      return darkTheme;
    case 'dark':
      return darkTheme;
    default:
      return defaultTheme;
  }
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme,
  children,
}) => {
  const themeValue = getTheme(theme);

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
};
