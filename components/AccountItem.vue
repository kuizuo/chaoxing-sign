<script setup lang="ts">
const props = defineProps<{
  uid: string
  avatar: string
  siteName: string
  realname: string
  setting: {
    autoSign: boolean
  }
  lastLoginTime?: string
}>()

const router = useRouter()
const accountStore = useAccountStore()

const message = useMessage()

const loading = ref(false)

function handlePositiveClick() {
  accountStore.logout(props.uid)
}

async function sign(uid: string) {
  loading.value = true
  try {
    await accountStore.oneClickSign(uid)
  }
  catch (error) { }
  finally {
    loading.value = false
  }
}

async function signByQrCode() {
  message.warning('二维码签到暂未开放,请敬请期待')
}
</script>

<template>
  <n-card hoverable class="group">
    <template #header>
      <div class="flex items-center gap-2">
        <n-avatar :src="avatar" />
        <span>{{ siteName }}</span>
        <span>{{ realname }}</span>
        <n-popover v-if="setting?.autoSign" trigger="hover">
          <template #trigger>
            <Icon name="material-symbols:ecg-heart-outline-sharp" class="animate-pulse text-green-600" />
          </template>
          自动签到中...
        </n-popover>
      </div>
    </template>

    <template #header-extra>
      <n-popconfirm
        @positive-click="handlePositiveClick"
      >
        <template #trigger>
          <Icon
            name="material-symbols:logout-sharp"
            class="absolute -right-2 cursor-pointer transition opacity-0 hover:text-red-500 group-hover:(opacity-100 -translate-x-6)"
          />
        </template>
        确认退出?
      </n-popconfirm>
    </template>

    <div class="text-left">
      <p>
        最近登录时间: {{ useDateFormat(lastLoginTime, 'YYYY-MM-DD HH:mm:ss').value }}
      </p>
    </div>

    <template #action>
      <n-space :size="20">
        <n-tooltip trigger="hover">
          <template #trigger>
            <NuxtLink :to="`/account/${uid}`">
              <Icon name="material-symbols:medical-information-outline-sharp" />
            </NuxtLink>
          </template>
          账号详情
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <Icon v-if="loading" name="line-md:loading-loop" />
            <Icon v-else name="material-symbols:swipe-up-outline" class="hover:animate-bounce" @click="sign(uid)" />
          </template>
          手动一键签到(检测所有课程,可能会比较慢)
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <Icon name="mdi:qrcode-scan" class="hover:scale-125" @click="signByQrCode" />
          </template>
          二维码扫码签到
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <Icon name="material-symbols:alarm-outline" class="hover:animate-swing" @click="message.warning('敬请期待')" />
          </template>
          后台自动签到
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <Icon name="material-symbols:settings-outline" @click="message.warning('敬请期待')" />
          </template>
          签到设置
        </n-tooltip>
      </n-space>
    </template>
  </n-card>
</template>

<style scoped>
.icon{
  --at-apply: cursor-pointer transition hover:text-red-4
}
</style>
