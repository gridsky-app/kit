<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const allProfiles = ref<any[]>([]);
const visibleProfiles = ref<any[]>([]);

const intervalId = ref<NodeJS.Timeout | null>(null);
const transitionDuration = 500;
const switchInterval = 5000;

const initialVisibleCount = 9;

fetch('https://api.npoint.io/ba03367b05e0e7aad41d')
  .then(response => response.json())
  .then(data => {
    allProfiles.value = data;
    initializeVisibleProfiles();
  })

function getRandomUniqueProfiles(count: number): any[] {
  if (allProfiles.value.length <= count) {
    return [...allProfiles.value];
  }
  const shuffled = [...allProfiles.value].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function initializeVisibleProfiles() {
  visibleProfiles.value = getRandomUniqueProfiles(initialVisibleCount).map(profile => ({
    profile,
    key: Symbol(),
  }));
}

const seenProfiles = ref<Set<any>>(new Set());
const availableProfiles = computed(() => allProfiles.value.filter(p => !seenProfiles.value.has(p.id)));

function getNewRandomProfile(): any | undefined {
  if (availableProfiles.value.length === 0) {
    seenProfiles.value.clear();
    return getRandomUniqueProfiles(1)[0];
  }
  const randomIndex = Math.floor(Math.random() * availableProfiles.value.length);
  const newProfile = availableProfiles.value[randomIndex];
  seenProfiles.value.add(newProfile.id);
  return newProfile;
}

function getRandomGridIndex(): number {
  return Math.floor(Math.random() * visibleProfiles.value.length);
}

async function updateRandomProfile() {
  if (visibleProfiles.value.length === 0 || allProfiles.value.length === 0) {
    return;
  }

  const randomIndexToReplace = getRandomGridIndex();
  const newProfileData = getNewRandomProfile();

  if (newProfileData) {
    const newProfileWithKey = { profile: newProfileData, key: Symbol() };
    visibleProfiles.value[randomIndexToReplace] = { ...visibleProfiles.value[randomIndexToReplace], transitioningOut: true };
    await new Promise(resolve => setTimeout(resolve, transitionDuration));
    visibleProfiles.value.splice(randomIndexToReplace, 1, newProfileWithKey);
    await new Promise(resolve => setTimeout(resolve, 10));
    visibleProfiles.value[randomIndexToReplace] = { ...visibleProfiles.value[randomIndexToReplace], transitioningOut: false };
  }
}

onMounted(() => {
  intervalId.value = setInterval(updateRandomProfile, switchInterval);
});

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<template>
  <v-card
    class="fill-height"
    color="transparent"
    rounded="xl"
  >
    <v-row
      v-if="visibleProfiles.length > 0"
      no-gutters
    >
      <v-col
        v-for="item in visibleProfiles"
        :key="item.key"
      >
        <div
          :style="{
            transition: `opacity ${transitionDuration}ms ease-in-out`,
            opacity: item.transitioningOut ? 0 : 1,
            width: '100%',
            height: '100%',
          }"
        >
          <HomeSupporterProfile
            :profile="item.profile"
          />
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
