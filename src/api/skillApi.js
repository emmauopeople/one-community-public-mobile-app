import { apiClient } from './apiClient';

export const searchPublicSkills = async ({ query = '', category = '', city = '', area = '', lat, lng, radiusKm } = {}) => {
  const response = await apiClient.get('/skills/search', {
    params: {
      q: query || undefined,
      category: category && category !== 'All Categories' ? category : undefined,
      city: city || undefined,
      area: area || undefined,
      lat,
      lng,
      radius_km: radiusKm
    }
  });

  return response.data;
};

export const getPublicSkillById = async (skillId) => {
  const response = await apiClient.get(`/skills/${skillId}`);
  return response.data;
};

export const getPublicSkillsByProvider = async (providerId) => {
  const response = await searchPublicSkills({});
  const results = Array.isArray(response?.results) ? response.results : [];
  return {
    results: results.filter((skill) => String(skill.provider_id) === String(providerId))
  };
};
