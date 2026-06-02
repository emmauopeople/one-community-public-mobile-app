import { apiClient } from './apiClient';

export const getPublicProviderProfile = async (providerId) => {
  const response = await apiClient.get(`/providers/${providerId}/public`);
  return response.data;
};

export const getPublicProviderReviews = async (providerId) => {
  const response = await apiClient.get(`/providers/${providerId}/reviews`);
  return response.data;
};
