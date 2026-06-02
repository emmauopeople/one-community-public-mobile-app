import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import SkillDetailScreen from './src/screens/SkillDetailScreen';
import ProviderProfileScreen from './src/screens/ProviderProfileScreen';
import InquiryModal from './src/components/InquiryModal';
import { mockSkills, getProviderById, getSkillsByProviderId } from './src/data/mockSkills';
import { openWhatsAppForSkill } from './src/services/whatsappService';
import { validateInquiry } from './src/utils/validators';

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
    try {
      await openWhatsAppForSkill({ provider: activeProvider, skill: activeSkill });
    } catch (error) {
      Alert.alert('WhatsApp unavailable', `Please contact ${activeProvider?.name || 'the provider'} directly.`);
    }
  };

  const handleOpenInquiry = () => {
    if (activeSkill) {
      setInquiryMessage(`Hello, I am interested in ${activeSkill.title}. Please contact me with more details.`);
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
          skills={filteredSkills}
          onChangeQuery={setQuery}
          onOpenCategory={() => setCategoryOpen(true)}
          onCloseCategory={() => setCategoryOpen(false)}
          onSelectCategory={handleCategorySelect}
          onOpenSkill={openSkillDetail}
        />
      )}

      {screen === 'detail' && (
        <SkillDetailScreen
          skill={activeSkill}
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
