export const validateInquiry = ({ name, contact, message }) => {
  if (!name || name.trim().length < 2) {
    return 'Please enter your name.';
  }

  if (!contact || contact.trim().length < 5) {
    return 'Please enter your phone number or email.';
  }

  if (!message || message.trim().length < 10) {
    return 'Please enter a short message with at least 10 characters.';
  }

  return null;
};
