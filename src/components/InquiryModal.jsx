import React from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import GradientButton from './GradientButton';

export default function InquiryModal({
  visible,
  name,
  contact,
  message,
  isSubmitting = false,
  onChangeName,
  onChangeContact,
  onChangeMessage,
  onSubmit,
  onClose
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Send email inquiry</Text>
          <Text style={styles.modalText}>Enter your email address and a clear message for the provider.</Text>

          <TextInput value={name} onChangeText={onChangeName} placeholder="Your name" style={styles.modalInput} editable={!isSubmitting} />
          <TextInput
            value={contact}
            onChangeText={onChangeContact}
            placeholder="Your email address"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.modalInput}
            editable={!isSubmitting}
          />
          <TextInput
            value={message}
            onChangeText={onChangeMessage}
            placeholder="Message"
            multiline
            numberOfLines={4}
            style={[styles.modalInput, styles.messageInput]}
            editable={!isSubmitting}
          />

          <GradientButton title={isSubmitting ? 'Sending...' : 'Submit inquiry'} onPress={onSubmit} disabled={isSubmitting} />
          <TouchableOpacity style={styles.modalCancelButton} onPress={onClose} disabled={isSubmitting}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '82%'
  },
  modalTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6
  },
  modalText: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 10
  },
  messageInput: {
    minHeight: 96,
    textAlignVertical: 'top'
  },
  modalCancelButton: {
    alignItems: 'center',
    paddingVertical: 12
  },
  modalCancelText: {
    color: '#6b7280',
    fontWeight: '800'
  }
});
