<script setup lang="ts">
import {useMediaVolumeStore} from "@gridsky/core/runtime/stores/useMediaVolumeStore"
import {ref, computed, onMounted, onUnmounted, watch} from "vue"

const props = defineProps<{
  thread: any
  aspectRatio?: number
  cover?: boolean
  playable?: boolean
  autoplay?: boolean
  pauseIfNotIntersected?: boolean
  showVolume?: boolean
  isReel?: boolean
  loop?: boolean
}>()

const emit = defineEmits(['ready'])

const mediaVolumeStore = useMediaVolumeStore()

const videoRef = ref<HTMLVideoElement>(null)

const videoDuration = ref(0)
const videoCurrentTime = ref(0)

const remainingTime = computed(() => Math.max(0, videoDuration.value - videoCurrentTime.value))

function onVideoClick() {
  if (props.thread.post.embed.video.state.isPlaying) {
    props.thread.post.embed.video.pauseVideo()
  } else {
    props.thread.post.embed.video.playVideo()
  }
}

onMounted(() => {
  props.thread.post.embed.video.setupVideoElement(videoRef.value)

  videoRef.value.addEventListener('loadedmetadata', () => {
    if (videoRef.value) {
      videoDuration.value = videoRef.value.duration
    }
  })

  videoRef.value.addEventListener('timeupdate', () => {
    if (videoRef.value) {
      videoCurrentTime.value = videoRef.value.currentTime
    }
  })

  emit('ready')
})

onUnmounted(() => {
  props.thread.post.embed.video.destroy()
})

watch(() => mediaVolumeStore.muted, value => {
  videoRef.value.muted = mediaVolumeStore.muted
})
</script>

<template>
  <div
      class="gsky-media__video"
  >
    <video
        ref="videoRef"
        :autoplay="autoplay" playsinline
        :poster="thread.post.embed.video.thumb"
        :muted="mediaVolumeStore.muted"
        :loop="isReel || loop || videoDuration <= 4"
        @click="onVideoClick"
    />

    <MediaVideoVolume v-if="showVolume"/>
    <MediaVideoCountdown :remaining="remainingTime"/>
  </div>
</template>

<style scoped lang="scss">
.gsky-media__video {
  position: relative;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    vertical-align: top;
    aspect-ratio: v-bind(aspectRatio);
    cursor: pointer;
  }

  :deep(.gsky-media__image) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__end-video-actions {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(var(--v-theme-background), 0.5);
    backdrop-filter: blur(24px);
    display: flex;
    align-items: center;
  }

  .v-btn .text-truncate {
    max-width: 200px;
  }
}
</style>
