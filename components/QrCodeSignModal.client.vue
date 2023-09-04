<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { QrcodeCapture, QrcodeDropZone, QrcodeStream } from 'vue-qrcode-reader'

export interface DetectedBarcode {
  boundingBox: BoundingBox
  rawValue: string
  format: string
  cornerPoints: {
    x: number
    y: number
  }[]
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
  top: number
  right: number
  bottom: number
  left: number
}

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

async function handleScan() {
  if (errorMessage.value)
    return ms.error(errorMessage.value)

  if (showScan.value)
    showScan.value = false

  else
    showScan.value = true
}

function onCameraOn(capabilities: any) {
  // hide loading indicator
  console.log(capabilities)
}

async function onError(error: any) {
  const errorMessages = {
    NotAllowedError: '您需要授予相机访问权限！',
    NotFoundError: '此设备上没有摄像头！',
    NotSupportedError: '需要安全上下文（HTTPS，本地主机）！',
    NotReadableError: '相机是否已经在使用？',
    OverconstrainedError: '安装的摄像头不合适！',
    StreamApiNotSupportedError: '此浏览器不支持 Stream API！',
    InsecureContextError: '仅在安全上下文中允许访问相机。使用 HTTPS 或 localhost 而不是 HTTP！',
  } as any

  errorMessage.value = errorMessages[error.name] ? errorMessages[error.name] : `相机错误（${error.name}）！`

  ms.error(errorMessage.value)
  showScan.value = false
}

async function onDetect(detectedCodes: DetectedBarcode[]) {
  console.log('detectedCodes', detectedCodes)

  const [firstCode] = detectedCodes

  if (firstCode) {
    const rawValue = firstCode.rawValue

    ms.success('二维码识别成功,正在签到...')
    text.value = rawValue
    showScan.value = false

    qrCodeSigning.value = true
    await handleQrCode(rawValue).finally(() => {
      qrCodeSigning.value = false
    })
  }
  else {
    ms.error('二维码识别失败')
  }
}

function handleOpen() {
  showScan.value = true
}

function handleClose() {
  showScan.value = false
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
        <QrcodeStream v-if="showScan && !qrcode" :constraints="{ facingMode: '' }" class="bg-black/20" @camera-on="onCameraOn" @error="onError" @detect="onDetect" />
        <QrcodeDropZone v-else class="flex flex-col justify-center items-center h-full w-full cursor-pointer " @detect="onDetect" @click="handleUpload()">
          <div style="padding-top: 16px;margin-bottom: 12px">
            <Icon name="material-symbols:unarchive-outline-sharp" size="48" />
          </div>
          <n-text>
            点击或者拖动文件到该区域来上传
          </n-text>
        </QrcodeDropZone>
        <QrcodeCapture :multiple="false" class="hidden" capture="environment" @detect="onDetect" />
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
