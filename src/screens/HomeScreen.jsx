import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CategoryDropdown from '../components/CategoryDropdown';
import SkillCard from '../components/SkillCard';
import { CATEGORIES } from '../utils/constants';

const LOGO_URI = 'https://raw.githubusercontent.com/emmauopeople/1community_app/main/frontend/src/assets/images/appLogo.png';

export default function HomeScreen({
  query,
  city,
  category,
  categoryOpen,
  skills,
  onChangeQuery,
  onChangeCity,
  onOpenCategory,
  onCloseCategory,
  onSelectCategory,
  onOpenSkill
}) {
  const [showInfo, setShowInfo] = useState(false);

  const dismissInfo = () => {
    if (showInfo) setShowInfo(false);
  };

  return (
    <Pressable style={styles.screen} onPress={dismissInfo}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.brandRow}>
            <Image source={{ uri: LOGO_URI }} style={styles.logo} resizeMode="contain" />
            <View style={styles.brandTextWrap}>
              <Text style={styles.brand}>One Community</Text>
              <Text style={styles.brandSubtext}>Blue-green local service network</Text>
            </View>

            <TouchableOpacity
              style={styles.infoButton}
              onPress={(event) => {
                event.stopPropagation();
                setShowInfo((current) => !current);
              }}
            >
              <Text style={styles.infoButtonText}>i</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heroTitle}>Trusted Services</Text>

          {showInfo && (
            <View style={styles.infoBubble}>
              <Text style={styles.infoBubbleText}>
                Search skilled workers near you, view their service details, and contact them by WhatsApp or email.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.searchPanel}>
          <Text style={styles.panelTitle}>Search services</Text>
          <TextInput
            value={query}
            onChangeText={onChangeQuery}
            placeholder="What service do you need?"
            style={styles.searchInput}
          />

          <TextInput
            value={city}
            onChangeText={onChangeCity}
            placeholder="City, for example Douala, Buea, Bamenda"
            autoCapitalize="words"
            style={styles.searchInput}
          />

          <CategoryDropdown
            categories={CATEGORIES}
            selectedCategory={category}
            visible={categoryOpen}
            onOpen={onOpenCategory}
            onClose={onCloseCategory}
            onSelect={onSelectCategory}
          />
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Available services</Text>
          <Text style={styles.resultCount}>{skills.length} found</Text>
        </View>

        {skills.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptyText}>Try a simple word like carpenter, tailor, electrical, Douala, Buea, or Bamenda.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} onPress={onOpenSkill} />
            ))}
          </View>
        )}
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    padding: 14,
    paddingBottom: 40
  },
  hero: {
    backgroundColor: '#eff6ff',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    position: 'relative'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#ffffff'
  },
  brandTextWrap: {
    flex: 1
  },
  brand: {
    color: '#1d4ed8',
    fontSize: 16,
    fontWeight: '900'
  },
  brandSubtext: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1
  },
  infoButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#93c5fd',
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoButtonText: {
    color: '#1d4ed8',
    fontSize: 15,
    fontWeight: '900'
  },
  heroTitle: {
    color: '#111827',
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '900'
  },
  infoBubble: {
    position: 'absolute',
    top: 48,
    right: 14,
    left: 52,
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 12,
    zIndex: 10
  },
  infoBubbleText: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600'
  },
  searchPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  panelTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 10
  },
  searchInput: {
    backgroundColor: '#f8fafc',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 10
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
