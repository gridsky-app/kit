<script setup lang="ts">
const appPreferencesStore = useAppPreferencesStore()
</script>

<template>
  <div class="gsky-page-index">

    <div>
      <LogoPocket/>
    </div>

    <div class="text-center">

      <v-row no-gutters class="mx-15">
        <v-col :cols="6" class="gsky-home-block__logo">

          <swiper-container
            slides-per-view="1"
            loop="1"
            autoplay-delay="5000"
            class="fill-height"
          >
            <swiper-slide>
              <Icon name="lucide:grid-3x3" :size="94"/>
            </swiper-slide>
            <swiper-slide>
              <Icon name="lucide:sparkles" :size="88"/>
            </swiper-slide>
            <swiper-slide>
              <Icon name="simple-icons:bluesky" :size="88"/>
            </swiper-slide>
            <swiper-slide>
              <Icon name="lucide:at-sign" :size="88"/>
            </swiper-slide>
          </swiper-container>

        </v-col>
        <v-col :cols="6" class="gsky-home-block__supporters">

          <HomeSupporterGallery/>

        </v-col>
      </v-row>

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
    opacity: 0.25;
    content: '';
  }

  &:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
