<script setup lang="ts">
import type { LogInst } from 'naive-ui'

const logStore = useLogStore()
const logList = computed(() => logStore.logList)
const logInstRef = ref<LogInst | null>(null)

onMounted(() => {
  watchEffect(() => {
    if (logList.value.length) {
      nextTick(() => {
        logInstRef.value?.scrollTo({ position: 'bottom', slient: true })
      })
    }
  })
})
</script>

<template>
  <n-card class="my-4 text-left" content-style="padding: 0 0.5rem;" header-style="padding: 0.5rem 0.5rem;">
    <template #header>
      <div class="inline-flex justify-center items-center gap-1">
        <Icon name="material-symbols:docs-outline" />
        日志
      </div>
    </template>
    <template #header-extra>
      <div class="inline-flex justify-center items-center gap-2">
        <n-popconfirm @positive-click="logStore.cleanLog()">
          <template #trigger>
            <Icon name="material-symbols:cleaning-services" class="cursor-pointer transition hover:text-primary" />
          </template>
          确认清除所有日志?
        </n-popconfirm>

        <Icon :name="logStore.showLog ? 'tabler:layout-bottombar-collapse' : 'tabler:layout-navbar-collapse'" class="cursor-pointer transition hover:text-primary" @click="logStore.showLog = !logStore.showLog" />
      </div>
    </template>
    <n-collapse-transition :show="logStore.showLog">
      <n-log ref="logInstRef" class="text-left" :rows="10" :log="logList.join('\n')" trim />
    </n-collapse-transition>
  </n-card>
</template>
