import {defineStore} from "pinia";
import {ref} from "vue";

export const useAppPageStore = defineStore("app/page", () => {
  const pageLoaded = ref<boolean>(false)
  const pageLoadingMessage = ref<string>('')

  function setLoadingMessage(message: string) {
    pageLoadingMessage.value = message
  }

  return {
    pageLoaded,
    pageLoadingMessage,
    setLoadingMessage,
  }
})
