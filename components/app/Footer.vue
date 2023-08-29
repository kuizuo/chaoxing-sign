<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import pkg from '~/package.json'

const themeVars = useThemeVars()
</script>

<template>
  <footer class="border-t h-[--app-footer-height]" :style="{ borderColor: themeVars.borderColor }">
    <div class="container mx-auto h-full px-4 py-2">
      <div class="flex flex-col items-center h-full gap-2 py-4 sm:flex-row sm:justify-between sm:gap-x-4">
        <div class="inline-flex gap-4">
          <NuxtLink :to="pkg.author.url" target="_blank" class="flex items-center gap-1">
            <i class="i-ri-user-star-line" />
            <p class="text-xs font-semibold">
              作者: {{ pkg.author.name }}
            </p>
          </NuxtLink>
          <NuxtLink target="_blank" class="flex items-center gap-1">
            <i class="i-ri-file-code-line" />
            <p class="text-xs font-semibold">
              版本: {{ pkg.version }}
            </p>
          </NuxtLink>
        </div>
        <div class="inline-flex">
          <div class="flex items-center gap-1">
            <i class="i-ri-building-2-line " />
            <NuxtLink :to="pkg.repository.url" target="_blank" class="text-xs font-semibold">
              构建于:
            </NuxtLink>
            <NuxtLink to="https://nuxt.com/" class="block bg-emerald-400 rounded px-1 py-0.5 text-white text-xs" target="_blank">
              nuxt@{{ pkg.devDependencies.nuxt }}
            </NuxtLink>
          </div>
        </div>
        <div class="flex-auto" />
        <div class="flex items-center gap-3">
          <NuxtLink class="i-ri-github-line icon-btn" :to="pkg.repository.url" target="_blank" />
        </div>
      </div>
    </div>
  </footer>
</template>
