import { Stack } from 'expo-router';
import { ErrorBoundary } from '../../../src/errors/ErrorBoundary';

export default function ScoreboardsLayout() {
  return (
    <ErrorBoundary fallbackLabel="Não foi possível carregar os placares.">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="truco" />
        <Stack.Screen name="universal" />
        <Stack.Screen name="history" />
      </Stack>
    </ErrorBoundary>
  );
}
