<script>
const { $pwa } = useNuxtApp()
</script>

<template>
  <div
    v-if="$pwa?.showInstallPrompt && !$pwa?.needRefresh"
    class="fixed right-0 bottom-[--app-footer-height] m-4 p-4 rounded-lg border-1 dark:border-gray-700 flex-col gap-3"
  >
    <h2 class="mb-3 text-left text-base">
      某星签到助手
    </h2>
    <div class="flex gap-2">
      <NButton strong secondary type="error" size="small" @click="$pwa.install()">
        <template #icon>
          <Icon name="material-symbols:install-desktop-rounded" class="-z-1" />
        </template>
        安装
      </NButton>
      <NButton size="small" @click="$pwa.cancelInstall()">
        取消
      </NButton>
    </div>
  </div>
</template>
