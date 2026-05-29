import { View, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '../../lib/theme';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function ScreenShell({ children, scroll = false, refreshing, onRefresh }: Props) {
  const { tokens } = useTheme();

  const content = (
    <View style={{ flex: 1, backgroundColor: tokens.color.background, padding: tokens.spacing.lg }}>
      {children}
    </View>
  );

  if (!scroll) return content;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.color.background }}
      refreshControl={
        refreshing !== undefined ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tokens.color.accent}
          />
        ) : undefined
      }
    >
      <View style={{ padding: tokens.spacing.lg }}>{children}</View>
    </ScrollView>
  );
}
