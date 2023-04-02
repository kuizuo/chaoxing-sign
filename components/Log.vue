<script setup lang="ts">
import type { LogInst } from 'naive-ui'

const logStore = useLogStore()
const logList = computed(() => logStore.logList)
const logInstRef = ref<LogInst | null>(null)

onMounted(() => {
  watchEffect(() => {
    if (logList) {
      nextTick(() => {
        logInstRef.value?.scrollTo({ position: 'bottom', slient: true })
      })
    }
  })
})
</script>

<template>
  <n-card class="my-4 text-left" title="🗒️ 日志" content-style="padding: 0 0.5rem;" header-style="padding: 0.5rem 0.5rem;">
    <template #header-extra>
      <n-switch v-model:value="logStore.showLog" />
    </template>
    <Transition>
      <n-log v-show="logStore.showLog" ref="logInstRef" class="text-left" :rows="10" :log="logList.join('\n')" trim />
    </Transition>
  </n-card>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
