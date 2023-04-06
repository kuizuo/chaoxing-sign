<script setup lang="ts">
const props = defineProps<{
  uid: string
  info: API.AccountInfo
  setting: API.Setting
  lastLoginTime?: string
  selected?: boolean
}>()

const message = useMessage()
const accountStore = useAccountStore()

const loading = ref(false)
const showQrCodeModal = ref(false)

async function oneClickSign(uid: string) {
  loading.value = true
  try {
    const data = await accountStore.oneClickSign(uid)

    // 如果一键签到中有二维码签到的课程,则弹出二维码扫码签到的弹窗
    const hasQrCodeSign = data.some(({ activity }) => activity.activeType === 2)

    if (hasQrCodeSign) {
      message.warning('检测到有二维码签到的课程,请扫码签到')
      showQrCodeModal.value = true
    }
  }
  finally {
    loading.value = false
  }
}

async function handleLogout() {
  await accountStore.logout(props.uid)
}

async function handleSuccess(result: string) {
  await accountStore.signByQrCode(props.uid, result)
}

async function handleMonitor() {
  await accountStore.monitorAccount(props.uid)
}

async function handleUnMonitor() {
  await accountStore.unMonitorAccount(props.uid)
}
</script>

<template>
  <n-card hoverable class="group cursor-pointer" :class="{ 'n-card-checked': selected }">
    <template #header>
      <div class="flex items-center gap-2">
        <n-avatar :src="info.avatar" />
        <n-popover trigger="hover">
          <template #trigger>
            <span class="truncate max-w-[10ch]">{{ info.siteName }}</span>
          </template>
          <span>{{ info.siteName }}</span>
        </n-popover>
        <span>{{ info.realname }}</span>
        <n-popover v-if="setting?.monitor" trigger="hover">
          <template #trigger>
            <n-popconfirm
              :negative-text="null"
              @positive-click="handleUnMonitor()"
            >
              <template #trigger>
                <Icon name="material-symbols:ecg-heart-outline-sharp" class="animate-pulse text-green-600" @click.stop="" />
              </template>
              确认取消监听该账号签到任务?
            </n-popconfirm>
          </template>
          监听中...
        </n-popover>
      </div>
    </template>

    <template #header-extra>
      <n-popconfirm
        :negative-text="null"
        @positive-click.stop="handleLogout()"
      >
        <template #trigger>
          <Icon
            name="material-symbols:logout-sharp"
            class="absolute -right-2 cursor-pointer transition opacity-0 hover:text-red-500 group-hover:(opacity-100 -translate-x-6)"
          />
        </template>
        确认退出? 这将会清空本系统该账号的所有信息
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
            <Icon v-else name="material-symbols:swipe-up-outline" class="hover:animate-bounce" @click.stop="oneClickSign(uid)" />
          </template>
          手动一键签到(检测所有课程,可能会比较慢)
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <Icon name="mdi:qrcode-scan" class="hover:scale-125" @click.stop="showQrCodeModal = true" />
          </template>
          二维码扫码签到
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <Icon v-if="setting?.monitor" name="material-symbols:notifications-off-outline" class="hover:animate-swing" @click.stop="handleUnMonitor()" />
            <Icon v-else name="material-symbols:notifications-active-outline" class="hover:animate-swing" @click.stop="handleMonitor()" />
          </template>
          {{ setting?.monitor ? '正在监听...' : '自动监听签到任务' }}
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <Icon name="material-symbols:history-rounded" @click.stop="message.warning('敬请期待')" />
          </template>
          签到记录
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <Icon name="material-symbols:settings-outline" @click.stop="message.warning('敬请期待')" />
          </template>
          签到设置
        </n-tooltip>
      </n-space>
    </template>
    <QrCodeSignModal v-model:show="showQrCodeModal" @success="handleSuccess" />
  </n-card>
</template>

<style lang="scss" scoped>
.icon{
  --at-apply: cursor-pointer transition hover:text-red-4
}

.n-card-checked {
  --checked-color: rgba(147,197,253,0.5);
  --n-border-color: var(--checked-color) !important;
  --at-apply: transition;

  :deep(:is(.n-card-header, .n-card__content)) {
    --at-apply: bg-[var(--checked-color)];
  }

}
.n-card-checked:after {
    position: absolute;
    inset-block-start: 2px;
    inset-inline-end: 2px;
    width: 0;
    height: 0;
    border: 6px solid #3c86ec;
    border-block-end: 6px solid transparent;
    border-inline-start: 6px solid transparent;
    border-start-end-radius: 2px;
    content: '';
}
</style>
