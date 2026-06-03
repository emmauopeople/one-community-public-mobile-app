import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import CategoryDropdown from '../components/CategoryDropdown';
import SkillCard from '../components/SkillCard';
import { CATEGORIES, DEFAULT_CITY } from '../utils/constants';

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
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <View style={styles.brandRow}>
          <Image source={{ uri: LOGO_URI }} style={styles.logo} resizeMode="contain" />
          <View>
            <Text style={styles.brand}>One Community</Text>
            <Text style={styles.brandSubtext}>Local services in Cameroon</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Find trusted local services.</Text>
        <Text style={styles.heroText}>Search skilled workers near you and contact them by WhatsApp or email.</Text>

        <View style={styles.locationBadge}>
          <Text style={styles.locationText}>Pilot city: {DEFAULT_CITY}</Text>
        </View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    paddingBottom: 40
  },
  hero: {
    backgroundColor: '#dcfce7',
    borderRadius: 26,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#bbf7d0'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: '#ffffff'
  },
  brand: {
    color: '#166534',
    fontSize: 17,
    fontWeight: '900'
  },
  brandSubtext: {
    color: '#4b5563',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2
  },
  heroTitle: {
    color: '#111827',
    fontSize: 29,
    lineHeight: 35,
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
