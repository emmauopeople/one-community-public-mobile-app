import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
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
import { mockSkills, getProviderById, getSkillsByProviderId } from './src/data/mockSkills';
import { CATEGORIES, DEFAULT_CITY } from './src/utils/constants';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [screen, setScreen] = useState('home');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryContact, setInquiryContact] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  const filteredSkills = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return mockSkills.filter((skill) => {
      const provider = getProviderById(skill.providerId);
      const matchesCategory = category === 'All Categories' || skill.category === category;
      const searchableText = [
        skill.title,
        skill.category,
        skill.city,
        skill.region,
        skill.area,
        skill.shortDescription,
        skill.description,
        provider?.name
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesQuery = cleanQuery.length === 0 || searchableText.includes(cleanQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const activeSkill = selectedSkill;
  const activeProvider = activeSkill ? getProviderById(activeSkill.providerId) : null;
  const profileProvider = selectedProviderId ? getProviderById(selectedProviderId) : activeProvider;
  const providerSkills = profileProvider ? getSkillsByProviderId(profileProvider.id) : [];
  const similarSkills = activeSkill
    ? mockSkills.filter((skill) => skill.id !== activeSkill.id && skill.category === activeSkill.category).slice(0, 4)
    : [];

  const openSkillDetail = (skill) => {
    setSelectedSkill(skill);
    setSelectedProviderId(skill.providerId);
    setScreen('detail');
  };

  const openProviderProfile = (providerId) => {
    setSelectedProviderId(providerId);
    setScreen('provider');
  };

  const closeToHome = () => {
    setScreen('home');
    setSelectedSkill(null);
    setSelectedProviderId(null);
  };

  const handleBack = () => {
    if (screen === 'provider' && selectedSkill) {
      setScreen('detail');
      return;
    }
    closeToHome();
  };

  const handleWhatsAppPress = async () => {
    if (!activeProvider || !activeSkill) return;
    const message = `Hello, I found your service on One Community. I am interested in ${activeSkill.title}.`;
    const url = `https://wa.me/${activeProvider.whatsapp}?text=${encodeURIComponent(message)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('WhatsApp unavailable', `Please contact ${activeProvider.name} directly: ${activeProvider.whatsapp}`);
    }
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

    Alert.alert('Inquiry ready', 'The inquiry was captured in this pilot version. The next version will send it to the backend.');
    setInquiryOpen(false);
  };

  const renderTopBar = (title) => (
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.topButton} onPress={handleBack}>
        <Text style={styles.topButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.topTitle}>{title}</Text>
      <TouchableOpacity style={styles.topButton} onPress={closeToHome}>
        <Text style={styles.topButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSkillCard = (skill, compact = false) => (
    <TouchableOpacity key={skill.id} style={styles.gridCard} onPress={() => openSkillDetail(skill)}>
      <Image source={{ uri: skill.imageUrl }} style={[styles.gridImage, compact && styles.gridImageSmall]} />
      <View style={styles.cardContent}>
        <Text numberOfLines={2} style={styles.gridTitle}>{skill.title}</Text>
        <Text numberOfLines={1} style={styles.gridMeta}>{skill.city} - {skill.category}</Text>
        <Text numberOfLines={1} style={styles.gridTrust}>{skill.trustLabel}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHome = () => (
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
        placeholder="Search service, city, provider, or category"
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

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Available services</Text>
        <Text style={styles.resultCount}>{filteredSkills.length} found</Text>
      </View>

      {filteredSkills.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No services found</Text>
          <Text style={styles.emptyText}>Try a simple word like carpenter, tailor, electrical, Douala, or Yaounde.</Text>
        </View>
      ) : (
        <View style={styles.grid}>{filteredSkills.map((skill) => renderSkillCard(skill))}</View>
      )}
    </ScrollView>
  );

  const renderDetail = () => {
    if (!activeSkill || !activeProvider) return renderHome();

    return (
      <ScrollView contentContainerStyle={styles.pageContainer}>
        {renderTopBar('Service Details')}
        <Image source={{ uri: activeSkill.imageUrl }} style={styles.detailImage} />
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{activeSkill.title}</Text>
          <Text style={styles.detailMeta}>{activeSkill.area}, {activeSkill.city} - {activeSkill.region}</Text>
          <Text style={styles.trustBadge}>{activeSkill.trustLabel}</Text>
          <Text style={styles.detailText}>{activeSkill.description}</Text>

          <TouchableOpacity style={styles.providerBox} onPress={() => openProviderProfile(activeProvider.id)}>
            <Text style={styles.providerLabel}>Provider Profile</Text>
            <Text style={styles.providerName}>{activeProvider.name}</Text>
            <Text style={styles.cardText}>{activeProvider.bio}</Text>
            <Text style={styles.viewProfileText}>View all provider listings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleWhatsAppPress}>
            <Text style={styles.primaryButtonText}>Contact by WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleOpenInquiry}>
            <Text style={styles.secondaryButtonText}>Send email inquiry</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Similar listings</Text>
        {similarSkills.length === 0 ? (
          <Text style={styles.emptyText}>No similar listings yet.</Text>
        ) : (
          <View style={styles.grid}>{similarSkills.map((skill) => renderSkillCard(skill, true))}</View>
        )}
      </ScrollView>
    );
  };

  const renderProvider = () => {
    if (!profileProvider) return renderHome();

    return (
      <ScrollView contentContainerStyle={styles.pageContainer}>
        {renderTopBar('Provider Profile')}
        <View style={styles.profileHeader}>
          <Text style={styles.profileName}>{profileProvider.name}</Text>
          <Text style={styles.detailMeta}>{profileProvider.area}, {profileProvider.city} - {profileProvider.region}</Text>
          <Text style={styles.trustBadge}>{profileProvider.statusLabel}</Text>
          <Text style={styles.detailText}>{profileProvider.bio}</Text>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Provider listings</Text>
          <Text style={styles.resultCount}>{providerSkills.length} skills</Text>
        </View>
        <View style={styles.grid}>{providerSkills.map((skill) => renderSkillCard(skill, true))}</View>

        <View style={styles.reviewsBox}>
          <Text style={styles.providerName}>Reviews coming soon</Text>
          <Text style={styles.cardText}>In the pilot, users can view provider profiles first. Public reviews will be added after validation.</Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      {screen === 'home' && renderHome()}
      {screen === 'detail' && renderDetail()}
      {screen === 'provider' && renderProvider()}

      <Modal visible={inquiryOpen} transparent animationType="slide" onRequestClose={() => setInquiryOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Send email inquiry</Text>
            <Text style={styles.modalText}>Enter your contact information and a clear message for the provider.</Text>

            <TextInput value={inquiryName} onChangeText={setInquiryName} placeholder="Your name" style={styles.modalInput} />
            <TextInput value={inquiryContact} onChangeText={setInquiryContact} placeholder="Phone or email" style={styles.modalInput} />
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
    padding: 14,
    paddingBottom: 40
  },
  pageContainer: {
    padding: 14,
    paddingBottom: 42
  },
  hero: {
    backgroundColor: '#dcfce7',
    borderRadius: 24,
    padding: 20,
    marginBottom: 14
  },
  brand: {
    color: '#166534',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10
  },
  heroTitle: {
    color: '#111827',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    marginBottom: 8
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
    marginTop: 14
  },
  locationText: {
    color: '#166534',
    fontWeight: '800'
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
    marginBottom: 16
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
    fontWeight: '700'
  },
  categoryTextActive: {
    color: '#ffffff'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 10
  },
  resultCount: {
    color: '#6b7280',
    fontWeight: '700'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  gridCard: {
    width: '48.5%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  gridImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#dcfce7'
  },
  gridImageSmall: {
    height: 130
  },
  cardContent: {
    padding: 10
  },
  gridTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4
  },
  gridMeta: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 5
  },
  gridTrust: {
    color: '#15803d',
    fontSize: 11,
    fontWeight: '900'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  topButton: {
    backgroundColor: '#ffffff',
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  topButtonText: {
    color: '#166534',
    fontWeight: '900'
  },
  topTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900'
  },
  detailImage: {
    width: '100%',
    height: 260,
    borderRadius: 24,
    backgroundColor: '#dcfce7',
    marginBottom: 12
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  detailTitle: {
    color: '#111827',
    fontSize: 25,
    fontWeight: '900',
    marginBottom: 6
  },
  detailMeta: {
    color: '#6b7280',
    fontWeight: '700',
    marginBottom: 8
  },
  trustBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 12
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
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  providerLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 3
  },
  providerName: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 5
  },
  viewProfileText: {
    color: '#15803d',
    fontWeight: '900',
    marginTop: 10
  },
  cardText: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20
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
  secondaryButton: {
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#166534',
    fontSize: 16,
    fontWeight: '900'
  },
  profileHeader: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  profileName: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 6
  },
  reviewsBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 6
  },
  emptyBox: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  emptyTitle: {
    fontWeight: '900',
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
