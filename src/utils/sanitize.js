export const sanitizeForAI = (text) => {
  if (typeof text !== 'string') return '';
  return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
};

