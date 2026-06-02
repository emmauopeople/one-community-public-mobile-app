import { mockSkills, getProviderById, getSkillsByProviderId } from '../data/mockSkills';
import { USE_MOCK_DATA } from '../utils/constants';
import { searchPublicSkills, getPublicSkillsByProvider } from '../api/skillApi';
import { getPublicProviderProfile } from '../api/providerApi';

const normalizeProvider = (provider = {}) => ({
  id: provider.id || provider.provider_id,
  name: provider.display_name || provider.name || provider.provider_email || 'Provider',
  city: provider.city || '',
  region: provider.region || '',
  area: provider.area || '',
  statusLabel: provider.status === 'active' ? 'Approved Provider' : provider.statusLabel || 'Profile Reviewed',
  whatsapp: String(provider.phone || provider.provider_phone || provider.whatsapp || '').replace(/[^0-9]/g, ''),
  email: provider.email || provider.provider_email || '',
  bio: provider.bio || 'This provider has active service listings on One Community.'
});

const normalizeSkill = (skill = {}) => {
  const providerId = skill.providerId || skill.provider_id;
  const imageUrl = skill.imageUrl || skill.indexImageUrl || skill.index_image_url || skill.media?.[0]?.url || 'https://placehold.co/900x700/png?text=One+Community';

  return {
    id: String(skill.id),
    providerId,
    title: skill.title || 'Service listing',
    category: skill.category || 'Other',
    city: skill.city || '',
    region: skill.region || '',
    area: skill.area || '',
    trustLabel: skill.trustLabel || 'Approved Provider',
    shortDescription: skill.shortDescription || skill.description || 'Local service listing available through One Community.',
    description: skill.description || skill.shortDescription || 'Local service listing available through One Community.',
    imageUrl,
    images: skill.images || (skill.media || []).map((item) => item.url).filter(Boolean),
    providerName: skill.display_name || skill.providerName || '',
    providerPhone: skill.provider_phone || skill.providerPhone || '',
    providerEmail: skill.provider_email || skill.providerEmail || ''
  };
};

const normalizeListResponse = (response) => {
  if (Array.isArray(response)) return response.map(normalizeSkill);
  if (Array.isArray(response?.data)) return response.data.map(normalizeSkill);
  if (Array.isArray(response?.skills)) return response.skills.map(normalizeSkill);
  if (Array.isArray(response?.results)) return response.results.map(normalizeSkill);
  return [];
};

const searchMockSkills = ({ query = '', category = '' } = {}) => {
  const cleanQuery = query.trim().toLowerCase();

  return mockSkills.filter((skill) => {
    const provider = getProviderById(skill.providerId);
    const matchesCategory = category === 'All Categories' || !category || skill.category === category;
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
};

export const searchSkillsFromDataSource = async ({ query = '', category = '', city = '' } = {}) => {
  if (USE_MOCK_DATA) {
    return searchMockSkills({ query, category, city });
  }

  const response = await searchPublicSkills({ query, category, city });
  return normalizeListResponse(response);
};

export const getSkillDetailFromDataSource = async (skill) => {
  if (USE_MOCK_DATA) {
    return skill;
  }

  const response = await import('../api/skillApi').then((module) => module.getPublicSkillById(skill.id));
  return normalizeSkill({ ...response.skill, media: response.media });
};

export const getProviderFromDataSource = async (providerId, fallbackSkill) => {
  if (USE_MOCK_DATA) {
    return getProviderById(providerId);
  }

  try {
    const response = await getPublicProviderProfile(providerId);
    return normalizeProvider(response.provider || response.profile || response);
  } catch {
    return normalizeProvider({
      id: providerId,
      display_name: fallbackSkill?.providerName,
      phone: fallbackSkill?.providerPhone,
      email: fallbackSkill?.providerEmail,
      status: 'active',
      city: fallbackSkill?.city,
      region: fallbackSkill?.region,
      area: fallbackSkill?.area
    });
  }
};

export const getProviderSkillsFromDataSource = async (providerId) => {
  if (USE_MOCK_DATA) {
    return getSkillsByProviderId(providerId);
  }

  const response = await getPublicSkillsByProvider(providerId);
  return normalizeListResponse(response);
};

export const getSimilarSkillsFromDataSource = async (skill, limit = 4) => {
  if (!skill) return [];

  if (USE_MOCK_DATA) {
    return mockSkills
      .filter((item) => item.id !== skill.id && item.category === skill.category)
      .slice(0, limit);
  }

  const response = await searchPublicSkills({ category: skill.category });
  return normalizeListResponse(response).filter((item) => item.id !== skill.id).slice(0, limit);
};
