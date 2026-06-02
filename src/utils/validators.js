const isEmail = (value = '') => {
  const clean = value.trim();
  return clean.includes('@') && clean.includes('.') && clean.length >= 6;
};

export const validateInquiry = ({ name, contact, message }) => {
  if (!name || name.trim().length < 2) {
    return 'Please enter your name.';
  }

  if (!isEmail(contact)) {
    return 'Please enter a valid email address. The provider will reply to this email.';
  }

  if (!message || message.trim().length < 10) {
    return 'Please enter a short message with at least 10 characters.';
  }

  return null;
};
