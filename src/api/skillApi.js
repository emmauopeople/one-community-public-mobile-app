import { apiClient } from './apiClient';

export const searchPublicSkills = async ({ query = '', category = '', city = '', lat, lng, page = 1, limit = 20 } = {}) => {
  const response = await apiClient.get('/skills', {
    params: {
      q: query || undefined,
      category: category && category !== 'All Categories' ? category : undefined,
      city: city || undefined,
      lat,
      lng,
      page,
      limit
    }
  });

  return response.data;
};

export const getPublicSkillById = async (skillId) => {
  const response = await apiClient.get(`/skills/${skillId}`);
  return response.data;
};

export const getPublicSkillsByProvider = async (providerId) => {
  const response = await apiClient.get(`/skills/provider/${providerId}`);
  return response.data;
};
