import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SkillCard from '../components/SkillCard';

export default function ProviderProfileScreen({ provider, skills, onBack, onClose, onOpenSkill }) {
  if (!provider) return null;

  return (
    <ScrollView contentContainerStyle={styles.pageContainer}>
      <TopBar title="Provider Profile" onBack={onBack} onClose={onClose} />
      <View style={styles.profileHeader}>
        <Text style={styles.profileName}>{provider.name}</Text>
        <Text style={styles.detailMeta}>{provider.area}, {provider.city} - {provider.region}</Text>
        <Text style={styles.trustBadge}>{provider.statusLabel}</Text>
        <Text style={styles.detailText}>{provider.bio}</Text>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Provider listings</Text>
        <Text style={styles.resultCount}>{skills.length} skills</Text>
      </View>

      <View style={styles.grid}>
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} compact onPress={onOpenSkill} />
        ))}
      </View>

      <View style={styles.reviewsBox}>
        <Text style={styles.providerName}>Reviews coming soon</Text>
        <Text style={styles.cardText}>
          In the pilot, users can view provider profiles first. Public reviews will be added after validation.
        </Text>
      </View>
    </ScrollView>
  );
}

function TopBar({ title, onBack, onClose }) {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.topButton} onPress={onBack}>
        <Text style={styles.topButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.topTitle}>{title}</Text>
      <TouchableOpacity style={styles.topButton} onPress={onClose}>
        <Text style={styles.topButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    padding: 14,
    paddingBottom: 42
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
  reviewsBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 6
  },
  providerName: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 5
  },
  cardText: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20
  }
});
