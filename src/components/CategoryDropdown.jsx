import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CategoryDropdown({ categories, selectedCategory, visible, onOpen, onClose, onSelect }) {
  const selectedOption = categories.find((item) => item.value === selectedCategory) || categories[0];

  return (
    <>
      <TouchableOpacity style={styles.dropdownButton} onPress={onOpen}>
        <View>
          <Text style={styles.dropdownLabel}>Category</Text>
          <Text style={styles.dropdownValue}>{selectedOption?.label || 'All'}</Text>
        </View>
        <Text style={styles.dropdownArrow}>v</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose category</Text>
            <Text style={styles.modalText}>Filter listings by the service type you need.</Text>
            {categories.map((item) => (
              <TouchableOpacity key={item.value || 'all'} style={styles.categoryOption} onPress={() => onSelect(item.value)}>
                <Text style={[styles.categoryOptionText, selectedCategory === item.value && styles.categoryOptionTextActive]}>
                  {item.label}
                </Text>
                {selectedCategory === item.value && <Text style={styles.selectedMark}>Selected</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dropdownButton: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dropdownLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 3
  },
  dropdownValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900'
  },
  dropdownArrow: {
    color: '#166534',
    fontSize: 20,
    fontWeight: '900'
  },
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
  categoryOption: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  categoryOptionText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800'
  },
  categoryOptionTextActive: {
    color: '#15803d'
  },
  selectedMark: {
    color: '#15803d',
    fontSize: 12,
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
