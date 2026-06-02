import { apiClient } from './apiClient';

export const sendSkillInquiry = async ({ skillId, providerId, name, contact, message }) => {
  const response = await apiClient.post('/contact/skill-inquiry', {
    skillId,
    providerId,
    name,
    contact,
    message
  });

  return response.data;
};
