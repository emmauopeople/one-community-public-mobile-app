import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import CategoryDropdown from '../components/CategoryDropdown';
import SkillCard from '../components/SkillCard';
import { CATEGORIES, DEFAULT_CITY } from '../utils/constants';

export default function HomeScreen({
  query,
  category,
  categoryOpen,
  skills,
  onChangeQuery,
  onOpenCategory,
  onCloseCategory,
  onSelectCategory,
  onOpenSkill
}) {
  return (
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
        onChangeText={onChangeQuery}
        placeholder="Search service, city, provider, or category"
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

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Available services</Text>
        <Text style={styles.resultCount}>{skills.length} found</Text>
      </View>

      {skills.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No services found</Text>
          <Text style={styles.emptyText}>Try a simple word like carpenter, tailor, electrical, Douala, or Yaounde.</Text>
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
