<script setup lang="ts">
const props = defineProps<{
  uid: string
  info: API.AccountInfo
  setting: {
    autoSign: boolean
  }
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
    await accountStore.oneClickSign(uid)
  }
  catch (error) { }
  finally {
    loading.value = false
  }
}

async function handleLogout() {
  await accountStore.logout(props.uid)
}
</script>

<template>
  <n-card hoverable class="group cursor-pointer " :class="{ 'n-card-checked': selected }">
    <template #header>
      <div class="flex items-center gap-2">
        <n-avatar :src="info.avatar" />
        <span>{{ info.siteName }}</span>
        <span>{{ info.realname }}</span>
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
        :negative-text="null"
        @positive-click="handleLogout()"
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
            <Icon v-else name="material-symbols:swipe-up-outline" class="hover:animate-bounce" @click="oneClickSign(uid)" />
          </template>
          手动一键签到(检测所有课程,可能会比较慢)
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <Icon name="mdi:qrcode-scan" class="hover:scale-125" @click="showQrCodeModal = true" />
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
    <QrCodeSignModal v-model:show="showQrCodeModal" :uids="[uid]" />
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
