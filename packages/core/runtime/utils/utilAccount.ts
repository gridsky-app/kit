import {useAccountStore} from "../stores/storeAccount";

export function isLogged() {
  const accountStore = useAccountStore()

  return accountStore.isLogged
}
