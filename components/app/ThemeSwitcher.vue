<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.preference === 'dark')

function toggleDark() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <i class="!outline-none cursor-pointer" @click="toggleDark">
    <Icon :name="isDark ? 'ri:moon-line' : 'ri:sun-line'" />
  </i>
</template>
