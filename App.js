import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import SkillCard from './src/components/SkillCard';
import CategoryDropdown from './src/components/CategoryDropdown';
import InquiryModal from './src/components/InquiryModal';
import { mockSkills, getProviderById, getSkillsByProviderId } from './src/data/mockSkills';
import { CATEGORIES, DEFAULT_CITY } from './src/utils/constants';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [categoryOpen, setCategoryOpen] = useState(false);
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

      return matchesCategory && (cleanQuery.length === 0 || searchableText.includes(cleanQuery));
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

  const handleCategorySelect = (item) => {
    setCategory(item);
    setCategoryOpen(false);
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

  const renderSkillGrid = (skills, compact = false) => (
    <View style={styles.grid}>
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} compact={compact} onPress={openSkillDetail} />
      ))}
    </View>
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

      <CategoryDropdown
        categories={CATEGORIES}
        selectedCategory={category}
        visible={categoryOpen}
        onOpen={() => setCategoryOpen(true)}
        onClose={() => setCategoryOpen(false)}
        onSelect={handleCategorySelect}
      />

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
        renderSkillGrid(filteredSkills)
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
        {similarSkills.length === 0 ? <Text style={styles.emptyText}>No similar listings yet.</Text> : renderSkillGrid(similarSkills, true)}
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
        {renderSkillGrid(providerSkills, true)}

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

      <InquiryModal
        visible={inquiryOpen}
        name={inquiryName}
        contact={inquiryContact}
        message={inquiryMessage}
        onChangeName={setInquiryName}
        onChangeContact={setInquiryContact}
        onChangeMessage={setInquiryMessage}
        onSubmit={handleSubmitInquiry}
        onClose={() => setInquiryOpen(false)}
      />
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
  }
});
