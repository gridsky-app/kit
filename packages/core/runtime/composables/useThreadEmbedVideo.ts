import Hls from 'hls.js'

export function useThreadEmbedVideo(embed: any) {
  const alt = embed.alt ?? ''
  const thumb = embed.thumbnail ? embed.thumbnail : ''
  const playlist = typeof embed.playlist === "string" ? embed.playlist : ''

  const videoElement = ref<HTMLVideoElement | null>(null)

  const hlsInstance = ref<Hls | null>(null)

  const state = reactive({
    isPlaying: false,
    isEnded: false,
    isPrepared: false,
    isBuffering: false,
    isPlayerReady: false
  })

  function setupVideoElement(el: HTMLVideoElement) {
    videoElement.value = el
  }

  function startBuffering() {
    if (state.isPrepared || !videoElement.value) {
      return
    }

    if (Hls.isSupported()) {
      if (!playlist) {
        console.error("Embed video loader error, invalid playlist", playlist)
        return
      }

      hlsInstance.value = new Hls()
      hlsInstance.value.loadSource(playlist)
      hlsInstance.value.attachMedia(videoElement.value)

      state.isPlayerReady = true

      hlsInstance.value.on(Hls.Events.MANIFEST_PARSED, () => {
        state.isPrepared = true
        if (state.isPlaying) {
          playVideo()
        }
      })
    } else if (videoElement.value.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.value.src = playlist
      state.isPlayerReady = true
      state.isPrepared = true
    }

    videoElement.value.addEventListener("ended", () => {
      state.isEnded = true
    })
  }

  function playVideo() {
    state.isPlaying = true
    state.isEnded = false

    if (videoElement.value) {
      videoElement.value.play()
    }
  }

  function pauseVideo() {
    state.isPlaying = false
    state.isEnded = false

    if (videoElement.value) {
      videoElement.value?.pause()
    }
  }

  function destroy() {
    if (hlsInstance.value) {
      hlsInstance.value.destroy()
      hlsInstance.value = null
    }
    state.isPrepared = false
  }

  return {
    alt,
    thumb,
    state,
    setupVideoElement,
    startBuffering,
    playVideo,
    pauseVideo,
    destroy,
  }
}
