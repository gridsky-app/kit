import {BrowserOAuthClient} from "@atproto/oauth-client-browser";
import {useAccountAuthResolverStore} from '../stores/storeAccountAuthResolver'
import {useAccountAgentStore} from '../stores/storeAccountAgent'
import {useAccountSessionStore} from '../stores/storeAccountSession'
import {createAgent} from '../utils/utilAtproto'
import {useRuntimeConfig} from "nuxt/app"

let AtprotoOAuthClient: BrowserOAuthClient

/**
 * ATProtocol OAuth Client
 */
export function useAtprotoOAuth() {
  const accountAuthResolverStore = useAccountAuthResolverStore()
  const runtimeConfig = useRuntimeConfig()

  function setup() {
    AtprotoOAuthClient = new BrowserOAuthClient({
      handleResolver: accountAuthResolverStore.handleResolver,
      clientMetadata: runtimeConfig.public.atproto.oauth.clientMetadata,
    })

    return AtprotoOAuthClient
  }

  async function oauthLogin() {
    try {
      await AtprotoOAuthClient.signInRedirect(
        accountAuthResolverStore.handleResolver,
        {
          state: '',
          scope: 'atproto transition:generic',
          prompt: 'login',
          ui_locales: 'en-EN en en',
          signal: new AbortController().signal,
        }
      )
      debugLog('Never executed')
    } catch (err) {
      debugLog('The user aborted the authorization process by navigating "back"', err)
    }
  }

  async function restore(did: string) {
    return await AtprotoOAuthClient.restore(did)
  }

  async function signOut(did: string) {
    return await AtprotoOAuthClient.revoke(did)
  }

  return {
    setup,
    oauthLogin,
    restore,
    signOut,
  }
}

export function useAgent(serviceName: 'public' | 'auto' | 'private' | string) {
  const accountAgentStore = useAccountAgentStore()
  const accountSessionStore = useAccountSessionStore()

  if (serviceName == 'auto') {
    serviceName = !accountSessionStore.activeDid ? 'public' : 'private'
  }

  switch (serviceName) {
    case 'private':
      const accountAgent = accountAgentStore.getAgent(
        accountSessionStore.activeDid
      )

      if (accountAgent) {
        return accountAgent
      }

      accountSessionStore.resetActiveSession()
      break;
    case 'public':
      return createAgent('public')
    default:
      return createAgent(serviceName)
  }
}
