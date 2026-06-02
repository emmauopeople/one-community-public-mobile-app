import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SkillCard from '../components/SkillCard';

export default function SkillDetailScreen({
  skill,
  provider,
  similarSkills,
  onBack,
  onClose,
  onOpenProvider,
  onWhatsApp,
  onInquiry,
  onOpenSkill
}) {
  if (!skill || !provider) return null;

  return (
    <ScrollView contentContainerStyle={styles.pageContainer}>
      <TopBar title="Service Details" onBack={onBack} onClose={onClose} />
      <Image source={{ uri: skill.imageUrl }} style={styles.detailImage} />
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>{skill.title}</Text>
        <Text style={styles.detailMeta}>{skill.area}, {skill.city} - {skill.region}</Text>
        <Text style={styles.trustBadge}>{skill.trustLabel}</Text>
        <Text style={styles.detailText}>{skill.description}</Text>

        <TouchableOpacity style={styles.providerBox} onPress={() => onOpenProvider(provider.id)}>
          <Text style={styles.providerLabel}>Provider Profile</Text>
          <Text style={styles.providerName}>{provider.name}</Text>
          <Text style={styles.cardText}>{provider.bio}</Text>
          <Text style={styles.viewProfileText}>View all provider listings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={onWhatsApp}>
          <Text style={styles.primaryButtonText}>Contact by WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={onInquiry}>
          <Text style={styles.secondaryButtonText}>Send email inquiry</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Similar listings</Text>
      {similarSkills.length === 0 ? (
        <Text style={styles.emptyText}>No similar listings yet.</Text>
      ) : (
        <View style={styles.grid}>
          {similarSkills.map((item) => (
            <SkillCard key={item.id} skill={item} compact onPress={onOpenSkill} />
          ))}
        </View>
      )}
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
  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 10
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  emptyText: {
    color: '#6b7280'
  }
});
