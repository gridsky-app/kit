import {defineStore} from "pinia"
import {computed} from "vue";

export const useAccountStore = defineStore("account", () => {
  const isLogged = computed(() => {
    return false
  })

  return {
    isLogged
  }
})
