<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { QrCapture, QrDropzone, QrStream } from 'vue3-qr-reader'

interface Emit {
  (e: 'success', text: string): void
}

const emit = defineEmits<Emit>()

const ms = useMessage()
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
  if (errorMessage.value)
    return ms.error(errorMessage.value)

  if (showScan.value) {
    showScan.value = false
    camera.value = 'off'
  }
  else {
    showScan.value = true
    camera.value = 'auto'
  }
}

async function onInit(promise: Promise<any>) {
  try {
    await promise
  }
  catch (error: any) {
    const errorMessages = {
      NotAllowedError: '您需要授予相机访问权限！',
      NotFoundError: '此设备上没有摄像头！',
      NotSupportedError: '需要安全上下文（HTTPS，本地主机）！',
      NotReadableError: '相机是否已经在使用？',
      OverconstrainedError: '安装的摄像头不合适！',
      StreamApiNotSupportedError: '此浏览器不支持 Stream API！',
      InsecureContextError: '仅在安全上下文中允许访问相机。使用 HTTPS 或 localhost 而不是 HTTP！',
    } as const

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    errorMessage.value = errorMessages[error.name] ? errorMessages[error.name] : `相机错误（${error.name}）！`

    ms.error(errorMessage.value)
    showScan.value = false
    camera.value = 'off'
  }
}

async function onDecode(res: string) {
  if (res) {
    ms.success('二维码识别成功,正在签到...')
    text.value = res
    showScan.value = false
    camera.value = 'off'

    qrCodeSigning.value = true
    await handleQrCode(res).finally(() => {
      qrCodeSigning.value = false
    })
  }
  else {
    ms.error('二维码识别失败')
  }
}

function handleOpen() {
  showScan.value = true
  camera.value = 'auto'
}

function handleClose() {
  showScan.value = false
  camera.value = 'off'
}

function handleUpload() {
  const fileInput = document.querySelector('input[type="file"]')! as HTMLInputElement

  fileInput.click()
}

watch(text, () => {
  if (!text.value)
    qrcode.value = ''
})
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
    @after-enter="handleOpen"
    @after-leave="handleClose"
  >
    <n-space class="mb-2">
      <n-button type="info" :disabled="!!errorMessage" @click="handleScan">
        {{ showScan ? '关闭' : '扫一扫' }}
      </n-button>
      <n-button v-if="qrcode" type="error" @click="text = ''">
        清除
      </n-button>
    </n-space>
    <div class="w-full aspect-1 border-1 transition hover:(border-1 border-green border-dotted)">
      <n-image v-if="qrcode && !showScan" :src="qrcode" />

      <template v-else>
        <QrStream v-if="showScan && !qrcode" class="stream" :camera="camera" @init="onInit" @decode="onDecode" />
        <QrDropzone v-else class="flex flex-col justify-center items-center h-full w-full cursor-pointer " @decode="onDecode" @click="handleUpload()">
          <div style="padding-top: 16px;margin-bottom: 12px">
            <Icon name="material-symbols:unarchive-outline-sharp" size="48" />
          </div>
          <n-text>
            点击或者拖动文件到该区域来上传
          </n-text>
        </QrDropzone>
        <QrCapture class="hidden" capture="false" @decode="onDecode" />
      </template>
    </div>
    <span>若有签到链接，可直接在下方输入</span>
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
