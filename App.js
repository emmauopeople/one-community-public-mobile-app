import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { mockSkills, getProviderById } from './src/data/mockSkills';
import { CATEGORIES, DEFAULT_CITY } from './src/utils/constants';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryContact, setInquiryContact] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  const filteredSkills = useMemo(() => {
    return mockSkills.filter((skill) => {
      const matchesCategory = category === 'All Categories' || skill.category === category;
      const text = `${skill.title} ${skill.category} ${skill.city} ${skill.shortDescription}`.toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const activeSkill = selectedSkill || filteredSkills[0];
  const provider = activeSkill ? getProviderById(activeSkill.providerId) : null;

  const handleWhatsAppPress = () => {
    if (!provider || !activeSkill) return;
    Alert.alert(
      'WhatsApp contact',
      `In the next version this button will open WhatsApp for ${provider.name}.\n\nPilot number: ${provider.whatsapp}\nService: ${activeSkill.title}`
    );
  };

  const handleOpenInquiry = () => {
    if (activeSkill) {
      setInquiryMessage(`Hello, I am interested in ${activeSkill.title}. Please contact me with more details.`);
    }
    setInquiryOpen(true);
  };

  const handleSubmitInquiry = () => {
    if (!inquiryName.trim() || !inquiryContact.trim() || !inquiryMessage.trim()) {
      Alert.alert('Missing information', 'Please enter your name, contact, and message.');
      return;
    }

    Alert.alert(
      'Inquiry ready',
      'This pilot version captured the inquiry locally. The next version will send it to the backend contact endpoint.'
    );
    setInquiryOpen(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.brand}>One Community</Text>
          <Text style={styles.heroTitle}>Find trusted local services near you.</Text>
          <Text style={styles.heroText}>
            Search for carpenters, plumbers, mechanics, tutors, tailors, and other local providers in Cameroon.
          </Text>
          <View style={styles.locationBadge}>
            <Text style={styles.locationText}>Pilot city: {DEFAULT_CITY}</Text>
          </View>
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="What service do you need?"
          style={styles.searchInput}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
          {CATEGORIES.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setCategory(item)}
              style={[styles.categoryPill, category === item && styles.categoryPillActive]}
            >
              <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Available services</Text>
        {filteredSkills.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptyText}>Try another keyword or category.</Text>
          </View>
        ) : (
          filteredSkills.map((skill) => (
            <TouchableOpacity key={skill.id} style={styles.card} onPress={() => setSelectedSkill(skill)}>
              <View style={styles.thumbnail}>
                <Text style={styles.thumbnailText}>{skill.category.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{skill.title}</Text>
                <Text style={styles.cardMeta}>{skill.category} - {skill.city}</Text>
                <Text style={styles.cardText}>{skill.shortDescription}</Text>
                <Text style={styles.trustLabel}>{skill.trustLabel}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        {activeSkill && provider && (
          <View style={styles.detailPanel}>
            <Text style={styles.sectionTitle}>Selected service</Text>
            <Text style={styles.detailTitle}>{activeSkill.title}</Text>
            <Text style={styles.detailMeta}>{activeSkill.category} - {activeSkill.area}, {activeSkill.city}</Text>
            <Text style={styles.detailText}>{activeSkill.description}</Text>

            <View style={styles.providerBox}>
              <Text style={styles.providerLabel}>Provider</Text>
              <Text style={styles.providerName}>{provider.name}</Text>
              <Text style={styles.cardMeta}>{provider.area}, {provider.city} - {provider.region}</Text>
              <Text style={styles.cardText}>{provider.bio}</Text>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleWhatsAppPress}>
              <Text style={styles.primaryButtonText}>Contact by WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleOpenInquiry}>
              <Text style={styles.secondaryButtonText}>Send inquiry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal visible={inquiryOpen} transparent animationType="slide" onRequestClose={() => setInquiryOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Send inquiry</Text>
            <Text style={styles.modalText}>Share your contact information and a short message for the provider.</Text>

            <TextInput
              value={inquiryName}
              onChangeText={setInquiryName}
              placeholder="Your name"
              style={styles.modalInput}
            />
            <TextInput
              value={inquiryContact}
              onChangeText={setInquiryContact}
              placeholder="Phone or email"
              style={styles.modalInput}
            />
            <TextInput
              value={inquiryMessage}
              onChangeText={setInquiryMessage}
              placeholder="Message"
              multiline
              numberOfLines={4}
              style={[styles.modalInput, styles.messageInput]}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmitInquiry}>
              <Text style={styles.primaryButtonText}>Submit inquiry</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setInquiryOpen(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  container: {
    padding: 20,
    paddingBottom: 40
  },
  hero: {
    backgroundColor: '#dcfce7',
    borderRadius: 24,
    padding: 22,
    marginBottom: 16
  },
  brand: {
    color: '#166534',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12
  },
  heroTitle: {
    color: '#111827',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    marginBottom: 10
  },
  heroText: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 22
  },
  locationBadge: {
    backgroundColor: '#ffffff',
    borderRadius: 99,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 16
  },
  locationText: {
    color: '#166534',
    fontWeight: '700'
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12
  },
  categoryRow: {
    marginBottom: 18
  },
  categoryPill: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginRight: 8
  },
  categoryPillActive: {
    backgroundColor: '#15803d',
    borderColor: '#15803d'
  },
  categoryText: {
    color: '#374151',
    fontWeight: '600'
  },
  categoryTextActive: {
    color: '#ffffff'
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  thumbnailText: {
    color: '#166534',
    fontWeight: '800'
  },
  cardBody: {
    flex: 1
  },
  cardTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 3
  },
  cardMeta: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 6
  },
  cardText: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20
  },
  trustLabel: {
    color: '#15803d',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8
  },
  detailPanel: {
    marginTop: 18,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  detailTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6
  },
  detailMeta: {
    color: '#15803d',
    fontWeight: '700',
    marginBottom: 10
  },
  detailText: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 16
  },
  providerBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14
  },
  providerLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3
  },
  providerName: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4
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
    fontWeight: '800'
  },
  secondaryButton: {
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#166534',
    fontSize: 16,
    fontWeight: '800'
  },
  emptyBox: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  emptyTitle: {
    fontWeight: '800',
    fontSize: 17,
    marginBottom: 6
  },
  emptyText: {
    color: '#6b7280'
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
    padding: 20
  },
  modalTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
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
    fontWeight: '700'
  }
});
