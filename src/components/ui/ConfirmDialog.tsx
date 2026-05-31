import { View, Text, Pressable, Modal } from 'react-native';
import { useTheme } from '../../lib/theme';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  destructive = false,
}: Props) {
  const { tokens } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: tokens.spacing.lg,
        }}
      >
        <View
          accessibilityRole="alert"
          style={{
            backgroundColor: tokens.color.surface,
            borderRadius: tokens.borderRadius.lg,
            padding: tokens.spacing.lg,
            width: '100%',
            maxWidth: 340,
          }}
        >
          <Text
            style={{ color: tokens.color.text, fontSize: tokens.fontSize.xl, fontWeight: 'bold' }}
          >
            {title}
          </Text>
          <Text
            style={{ color: tokens.color.textMuted, marginTop: tokens.spacing.sm, lineHeight: 22 }}
          >
            {message}
          </Text>
          <View
            style={{ flexDirection: 'row', gap: tokens.spacing.sm, marginTop: tokens.spacing.lg }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
              onPress={onCancel}
              style={{
                flex: 1,
                backgroundColor: tokens.color.surfaceLight,
                borderRadius: tokens.borderRadius.md,
                padding: tokens.spacing.md,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: tokens.color.text }}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              onPress={onConfirm}
              style={{
                flex: 1,
                backgroundColor: destructive ? tokens.color.error : tokens.color.accent,
                borderRadius: tokens.borderRadius.md,
                padding: tokens.spacing.md,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
