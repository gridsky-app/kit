<script setup lang="ts">
const appPreferencesStore = useAppPreferencesStore()
</script>

<template>
  <div class="gsky-page-index">

    <div>
      <LogoPocket/>
    </div>

    <div class="text-center">
      <HomeHero/>
    </div>

  </div>

  <teleport to="body">
    <HomePageBackground
      :enabled="appPreferencesStore.homePageBackground"
    />
  </teleport>
</template>

<style scoped lang="scss">
.gsky-page-index {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: var(--gsky-background-image);
    background-size: cover;
    background-position: center;
    opacity: 0.4;
    content: '';
  }

  &:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(64px);
    mask-image: linear-gradient(to top, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 1) 100%);
    content: '';
    z-index: 1;
  }

  > div {
    position: relative;
    z-index: 2;

    &:nth-child(1) {
      height: 50%;
    }

    &:nth-child(2) {
      height: 50%;
    }
  }
}
</style>
