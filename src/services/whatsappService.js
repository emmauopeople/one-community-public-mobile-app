import { Linking } from 'react-native';

export const buildWhatsAppMessage = (skill) => {
  return `Hello, I found your service on One Community. I am interested in ${skill.title}.`;
};

export const openWhatsAppForSkill = async ({ provider, skill }) => {
  if (!provider || !skill) {
    throw new Error('Provider and skill are required to open WhatsApp.');
  }

  const message = buildWhatsAppMessage(skill);
  const url = `https://wa.me/${provider.whatsapp}?text=${encodeURIComponent(message)}`;

  await Linking.openURL(url);
};
