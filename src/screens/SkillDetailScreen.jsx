import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GradientButton from '../components/GradientButton';
import SkillCard from '../components/SkillCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_WIDTH = SCREEN_WIDTH - 28;

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
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const galleryRef = useRef(null);

  const images = useMemo(() => {
    const list = Array.isArray(skill?.images) ? skill.images.filter(Boolean) : [];
    if (skill?.imageUrl && !list.includes(skill.imageUrl)) list.unshift(skill.imageUrl);
    return list.length > 0 ? list : ['https://placehold.co/900x700/png?text=One+Community'];
  }, [skill]);

  if (!skill || !provider) return null;

  const goToImage = (index) => {
    const safeIndex = Math.max(0, Math.min(index, images.length - 1));
    setActiveImageIndex(safeIndex);
    galleryRef.current?.scrollTo({ x: safeIndex * IMAGE_WIDTH, animated: true });
  };

  const showPreviousImage = () => {
    goToImage(activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1);
  };

  const showNextImage = () => {
    goToImage(activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1);
  };

  const handleGalleryScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / IMAGE_WIDTH);
    setActiveImageIndex(index);
  };

  return (
    <ScrollView contentContainerStyle={styles.pageContainer}>
      <TopBar title="Service Details" onBack={onBack} onClose={onClose} />

      <View style={styles.imageWrap}>
        <ScrollView
          ref={galleryRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleGalleryScrollEnd}
          style={styles.galleryScroll}
        >
          {images.map((uri, index) => (
            <Image key={`${uri}-${index}`} source={{ uri }} style={styles.detailImage} />
          ))}
        </ScrollView>
        {images.length > 1 && (
          <>
            <TouchableOpacity style={[styles.imageNavButton, styles.imageNavLeft]} onPress={showPreviousImage}>
              <Text style={styles.imageNavText}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.imageNavButton, styles.imageNavRight]} onPress={showNextImage}>
              <Text style={styles.imageNavText}>›</Text>
            </TouchableOpacity>
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>{activeImageIndex + 1} / {images.length}</Text>
            </View>
          </>
        )}
      </View>

      {images.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailRow}>
          {images.map((uri, index) => (
            <TouchableOpacity key={`${uri}-thumb-${index}`} onPress={() => goToImage(index)}>
              <Image source={{ uri }} style={[styles.thumbnailImage, activeImageIndex === index && styles.thumbnailImageActive]} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>{skill.title}</Text>
        <Text style={styles.detailMeta}>{skill.area}, {skill.city} - {skill.region}</Text>
        <Text style={styles.trustBadge}>{skill.trustLabel}</Text>
        <Text style={styles.detailText}>{skill.description}</Text>

        <TouchableOpacity style={styles.providerBox} onPress={() => onOpenProvider(provider.id)}>
          <Text style={styles.providerLabel}>Provider Profile</Text>
          <Text style={styles.providerName}>{provider.name}</Text>
          {!!provider.bio && <Text style={styles.cardText}>{provider.bio}</Text>}
          <Text style={styles.viewProfileText}>View all provider listings</Text>
        </TouchableOpacity>

        <GradientButton title="Contact by WhatsApp" onPress={onWhatsApp} />
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
    color: '#1d4ed8',
    fontWeight: '900'
  },
  topTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900'
  },
  imageWrap: {
    position: 'relative',
    marginBottom: 10,
    borderRadius: 24,
    overflow: 'hidden'
  },
  galleryScroll: {
    width: IMAGE_WIDTH,
    height: 260,
    borderRadius: 24,
    backgroundColor: '#dbeafe'
  },
  detailImage: {
    width: IMAGE_WIDTH,
    height: 260,
    backgroundColor: '#dbeafe'
  },
  imageNavButton: {
    position: 'absolute',
    top: '42%',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(17, 24, 39, 0.65)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageNavLeft: {
    left: 10
  },
  imageNavRight: {
    right: 10
  },
  imageNavText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 32
  },
  imageCounter: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.7)',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  imageCounterText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 12
  },
  thumbnailRow: {
    marginBottom: 12
  },
  thumbnailImage: {
    width: 62,
    height: 48,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb'
  },
  thumbnailImageActive: {
    borderColor: '#2563eb'
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
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
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
    color: '#2563eb',
    fontWeight: '900',
    marginTop: 10
  },
  cardText: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20
  },
  secondaryButton: {
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#047857',
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
