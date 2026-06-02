import { apiClient } from './apiClient';

export const sendSkillInquiry = async ({ skillId, contact, message }) => {
  const response = await apiClient.post('/contact/email', {
    skillId,
    fromEmail: contact,
    message
  });

  return response.data;
};
