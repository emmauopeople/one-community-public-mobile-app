import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import SkillDetailScreen from './src/screens/SkillDetailScreen';
import ProviderProfileScreen from './src/screens/ProviderProfileScreen';
import InquiryModal from './src/components/InquiryModal';
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
  const [category, setCategory] = useState('All Categories');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [screen, setScreen] = useState('home');
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [activeProvider, setActiveProvider] = useState(null);
  const [profileProvider, setProfileProvider] = useState(null);
  const [providerSkills, setProviderSkills] = useState([]);
  const [similarSkills, setSimilarSkills] = useState([]);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryContact, setInquiryContact] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadSkills = async () => {
      try {
        const results = await searchSkillsFromDataSource({ query, category });
        if (mounted) setSkills(results);
      } catch (error) {
        if (mounted) {
          setSkills([]);
          Alert.alert('Unable to load services', 'Please check your connection and try again.');
        }
      }
    };

    loadSkills();

    return () => {
      mounted = false;
    };
  }, [query, category]);

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

  const handleSubmitInquiry = () => {
    const validationError = validateInquiry({
      name: inquiryName,
      contact: inquiryContact,
      message: inquiryMessage
    });

    if (validationError) {
      Alert.alert('Missing information', validationError);
      return;
    }

    Alert.alert('Inquiry ready', 'The inquiry was captured in this pilot version. The next version will send it to the backend.');
    setInquiryOpen(false);
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
          onChangeQuery={setQuery}
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
