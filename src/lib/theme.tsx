import { createContext, useContext, ReactNode } from 'react';

export const tokens = {
  color: {
    background: '#12101F',
    surface: '#1A1829',
    surfaceLight: '#24223A',
    accent: '#9D4EDD',
    accentLight: '#B56FFF',
    gold: '#FFB703',
    goldLight: '#FFC933',
    text: '#FFFFFF',
    textMuted: '#8A86A8',
    border: '#2A2842',
    error: '#E5484D',
    success: '#46A758',
    warning: '#FFB703',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSize: {
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    display: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
} as const;

type ThemeContextType = { tokens: typeof tokens };
const ThemeContext = createContext<ThemeContextType>({ tokens });

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value={{ tokens }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
