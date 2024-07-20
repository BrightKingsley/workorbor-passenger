import {useTheme} from './ThemeContext';

export function useColorSchemeStyle<T>(lightStyle: T, darkStyle: T) {
  const colorScheme = useTheme().colorScheme;
  return colorScheme === 'dark' ? darkStyle : lightStyle;
}
