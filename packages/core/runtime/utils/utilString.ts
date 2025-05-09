export function getAvatarLetter(name: string) {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })
  const firstChar = [...segmenter.segment(name)][0]?.segment || ""
  return firstChar.toUpperCase()
}

export function generateId(size: number) {
  const bytes = new Uint8Array(size);
  window.crypto.getRandomValues(bytes);
  let result = '';
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < size; i++) {
    result += alphabet[bytes[i] % alphabet.length];
  }
  return result;
}
