import { Stack } from 'expo-router';
import { ErrorBoundary } from '../../../src/errors/ErrorBoundary';

export default function CollectionLayout() {
  return (
    <ErrorBoundary fallbackLabel="Não foi possível carregar sua coleção.">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[id]" />
        <Stack.Screen name="new" />
        <Stack.Screen name="edit/[id]" />
        <Stack.Screen name="gallery" />
      </Stack>
    </ErrorBoundary>
  );
}
