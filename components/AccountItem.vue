<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { SignTypeEnum } from '~/constants/cx'

const props = defineProps<{
  uid: string
  username?: string
  info: CX.User
  setting: CX.Setting
  selected?: boolean
  lastLoginTime: string
}>()

const ms = useMessage()
const accountStore = useAccountStore()

const loading = ref(false)
const showQrCodeModal = ref(false)
const showCodeOrGestureModal = ref(false)

const showSettingModal = ref(false)
const showSignHistory = ref(false)

// 正在执行中的活动
const doingActivity = ref<CX.ActivityItem | null>(null)

const monitor = ref(props.setting.monitor)

async function oneClickSign(uid: string) {
  loading.value = true

  const data = await accountStore.oneClickSign(uid).finally(() => {
    loading.value = false
  }) as CX.SignResult[]

  // // 如果一键签到中有二维码签到的课程,则弹出二维码扫码签到的弹窗
  const QrCodeSignActivity = data.find(item => item.signType === SignTypeEnum.QRCode)?.activity

  if (QrCodeSignActivity) {
    doingActivity.value = QrCodeSignActivity
    ms.warning(`检测到有二维码签到的课程[${QrCodeSignActivity.course?.name}],请扫码`, { duration: 20 * 1000, closable: true })
    showQrCodeModal.value = true
    return
  }

  // 检测到签到码签到
  const CodeSignActivity = data.find(item => item.signType === SignTypeEnum.Code)?.activity

  if (CodeSignActivity) {
    doingActivity.value = CodeSignActivity
    ms.warning(`检测到有签到码签到的课程[${CodeSignActivity.course?.name}],请输入签到码, 如 1234`, { duration: 20 * 1000, closable: true })
    showCodeOrGestureModal.value = true
    return
  }

  // 检测到手势签到
  const GestureSignActivity = data.find(item => item.signType === SignTypeEnum.Gesture)?.activity

  if (GestureSignActivity) {
    doingActivity.value = GestureSignActivity
    ms.warning(`检测到有手势签到的课程[${GestureSignActivity.course?.name}],请输入手势轨迹, 如 123654789`, { duration: 20 * 1000, closable: true })
    showCodeOrGestureModal.value = true
  }
}

async function handleLogout() {
  loading.value = true

  await accountStore.logout(props.uid).finally(() => {
    loading.value = false
  })
}

async function handleQrCodeSignSuccess(result: string) {
  await accountStore.signByQrCode(props.uid, result, doingActivity.value!.course.courseId!)
}

async function handleCodeOrGestureSignSuccess(result: string) {
  const activity = unref(doingActivity)

  if (!activity)
    return

  loading.value = true

  try {
    if (activity.otherId === SignTypeEnum.Code)
      await accountStore.signByCode(props.uid, doingActivity.value!.course.courseId!, String(activity.id), result)

    else if (activity.otherId === SignTypeEnum.Gesture)
      await accountStore.signByGesture(props.uid, doingActivity.value!.course.courseId!, String(activity.id), result)
  }
  finally {
    loading.value = false
  }
}

async function handleMonitor() {
  loading.value = true

  await accountStore.monitorAccount(props.uid).finally(() => {
    loading.value = false
  })

  monitor.value = true
}

async function handleUnMonitor() {
  loading.value = true

  await accountStore.unMonitorAccount(props.uid).finally(() => {
    loading.value = false
  })

  monitor.value = false
}
</script>

<template>
  <n-spin :show="loading">
    <n-card hoverable class="group cursor-pointer" :class="{ 'n-card-checked': selected }">
      <template #header>
        <div class="flex items-center gap-2">
          <n-avatar :src="info.avatar" />
          <n-ellipsis class="!max-w-[10ch]">
            {{ info.siteName }}
          </n-ellipsis>
          <span cllass="text-sm">{{ info.realname }}</span>
          <n-popover v-if="monitor" trigger="hover">
            <template #trigger>
              <n-popconfirm
                :negative-text="null"
                @positive-click="handleUnMonitor()"
              >
                <template #trigger>
                  <Icon name="material-symbols:ecg-heart-outline-sharp" class="animate-pulse text-primary" @click.stop="" />
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
              <Icon name="material-symbols:swipe-up-outline" class="hover:animate-bounce" @click.stop="oneClickSign(uid)" />
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
              <Icon v-if="monitor" name="material-symbols:notifications-off-outline" class="hover:animate-swing" @click.stop="handleUnMonitor()" />
              <Icon v-else name="material-symbols:notifications-active-outline" class="hover:animate-swing" @click.stop="handleMonitor()" />
            </template>
            {{ monitor ? '正在监听...' : '自动监听签到任务' }}
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <Icon name="material-symbols:history-rounded" @click.stop="showSignHistory = true" />
            </template>
            签到记录
          </n-tooltip>

          <n-tooltip trigger="hover">
            <template #trigger>
              <Icon class="hover:(animate-spin animate-count-1)" name="material-symbols:settings-outline" @click.stop="showSettingModal = true" />
            </template>
            签到设置
          </n-tooltip>
        </n-space>
      </template>
      <QrCodeSignModal v-model:show="showQrCodeModal" :title="doingActivity?.course.name" @success="handleQrCodeSignSuccess" />
      <CodeOrGestureSignModal v-model:show="showCodeOrGestureModal" :activity="doingActivity!" :loading="loading" @success="handleCodeOrGestureSignSuccess" />
      <SignHistory v-model:show="showSignHistory" :uid="uid" />
      <SettingModal v-if="showSettingModal" v-model:show="showSettingModal" :uid="uid" :setting="setting" />
    </n-card>
    <template #description>
      马上就好...
    </template>
  </n-spin>
</template>

<style lang="scss" scoped>
.icon {
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
