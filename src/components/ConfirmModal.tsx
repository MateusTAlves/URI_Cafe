// src/components/ConfirmModal.tsx
import React from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../utils/theme';

interface Props {
  visible: boolean;
  titulo: string;
  mensagem: string;
  textoCancelar?: string;
  textoConfirmar?: string;
  icone?: string;
  destrutivo?: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export function ConfirmModal({
  visible,
  titulo,
  mensagem,
  textoCancelar = 'Cancelar',
  textoConfirmar = 'Confirmar',
  icone = 'alert-circle-outline',
  destrutivo = false,
  onCancelar,
  onConfirmar,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancelar}
    >
      <TouchableWithoutFeedback onPress={onCancelar}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>

              {/* Ícone */}
              <View style={[
                styles.iconBox,
                { backgroundColor: destrutivo ? Colors.delete + '18' : Colors.accent + '18' },
              ]}>
                <Ionicons
                  name={icone as any}
                  size={32}
                  color={destrutivo ? Colors.delete : Colors.accent}
                />
              </View>

              {/* Texto */}
              <Text style={styles.titulo}>{titulo}</Text>
              <Text style={styles.mensagem}>{mensagem}</Text>

              {/* Botões */}
              <View style={styles.botoesRow}>
                <TouchableOpacity style={styles.btnCancelar} onPress={onCancelar} activeOpacity={0.8}>
                  <Text style={styles.btnCancelarText}>{textoCancelar}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnConfirmar, destrutivo && { backgroundColor: Colors.delete }]}
                  onPress={onConfirmar}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnConfirmarText}>{textoConfirmar}</Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(61, 28, 2, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadow.card,
    shadowOpacity: 0.2,
    elevation: 8,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  titulo: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
  },
  mensagem: {
    fontSize: Fonts.sizes.sm,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  botoesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
    marginTop: Spacing.sm,
  },
  btnCancelar: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  btnCancelarText: {
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
    color: Colors.muted,
  },
  btnConfirmar: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 13,
    alignItems: 'center',
  },
  btnConfirmarText: {
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
    color: Colors.background,
  },
});
