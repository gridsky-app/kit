<script setup lang="ts">

</script>

<template>
  <div class="gsky-background-grid" />
</template>

<style scoped lang="scss">
.gsky-background-grid {
  width: 100%;
  height: 105%;
  background:
    repeating-linear-gradient(150deg, #ccc, #bbb 0.5px, transparent 1px, transparent 30px),
    repeating-linear-gradient(30deg, #ccc, #bbb 0.5px, transparent 1px, transparent 30px);
  background-size: 60px 34px;
  margin-top: 2px;
  opacity: 0.1;
}
</style>
