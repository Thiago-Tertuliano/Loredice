import { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { tokens } from '../lib/theme';

interface Props {
  children: ReactNode;
  fallbackLabel?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (__DEV__) {
      console.error('ErrorBoundary caught:', error, errorInfo.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <View
          accessibilityRole="alert"
          style={{
            flex: 1,
            backgroundColor: tokens.color.background,
            justifyContent: 'center',
            alignItems: 'center',
            padding: tokens.spacing.lg,
          }}
        >
          <Text style={{ fontSize: 48 }}>⚠️</Text>
          <Text
            style={{
              color: tokens.color.text,
              fontSize: tokens.fontSize.xl,
              fontWeight: 'bold',
              marginTop: tokens.spacing.md,
              textAlign: 'center',
            }}
          >
            {this.props.fallbackLabel ?? 'Algo deu errado'}
          </Text>
          <Text
            style={{
              color: tokens.color.textMuted,
              marginTop: tokens.spacing.sm,
              textAlign: 'center',
            }}
          >
            Se o problema persistir, reinicie o app.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tentar novamente"
            onPress={this.handleRetry}
            style={{
              backgroundColor: tokens.color.accent,
              borderRadius: tokens.borderRadius.md,
              padding: tokens.spacing.md,
              marginTop: tokens.spacing.lg,
            }}
          >
            <Text style={{ color: tokens.color.text, fontWeight: 'bold' }}>Tentar Novamente</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
