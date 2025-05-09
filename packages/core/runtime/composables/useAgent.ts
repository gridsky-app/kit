import {createAgent} from "../utils/utilAgent";

export function useAgent(serviceName: 'public' | 'auto' | 'private' | string) {
  switch (serviceName) {
    case 'auto':
    case 'public':
      return createAgent('public')
    default:
      return createAgent(serviceName)
  }
}
