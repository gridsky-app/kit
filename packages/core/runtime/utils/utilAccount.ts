import { useAccountStore } from "@gridsky/core/runtime/stores/storeAccount"
import { useAccountSessionStore } from "@gridsky/core/runtime/stores/storeAccountSession"
import { useProfileStore } from "@gridsky/core/runtime/stores/storeProfile"
import { useThreadDraftListStore } from "@gridsky/core/runtime/stores/storeThreadDraftList"
import {getProfileAppearance} from "@/utils/utilProfileAppearance";
import {computed} from 'vue'

export function isLogged() {
  const accountStore = useAccountStore()

  return accountStore.isLogged
}

export function isLoggedAccount(profile: BskyProfile) {
  const accountStore = useAccountStore()

  return computed(() => {
    return isLogged() && accountStore.isAuthor(profile)
  })
}

export function hasMoreSessions() {
  const accountSessionStore = useAccountSessionStore()

  return Object.keys(accountSessionStore.sessions).length > 0
}

export async function refreshAccountProfile() {
  const accountStore = useAccountStore()
  const profileStore = useProfileStore(accountStore.account.handle)

  const profileUpdated = await getProfile(accountStore.account.did)

  profileStore.setData({
    profile: profileUpdated
  })
}

export async function getAccountAdditionalCallback(account) {
  debugLog('Run additional fetchaccount callback')

  const threadDraftListStore = useThreadDraftListStore()

  await threadDraftListStore.fetchDraftList()
}
