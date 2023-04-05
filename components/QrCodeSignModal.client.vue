<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { QrCapture, QrDropzone, QrStream } from 'vue3-qr-reader'

const emit = defineEmits(['success'])

const message = useMessage()
const text = ref('')
const qrcode = useQRCode(text, {
  errorCorrectionLevel: 'H',
  margin: 2,
  scale: 10,
  color: {
    dark: '#000000',
    light: '#FFFFFF',
  },
})

async function handleQrCode(text: string) {
  // 将二维码识别结果返回给父组件
  emit('success', text)
}

const qrCodeSigning = ref(false)

const showScan = ref(false)
const errorMessage = ref('')
const camera = ref<'auto' | 'off'>('off')

async function handleScan() {
  if (showScan.value) {
    showScan.value = false
    camera.value = 'off'
  }
  else {
    showScan.value = true
    camera.value = 'auto'
  }
}

async function onInit(promise: any) {
  try {
    await promise
  }
  catch (error: any) {
    if (error.name === 'NotAllowedError')
      errorMessage.value = '错误：您需要授予相机访问权限！'

    else if (error.name === 'NotFoundError')
      errorMessage.value = '错误：此设备上没有摄像头！'

    else if (error.name === 'NotSupportedError')
      errorMessage.value = '错误：需要安全上下文（HTTPS，本地主机）！'

    else if (error.name === 'NotReadableError')
      errorMessage.value = '错误：相机是否已经在使用？'

    else if (error.name === 'OverconstrainedError')
      errorMessage.value = '错误：安装的摄像头不合适！'

    else if (error.name === 'StreamApiNotSupportedError')
      errorMessage.value = '错误：此浏览器不支持 Stream API！'

    else if (error.name === 'InsecureContextError')
      errorMessage.value = '错误：仅在安全上下文中允许访问相机。使用 HTTPS 或 localhost 而不是 HTTP！'

    else
      errorMessage.value = `错误：相机错误（${error.name}）！`
  }
}

async function onDecode(res: string) {
  if (res) {
    message.success('二维码识别成功,正在签到...')
    text.value = res
    showScan.value = false
    camera.value = 'off'

    qrCodeSigning.value = true
    await handleQrCode(res).finally(() => {
      qrCodeSigning.value = false
    })
  }
  else {
    message.error('二维码识别失败')
  }
}

function handleClose() {
  showScan.value = false
  camera.value = 'off'
}
</script>

<template>
  <n-modal
    :mask-closable="false"
    preset="card"
    size="large"
    title="上传二维码图片"
    :bordered="false"
    :closable="true"
    :style="{ 'max-width': '360px' }"
    transform-origin="center"
    @after-leave="handleClose"
  >
    <n-alert v-show="errorMessage" class="mb-2">
      {{ errorMessage }}
    </n-alert>
    <n-space class="mb-2">
      <n-button type="info" @click="handleScan">
        {{ showScan ? '关闭' : '扫一扫' }}
      </n-button>
      <!-- <n-button>
        <QrCapture class="w-150px" @decode="onDecode" />
      </n-button> -->
      <n-button v-if="qrcode" type="error" @click="text = ''">
        清除
      </n-button>
    </n-space>
    <div class="w-full aspect-1 border-1">
      <n-image v-if="qrcode && !showScan" :src="qrcode" />

      <template v-else>
        <QrStream v-if="showScan" class="stream" :camera="camera" @onInit="onInit" @decode="onDecode" />
        <QrDropzone v-else class="flex justify-center items-center h-full w-full" @decode="onDecode">
          <div style="padding-top: 16px;margin-bottom: 12px">
            <Icon name="material-symbols:unarchive-outline-sharp" size="48" />
          </div>
          <n-text>
            将二维码图片拖拽至此
          </n-text>
        </QrDropzone>
      </template>
    </div>
    <span>若有签到链接，请在下方输入</span>
    <n-input-group>
      <n-input v-model:value="text" placeholder="签到链接" clearable />
      <n-button type="primary" :loading="qrCodeSigning" @click="handleQrCode(text)">
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
