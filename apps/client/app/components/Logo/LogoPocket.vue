
<template>
  <AppLogo class="gsky-logo--pocket">
    <div class="gsky-logo--pocket__label text-overline">
      Pocket
    </div>
  </AppLogo>
</template>

<style scoped lang="scss">
.gsky-logo--pocket {
  position: absolute;
  top: 16%;
  left: -9%;

  :deep(svg) {
    transform: scale(0.7);
  }

  &__label {
    position: absolute;
    top: 116px;
    left: 387px;
    transform: translateX(-50%);
    height: 28px;
    line-height: 28px;
    font-size: 12px !important;
    opacity: 0.5;
  }
}
</style>
