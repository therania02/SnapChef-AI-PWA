export const extractTimeInSeconds = (text) => {
  const lowerText = text.toLowerCase();

  const minMatch = lowerText.match(/(\d+)\s*(menit|mnt)/i);
  const secMatch = lowerText.match(/(\d+)\s*(detik|dtk)/i);
  const hourMatch = lowerText.match(/(\d+)\s*(jam)/i);

  let totalSeconds = 0;
  if (hourMatch) totalSeconds += parseInt(hourMatch[1]) * 3600;
  if (minMatch) totalSeconds += parseInt(minMatch[1]) * 60;
  if (secMatch) totalSeconds += parseInt(secMatch[1]);

  if (totalSeconds > 0) return totalSeconds;

  // fallback pintar
  if (lowerText.includes('marinasi') || lowerText.includes('diamkan')) return 15 * 60;
  if (lowerText.includes('rebus') || lowerText.includes('ungkep') || lowerText.includes('panggang')) return 10 * 60;
  if (lowerText.includes('tumis') || lowerText.includes('goreng')) return 3 * 60;
  if (lowerText.includes('potong') || lowerText.includes('iris')) return 2 * 60;

  return 60;
};