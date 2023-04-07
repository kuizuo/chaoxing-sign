<script setup lang="ts">
import _ from 'lodash'

interface Props {
  uid: string
  setting: API.Setting
}

const props = defineProps<Props>()

const accountStore = useAccountStore()

const form = ref<API.Setting>(_.cloneDeep({
  ...defaultSetting,
  ...props.setting,
}))

async function handleSave() {
  await accountStore.updateSetting(props.uid, unref(form))
}

function handleReset() {
  accountStore.resetSetting(props.uid)
}
</script>

<template>
  <n-modal title="设置" :auto-focus="false" preset="card" style="max-width: 300px">
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
