import {createAgent} from "../utils/utilAgent";

export function useAgent(serviceName: 'public' | 'auto'| 'private' | string) {
  switch (serviceName) {
    case 'public':
      return createAgent('public')
    default:
      return createAgent(serviceName)
  }
}
