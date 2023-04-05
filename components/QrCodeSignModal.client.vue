<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'
import * as QRcode from 'qrcode'
import jsQR from 'jsqr'

const emit = defineEmits(['success'])

const message = useMessage()
const showPreviewModal = ref(false)
const fileList = ref<UploadFileInfo[]>([])
const previewImageUrl = ref('')
const link = ref<string>('')

async function handleQrCode(result: string) {
  // 将二维码识别结果返回给父组件
  emit('success', result)
}

async function handlePreview(file: UploadFileInfo) {
  previewImageUrl.value = file.url ?? await file2Base64(file.file!)
  showPreviewModal.value = true
}

const qrCodeSigning = ref(false)
const handleUpload = async ({
  file,
  onFinish,
}: any) => {
  file = {
    ...file,
    status: 'finished',
    url: await file2Base64(file.file!),
  }

  const image = new Image()
  image.src = await file2Base64(file.file!)
  image.onload = async () => {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    canvas.getContext('2d')!.drawImage(image, 0, 0, image.width, image.height)
    const imageData = canvas.getContext('2d')!.getImageData(0, 0, image.width, image.height)
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height)

    if (qrCode) {
      message.success('二维码识别成功,正在签到...')

      link.value = qrCode.data
      qrCodeSigning.value = true

      const imgBase64 = await QRcode.toDataURL(qrCode.data, {
        errorCorrectionLevel: 'H',
        margin: 2,
        scale: 6,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
      file.url = imgBase64

      fileList.value[0] = {
        id: 'qrCode',
        name: 'qrCode.png',
        status: 'finished',
        url: imgBase64,
      }

      await handleQrCode(qrCode.data).finally(() => {
        qrCodeSigning.value = false
      })
    }
    else {
      message.error('二维码识别失败')
    }

    onFinish()
  }
}

watch(fileList, (fileList) => {
  if (fileList.length === 0)
    link.value = ''
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
    :style="{ 'max-width': '300px' }"
    transform-origin="center"
  >
    <n-upload
      v-model:file-list="fileList"
      directory-dnd
      :show-file-list="true"
      list-type="image-card"
      :max="1"
      :custom-request="handleUpload"
      @preview="handlePreview"
    >
      <n-upload-dragger>
        <div style="padding-top: 16px;margin-bottom: 12px">
          <Icon name="material-symbols:unarchive-outline-sharp" size="48" />
        </div>
        <n-text>
          请上传二维码图片
        </n-text>
      </n-upload-dragger>
    </n-upload>
    <n-modal
      v-model:show="showPreviewModal"
      preset="card"
      style="width: 600px"
      title="预览"
    >
      <img :src="previewImageUrl" style="width: 100%">
    </n-modal>

    <span>若有签到链接，请在下方输入</span>
    <n-input-group>
      <n-input v-model:value="link" placeholder="签到链接" clearable />
      <n-button type="primary" :loading="qrCodeSigning" @click="handleQrCode(link)">
        签到
      </n-button>
    </n-input-group>
  </n-modal>
</template>

<style scoped>
:deep(.n-upload-file-list.n-upload-file-list--grid) {
  display: flex;
}

:deep(.n-upload-trigger.n-upload-trigger--image-card){
  width: 100%;
  height: 100%;
  aspect-ratio: 1/1;
}

:deep(.n-upload-file-list .n-upload-file.n-upload-file--image-card-type){
  width: 100%;
  height: 100%;
  aspect-ratio: 1/1;
}
:deep(.n-upload-trigger.n-upload-trigger--image-card .n-upload-dragger){
  display: flex;
  flex-direction: column;
}
</style>
