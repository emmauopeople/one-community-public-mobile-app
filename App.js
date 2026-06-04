import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import SkillDetailScreen from './src/screens/SkillDetailScreen';
import ProviderProfileScreen from './src/screens/ProviderProfileScreen';
import InquiryModal from './src/components/InquiryModal';
import { sendSkillInquiry } from './src/api/inquiryApi';
import { openWhatsAppForSkill } from './src/services/whatsappService';
import {
  getProviderFromDataSource,
  getProviderSkillsFromDataSource,
  getSimilarSkillsFromDataSource,
  getSkillDetailFromDataSource,
  searchSkillsFromDataSource
} from './src/services/skillDataService';
import { validateInquiry } from './src/utils/validators';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [screen, setScreen] = useState('home');
  const [skills, setSkills] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [activeProvider, setActiveProvider] = useState(null);
  const [profileProvider, setProfileProvider] = useState(null);
  const [providerSkills, setProviderSkills] = useState([]);
  const [similarSkills, setSimilarSkills] = useState([]);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryContact, setInquiryContact] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  const runSearch = async ({ searchQuery = query, selectedCategory = category } = {}) => {
    try {
      setIsSearching(true);
      const results = await searchSkillsFromDataSource({ query: searchQuery, category: selectedCategory });
      setSkills(results);
    } catch (error) {
      Alert.alert('Unable to load services', 'Please check your connection and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    runSearch({ searchQuery: '', selectedCategory: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openSkillDetail = async (skill) => {
    try {
      const fullSkill = await getSkillDetailFromDataSource(skill);
      setSelectedSkill(fullSkill);
      const provider = await getProviderFromDataSource(fullSkill.providerId, fullSkill);
      const similar = await getSimilarSkillsFromDataSource(fullSkill);
      setActiveProvider(provider);
      setProfileProvider(provider);
      setSimilarSkills(similar);
      setScreen('detail');
    } catch (error) {
      Alert.alert('Unable to open service', 'Please try again.');
    }
  };

  const openProviderProfile = async (providerId) => {
    try {
      const provider = await getProviderFromDataSource(providerId, selectedSkill);
      const listings = await getProviderSkillsFromDataSource(providerId);
      setProfileProvider(provider);
      setProviderSkills(listings);
      setScreen('provider');
    } catch (error) {
      Alert.alert('Unable to open provider profile', 'Please try again.');
    }
  };

  const closeToHome = () => {
    setScreen('home');
    setSelectedSkill(null);
    setActiveProvider(null);
    setProfileProvider(null);
    setProviderSkills([]);
    setSimilarSkills([]);
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
    runSearch({ searchQuery: query, selectedCategory: item });
  };

  const handleSearchSubmit = () => {
    runSearch({ searchQuery: query, selectedCategory: category });
  };

  const handleWhatsAppPress = async () => {
    try {
      await openWhatsAppForSkill({ provider: activeProvider, skill: selectedSkill });
    } catch (error) {
      Alert.alert('WhatsApp unavailable', `Please contact ${activeProvider?.name || 'the provider'} directly.`);
    }
  };

  const handleOpenInquiry = () => {
    if (selectedSkill) {
      setInquiryMessage(`Hello, I am interested in ${selectedSkill.title}. Please contact me with more details.`);
    }
    setInquiryOpen(true);
  };

  const handleSubmitInquiry = async () => {
    const validationError = validateInquiry({
      name: inquiryName,
      contact: inquiryContact,
      message: inquiryMessage
    });

    if (validationError) {
      Alert.alert('Missing information', validationError);
      return;
    }

    if (!selectedSkill?.id) {
      Alert.alert('Missing service', 'Please select a service before sending an inquiry.');
      return;
    }

    try {
      setIsSubmittingInquiry(true);
      await sendSkillInquiry({
        skillId: selectedSkill.id,
        contact: inquiryContact.trim(),
        message: `${inquiryMessage.trim()}\n\nSender name: ${inquiryName.trim()}`
      });

      Alert.alert('Inquiry sent', 'Your inquiry was sent successfully. The provider can reply to your email.');
      setInquiryOpen(false);
      setInquiryName('');
      setInquiryContact('');
      setInquiryMessage('');
    } catch (error) {
      Alert.alert('Inquiry failed', error?.response?.data?.error || error?.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {screen === 'home' && (
        <HomeScreen
          query={query}
          category={category}
          categoryOpen={categoryOpen}
          skills={skills}
          isSearching={isSearching}
          onChangeQuery={setQuery}
          onSubmitSearch={handleSearchSubmit}
          onOpenCategory={() => setCategoryOpen(true)}
          onCloseCategory={() => setCategoryOpen(false)}
          onSelectCategory={handleCategorySelect}
          onOpenSkill={openSkillDetail}
        />
      )}

      {screen === 'detail' && (
        <SkillDetailScreen
          skill={selectedSkill}
          provider={activeProvider}
          similarSkills={similarSkills}
          onBack={handleBack}
          onClose={closeToHome}
          onOpenProvider={openProviderProfile}
          onWhatsApp={handleWhatsAppPress}
          onInquiry={handleOpenInquiry}
          onOpenSkill={openSkillDetail}
        />
      )}

      {screen === 'provider' && (
        <ProviderProfileScreen
          provider={profileProvider}
          skills={providerSkills}
          onBack={handleBack}
          onClose={closeToHome}
          onOpenSkill={openSkillDetail}
        />
      )}

      <InquiryModal
        visible={inquiryOpen}
        name={inquiryName}
        contact={inquiryContact}
        message={inquiryMessage}
        isSubmitting={isSubmittingInquiry}
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
  }
});
