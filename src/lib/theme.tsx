import { createContext, useContext, ReactNode } from 'react';

export const tokens = {
  color: {
    background: '#0F0D1A',
    surface: '#1A1829',
    surfaceLight: '#24223A',
    surfaceVariant: '#2A2842',
    surfaceContainer: '#1E1C2D',
    surfaceContainerHigh: '#2A2842',

    primary: '#8B3FCC',
    primaryContainer: '#632B94',
    onPrimaryContainer: '#E8D5FA',

    secondary: '#E8A500',
    onSecondary: '#FFF',
    secondaryContainer: '#996C00',
    onSecondaryContainer: '#FFEBB8',

    tertiary: '#059669',

    accent: '#9D4EDD',
    accentLight: '#B56FFF',
    gold: '#FFB703',
    goldLight: '#FFC933',

    text: '#FFFFFF',
    textMuted: '#8A86A8',
    onSurface: '#E2E8F0',
    onSurfaceVariant: '#94A3B8',
    outlineVariant: '#475569',

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
    gutter: 16,
  },
  fontSize: {
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    display: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    displayLg: { fontFamily: 'Poppins_700Bold', fontSize: 32, lineHeight: 40 },
    headlineLgMobile: { fontFamily: 'Poppins_700Bold', fontSize: 24, lineHeight: 32 },
    headlineMd: { fontFamily: 'Poppins_600SemiBold', fontSize: 20, lineHeight: 28 },
    bodyLg: { fontFamily: 'Poppins_400Regular', fontSize: 16, lineHeight: 24 },
    bodyMd: { fontFamily: 'Poppins_400Regular', fontSize: 14, lineHeight: 20 },
    labelMd: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    labelSm: { fontFamily: 'Poppins_500Medium', fontSize: 11, lineHeight: 16, letterSpacing: 0.5 },
  },
  shadow: {
    glassCard: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    neonGlowPurple: {
      shadowColor: '#8B3FCC',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    },
    neonGlowGold: {
      shadowColor: '#E8A500',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    },
    avatarGlow: {
      shadowColor: '#8B3FCC',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 4,
    },
    winnerGlow: {
      shadowColor: '#FFB703',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 8,
    },
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
