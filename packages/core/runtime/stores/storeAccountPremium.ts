import { useAccountStore } from "@gridsky/core/runtime/stores/storeAccount"

export const useAccountPremiumStore = defineStore("account/premium", () => {
  const accountStore = useAccountStore()

  const premium = ref<null|GridskyProfilePremium>(null)

  async function checkIsAccountPremium() {
    premium.value = await isDidPremium(accountStore.account.did)

    return premium.value
  }

  return {
    premium,
    checkIsAccountPremium,
  }
})
