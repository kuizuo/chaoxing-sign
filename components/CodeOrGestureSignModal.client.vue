<script setup lang="ts">
import { signTypeMap } from '~/constants/cx'

const props = defineProps<{
  activity: CX.ActivityItem
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'success', text: string): void
}>()

console.log('activity', props.activity)

const text = ref('')

const signPlaceholder = computed(() => {
  return {
    3: '请输入手势轨迹',
    5: '请输入签到码',
  }[props.activity?.otherId]
})

async function handleCodeSign(text: string) {
  emit('success', text)
}

const show = ref(false)

function handleOpen() {
  show.value = true
}

function handleClose() {
  show.value = false
}
</script>

<template>
  <n-modal
    :mask-closable="false"
    preset="card"
    size="large"
    :title="`${activity?.course?.name} | ${signTypeMap?.[activity?.otherId]}`"
    :bordered="false"
    :closable="true"
    :style="{ 'max-width': '360px' }"
    transform-origin="center"
    @after-enter="handleOpen"
    @after-leave="handleClose"
  >
    <n-input-group>
      <n-input v-model:value="text" :placeholder="signPlaceholder" clearable />
      <n-button type="primary" :loading="loading" @click="handleCodeSign(text)">
        签到
      </n-button>
    </n-input-group>
  </n-modal>
</template>

<style lang='scss' scoped>
.stream {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}
.scan-confirmation {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, .8);

  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
</style>
