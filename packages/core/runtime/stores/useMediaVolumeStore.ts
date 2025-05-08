import {defineStore} from "pinia";
import {ref} from "vue";

export const useMediaVolumeStore = defineStore("media/volume", () => {
  const muted = ref(false)

  function toggleMute() {
    muted.value = !muted.value
  }

  return {
    muted,
    toggleMute,
  }
}, {
  persist: {storage: window.localStorage}
})
