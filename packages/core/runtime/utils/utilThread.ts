export function getThreadPidFromUri(uri: string) {
  return uri.split('/')[uri.split('/').length - 1]
}
