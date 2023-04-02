<script lang="ts" setup>
const props = defineProps({
  showTitle: { type: Boolean, default: true },
})
const { title, logo } = useAppConfig()
</script>

<template>
  <NuxtLink to="/" class="flex items-center justify-center gpa-2">
    <Icon v-if="/\w+:\w+/.test(logo)" :name="logo" class="w-5 h-5 w-auto" />
    <img v-else :src="logo" alt="logo" class="w-5 h-5 w-auto">
    <h2 v-show="showTitle" class="ml-2 truncate md:opacity-100 font-sans leading-1em text-left text-base capitalize">
      {{ title }}
    </h2>
  </NuxtLink>
</template>
