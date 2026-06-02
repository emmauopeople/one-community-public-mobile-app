import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SkillCard({ skill, compact = false, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(skill)}>
      <Image source={{ uri: skill.imageUrl }} style={[styles.image, compact && styles.imageSmall]} />
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>{skill.title}</Text>
        <Text numberOfLines={1} style={styles.meta}>{skill.city} - {skill.category}</Text>
        <Text numberOfLines={1} style={styles.trust}>{skill.trustLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.5%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#dcfce7'
  },
  imageSmall: {
    height: 130
  },
  content: {
    padding: 10
  },
  title: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4
  },
  meta: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 5
  },
  trust: {
    color: '#15803d',
    fontSize: 11,
    fontWeight: '900'
  }
});
