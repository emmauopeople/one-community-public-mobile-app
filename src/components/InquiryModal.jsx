import React from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function InquiryModal({
  visible,
  name,
  contact,
  message,
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
          <Text style={styles.modalText}>Enter your contact information and a clear message for the provider.</Text>

          <TextInput value={name} onChangeText={onChangeName} placeholder="Your name" style={styles.modalInput} />
          <TextInput value={contact} onChangeText={onChangeContact} placeholder="Phone or email" style={styles.modalInput} />
          <TextInput
            value={message}
            onChangeText={onChangeMessage}
            placeholder="Message"
            multiline
            numberOfLines={4}
            style={[styles.modalInput, styles.messageInput]}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
            <Text style={styles.primaryButtonText}>Submit inquiry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
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
  primaryButton: {
    backgroundColor: '#15803d',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900'
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
