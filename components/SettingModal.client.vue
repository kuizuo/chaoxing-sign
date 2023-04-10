<script setup lang="ts">
import _ from 'lodash'

interface Props {
  show: boolean
  uid: string
  setting: API.Setting
}

interface Emit {
  (e: 'update:show', show: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const saving = ref(false)
const accountStore = useAccountStore()

const show = computed({
  get() {
    return props.show
  },
  set(show: boolean) {
    emit('update:show', show)
  },
})

const form = ref<API.Setting>(props.setting)

async function handleSave() {
  saving.value = true
  await accountStore.updateSetting(props.uid, unref(form)).finally(() => {
    saving.value = false
  })
}

function handleReset() {
  form.value = defaultSetting
}

watch(show, (value) => {
  if (value)
    form.value = props.setting
})
</script>

<template>
  <n-modal
    v-model:show="show"
    :mask-closable="false"
    title="设置"
    preset="card"
    :auto-focus="false"
    :closable="false"
    style="max-width: 300px"
  >
    <template #header-extra>
      <Icon name="ant-design:close-circle-outlined" class="cursor-pointer transition hover:text-red" @click="show = false" />
    </template>
    <n-spin :show="saving">
      <n-form
        ref="formRef"
        :model="form"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        :show-feedback="false"
        size="small"
        :style="{
          maxWidth: '300px',
        }"
      >
        <n-form-item label="签到延迟" path="delay">
          <n-input-number
            v-model:value="form.delay"
            placeholder=""
            :min="0"
            :step="100"
            :max="10000"
          />
        </n-form-item>
        <n-divider />
        <n-form-item label="签到位置" path="location">
          <n-space>
            <n-input
              v-model:value="form.location.latitude"
              placeholder=""
            >
              <template #prefix>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    经度: {{ }}
                  </template>
                  经度: 默认 -1
                </n-tooltip>
              </template>
            </n-input>
            <n-input
              v-model:value="form.location.longitude"
              placeholder=""
            >
              <template #prefix>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    纬度: {{ }}
                  </template>
                  纬度: 默认 -1
                </n-tooltip>
              </template>
            </n-input>
          </n-space>
        </n-form-item>
        <!-- <n-form-item label="拍照签到" path="photo">
        <div />
      </n-form-item> -->
        <n-divider />
        <!-- <n-form-item label="自动监控" path="monitor">
          <n-switch v-model:value="form.monitor" />
        </n-form-item> -->
        <n-form-item label="签到类型" path="signType">
          <n-checkbox-group v-model:value="form.signType" name="signType">
            <n-space>
              <n-checkbox v-for="[value, label] in (Object.entries(signTypeMap))" :key="value" :label="label" :value="value" />
            </n-space>
          </n-checkbox-group>
        </n-form-item>
        <n-form-item>
          <n-space justify="end">
            <n-button @click="handleReset">
              重置
            </n-button>
            <n-button @click="handleSave">
              保存
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-spin>
  </n-modal>
</template>

<style scoped>
.n-form-item {
  --at-apply: mb-2;
}

:deep(.n-divider:not(.n-divider--vertical)){
  margin-top: 12px;
  margin-bottom: 12px;
}
</style>
