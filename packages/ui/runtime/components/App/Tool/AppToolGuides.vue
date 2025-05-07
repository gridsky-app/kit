<script setup lang="ts">
import Guides from "vue3-guides"
import {useTemplateRef, onMounted} from "vue"
import {useDebounceFn} from "@vueuse/core"

const props = defineProps<{
  enabled: boolean
}>()

const guideX = useTemplateRef("guideX")
const guideY = useTemplateRef("guideY")

const onResize = useDebounceFn(() => {
  if (!props.enabled) {
    return
  }

  if (guideX.value) guideX.value.resize()
  if (guideY.value) guideY.value.resize()
}, 500)

onMounted(() => {
  document.body.classList[props.enabled ? "add" : "remove"](
    "gsky--tool-guides",
  )

  window.addEventListener("resize", onResize, { passive: true })
})
</script>

<template>
  <div
      v-if="enabled"
      class="gsky-tool-guides"
  >
    <Guides ref="guideX" type="horizontal" oncontextmenu="return false"/>
    <Guides ref="guideY" type="vertical" oncontextmenu="return false"/>
  </div>
</template>

<style lang="scss">
body.gsky--tool-guides {
  .v-application__wrap {
    padding-top: 36px;
    padding-left: 36px;
  }

  .gsky-navigation-drawer {
    top: 36px !important;
    left: 36px !important;
    height: calc(100dvh - 36px) !important;
  }
}

.gsky-tool-guides {
  &:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 36px;
    height: 36px;
    background: #333;
    content: "";
    z-index: 9999;
  }

  .scena-guides-guide {
    background-color: #333 !important;
  }

  .scena-guides-manager {
    canvas {
      vertical-align: top;
    }

    &.scena-guides-horizontal {
      position: fixed;
      top: 0;
      left: 36px;
      height: 36px;
      width: 100vw;
      z-index: 9999;
    }

    &.scena-guides-vertical {
      position: absolute;
      top: 36px;
      left: 0;
      width: 36px;
      height: 100%;
      z-index: 9999;
    }
  }
}
</style>
