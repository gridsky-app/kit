import {AtpAgent} from "@atproto/api";

export function getAtpServiceEndpoint(serviceName: 'public'): string {
  switch (serviceName) {
    case 'public':
      return 'https://public.api.bsky.app'
  }
}

export function createAgent(serviceEndpoint: 'public' | string) {
  return new AtpAgent({
    service: serviceEndpoint === 'public' ? getAtpServiceEndpoint(serviceEndpoint) : serviceEndpoint,
  })
}
