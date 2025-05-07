<template>
  <div>
    <div>
      <b>Client test</b>
      <div>
        Ready
      </div>
    </div>

    <div class="mt-4">
      <b>Vuetify test</b>
      <div>
        <v-btn>
          Ready
        </v-btn>
      </div>
    </div>

    <div class="mt-4">
      <b>UI component import test</b>
      <Test />
    </div>

    <BaseAvatar
      :avatar="{image: 'https://cdn.bsky.app/img/avatar/plain/did:plc:iaf5ejdchj6nydfxmcrq5rm6/bafkreicmdm2vftqug6n36azkzpvo3hyt6rnv4c5xd2ykmmnlptdg6iymka@jpeg'}"
    />
    <BaseAvatar
      :avatar="{icon: {name: 'mdi:home', size: 24}}"
    />
  </div>
</template>
