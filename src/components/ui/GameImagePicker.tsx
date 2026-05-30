import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../lib/theme';

interface GameImagePickerProps {
  value: string | null | undefined;
  onChange: (uri: string | null) => void;
}

/**
 * Componente para selecionar e exibir a foto de capa de um jogo.
 * Usa expo-image-picker para acessar a galeria do dispositivo.
 */
export function GameImagePicker({ value, onChange }: GameImagePickerProps) {
  const { tokens } = useTheme();

  const handlePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso à galeria para selecionar uma foto do jogo.',
        [{ text: 'OK' }],
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  const handleRemove = () => {
    Alert.alert('Remover foto', 'Deseja remover a foto do jogo?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => onChange(null) },
    ]);
  };

  if (value) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: value }} style={styles.previewImage} resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(10, 8, 23, 0.85)']}
          style={StyleSheet.absoluteFill}
          locations={[0.5, 1]}
        />
        <View style={styles.previewActions}>
          <TouchableOpacity style={styles.changeButton} onPress={handlePick} activeOpacity={0.8}>
            <MaterialIcons name="photo-camera" size={18} color={tokens.color.onPrimaryContainer} />
            <Text
              style={[
                tokens.typography.labelMd,
                { color: tokens.color.onPrimaryContainer, marginLeft: 6 },
              ]}
            >
              Alterar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton} onPress={handleRemove} activeOpacity={0.8}>
            <MaterialIcons name="delete" size={18} color={tokens.color.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.emptyContainer} onPress={handlePick} activeOpacity={0.7}>
      <LinearGradient
        colors={['rgba(139, 63, 204, 0.08)', 'rgba(139, 63, 204, 0.04)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.emptyContent}>
        <View style={styles.iconWrapper}>
          <MaterialIcons name="add-photo-alternate" size={32} color={tokens.color.primary} />
        </View>
        <Text style={[tokens.typography.labelMd, { color: tokens.color.primary, marginTop: 10 }]}>
          ADICIONAR FOTO DO JOGO
        </Text>
        <Text
          style={[
            tokens.typography.bodyMd,
            { color: tokens.color.onSurfaceVariant, marginTop: 4, textAlign: 'center' },
          ]}
        >
          Toque para selecionar da galeria
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    height: 160,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(200, 155, 255, 0.35)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(139, 63, 204, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewActions: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 63, 204, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 18, 35, 0.85)',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 133, 133, 0.4)',
  },
});
