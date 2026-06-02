export const formatLocation = (skill) => {
  const parts = [skill.area, skill.city, skill.region].filter(Boolean);
  return parts.join(', ');
};

export const truncateText = (text = '', maxLength = 120) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};
