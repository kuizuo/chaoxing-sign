<script lang="ts" setup>
const props = defineProps({
  showTitle: { type: Boolean, default: false },
})
const { title } = useAppConfig()
</script>

<template>
  <NuxtLink to="/" class="flex items-center justify-center gpa-2">
    <Icon name="majesticons:shooting-star-line" class="w-5 h-5 w-auto" color="#e70012" />
    <h2 v-show="showTitle" class="ml-2 truncate md:opacity-100 font-sans leading-1em text-left text-base capitalize">
      {{ title }}
    </h2>
  </NuxtLink>
</template>
