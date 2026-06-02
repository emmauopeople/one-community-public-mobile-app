import { mockSkills, getProviderById, getSkillsByProviderId } from '../data/mockSkills';
import { USE_MOCK_DATA } from '../utils/constants';
import { searchPublicSkills, getPublicSkillsByProvider } from '../api/skillApi';
import { getPublicProviderProfile } from '../api/providerApi';

const normalizeListResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.skills)) return response.skills;
  if (Array.isArray(response?.results)) return response.results;
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

export const getProviderFromDataSource = async (providerId) => {
  if (USE_MOCK_DATA) {
    return getProviderById(providerId);
  }

  return getPublicProviderProfile(providerId);
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

  const response = await searchPublicSkills({ category: skill.category, limit });
  return normalizeListResponse(response).filter((item) => item.id !== skill.id).slice(0, limit);
};
