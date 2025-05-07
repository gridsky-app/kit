<template>
  <div class="gsky-page-index">

    <div>

      <AppLogo/>

      <div class="gsky-logo__pocket text-overline">
        Pocket
      </div>

    </div>

    <div class="text-center">

      <v-card color="transparent" class="gsky-home-block mx-8" rounded="xl">
        <v-row no-gutters class="fill-height">
          <v-col :cols="6" class="gsky-home-block__logo">

            <v-sheet
              class="bg-black"
              height="100%"
            >
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
            </v-sheet>

          </v-col>
          <v-col :cols="6" class="gsky-home-block__supporters">

            <HomeSupporterGallery />

          </v-col>
        </v-row>
      </v-card>

    </div>

  </div>
</template>

<style scoped lang="scss">
.gsky-page-index {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  > div {
    &:nth-child(1) {
      position: relative;
      height: 50%;
    }

    &:nth-child(2) {
      height: 50%;
    }
  }
}

.gsky-logo {
  position: absolute;
  top: 16%;
  left: -9%;
  transform: scale(0.7);
  opacity: 0.15;

  &__pocket {
    position: absolute;
    top: 154px;
    left: 71.5%;
    transform: translateX(-50%);
    height: 28px;
    line-height: 28px;
    font-size: 12px !important;
    opacity: 0.4;
  }
}

.gsky-footer {
  opacity: 0.25;
}

.gsky-home-block {
  display: inline-block;
  margin: 0 auto;
  height: 180px;
  aspect-ratio: 2/1;

  &__logo {
    position: relative;

    .iconify {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &__supporters {
    position: relative;
  }

  swiper-container {
    width: 100%;

    swiper-slide {
      width: 100%;
      text-align: center;
    }
  }
}
</style>
