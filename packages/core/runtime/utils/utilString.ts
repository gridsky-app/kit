export function getAvatarLetter(name: string) {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })
  const firstChar = [...segmenter.segment(name)][0]?.segment || ""
  return firstChar.toUpperCase()
}
