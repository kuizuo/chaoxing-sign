<script setup lang="ts">
import pkg from '~/package.json'

const { author } = useAppConfig()
</script>

<template>
  <footer class="transition-colors border-y border-gray-100 dark:border-#242427">
    <div class="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-6xl">
      <div class="flex flex-col items-center h-full gap-2 py-4 sm:flex-row sm:justify-between sm:gap-x-4">
        <div class="inline-flex gap-4">
          <NuxtLink :to="pkg.author.url" target="_blank" class="flex items-center gap-1">
            <i i-ri:user-star-line />
            <p class="text-xs font-semibold self-end">
              作者: {{ pkg.author.name }}
            </p>
          </NuxtLink>
          <NuxtLink target="_blank" class="flex items-center gap-1">
            <i i-ri:file-code-line />
            <p class="text-xs font-semibold self-end">
              版本: {{ pkg.version }}
            </p>
          </NuxtLink>
        </div>
        <div class="inline-flex">
          <div class="flex items-center gap-1">
            <i i-ri:building-2-line />
            <NuxtLink to="https://github.com/kuizuo/protocol" target="_blank" class="text-xs font-semibold self-end">
              构建于: Protocol
            </NuxtLink>
            <NuxtLink to="https://nuxt.com/" class="block bg-green-500 rounded px-1 py-0.5 text-white text-xs" target="_blank">
              nuxt@{{ pkg.devDependencies.nuxt }}
            </NuxtLink>
          </div>
        </div>
        <div flex-auto />
        <div class="flex items-center gap-3">
          <NuxtLink v-if="author.qq" i-ri-qq-line :to="author.qq" target="_blank" />
          <NuxtLink v-if="author.wx" i-ri-wechat-2-line :to="author.wx" target="_blank" />
          <NuxtLink i-ri-github-line :to="pkg.repository.url" target="_blank" />
        </div>
      </div>
    </div>
  </footer>
</template>
