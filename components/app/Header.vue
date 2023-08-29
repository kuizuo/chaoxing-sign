<script setup lang="ts">
import { useThemeVars } from 'naive-ui'

const show = ref(false)

const themeVars = useThemeVars()
</script>

<template>
  <header
    class="border-b h-[--app-header-height]"
    :style="{ borderColor: themeVars.borderColor }"
  >
    <div class="container mx-auto h-full px-4 py-2 flex gap-4 items-center">
      <AppLogo />

      <div class="flex-1" />

      <AppNav class="hidden md:inline-flex " />

      <div class="hidden md:inline-flex items-center gap-4">
        <div class="md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
        <AppThemeSwitcher />
        <UserButton />
      </div>

      <div class="inline-flex md:hidden items-center gap-4">
        <AppThemeSwitcher />
        <UserButton />
        <Icon name="ant-design:menu-outlined" @click="show = true" />
      </div>
      <NDrawer v-model:show="show" :width="240">
        <NDrawerContent closable>
          <template #header>
            <AppLogo :show-title="false" />
          </template>
          <AppNav class="flex-col w-full" />
        </NDrawerContent>
      </NDrawer>
    </div>
  </header>
</template>
