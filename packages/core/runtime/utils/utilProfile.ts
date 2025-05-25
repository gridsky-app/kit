import {useAgent} from "../composables/useAtproto";

export function makeHandleShort(handle: string) {
  return handle.replace('.bsky.social', '')
}

export function makeHandleLonger(handle: string) {
  if (handle.startsWith('did:')) {
    return handle
  }

  if (handle.split('.').length <= 1) {
    return `${handle}.bsky.social`
  }

  return handle
}

export async function getProfile(actor: string) {
  const profile = await useAgent('auto')
    .getProfile({
      actor
    })

  return profile.data
}

export async function resolveActorDid(handle: string): Promise<string> {
  const { did } = await useAgent('public')
    .com.atproto.identity
    .resolveHandle({
      handle: makeHandleLonger(handle)
    })
    .then(result => result.data)

  return did
}

export async function resolveActorServiceEndpoint(did: string): Promise<string> {
  const response = await fetch(`https://plc.directory/${did}`)

  if (!response.ok) {
    throw new Error('Failed to fetch profile service endpoint');
  }

  const data = await response.json()

  return data.service[0].serviceEndpoint
}
