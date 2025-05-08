export function getMediaTypeIcon(type: string) {
  let icon = ''

  switch(type) {
    case "album":
      icon = 'lucide:images'
      break
    case "video":
      icon = 'lucide:play'
      break
  }

  return icon
}
