<script setup lang="ts">
import { activityTypeMap } from '~~/constants/cx'

const props = defineProps<{
  account: CX.Account
  courses: API.Course[]
}>()

const message = useMessage()
const accountStore = useAccountStore()

const isSyncLoading = ref(false)
const showModal = ref(false)

const currentCourse = ref<API.Course>()
const activities = ref<API.Activity[]>([])

function syncCourse() {
  isSyncLoading.value = true
  accountStore.getCourses(props.account.uid).finally(() => {
    isSyncLoading.value = false
  })
}

const lookActivities = async (course: API.Course) => {
  course.isLoadActivity = true
  currentCourse.value = course
  activities.value = []
  try {
    activities.value = await accountStore.getActivityList(props.account.uid, course)
    showModal.value = true
  }
  finally {
    course.isLoadActivity = false
  }
}

async function signByCourse(course: API.Course) {
  course.isSigning = true
  try {
    await accountStore.signByCourse(props.account.uid, course)
  }
  finally {
    course.isSigning = false
  }
}

async function signByActivity(course: API.Course, activity: API.Activity) {
  await accountStore.signByActivity(props.account.uid, course, activity)
}
</script>

<template>
  <n-divider dashed>
    <span class="space-x-2">
      <span v-if="account?.courses?.length! > 0"> 共 {{ account?.courses?.length }} 门课程</span>
      <span v-else>课程列表</span>
      <n-tooltip trigger="hover">
        <template #trigger>
          <Icon
            name="material-symbols:cloud-sync-outline-rounded"
            class="cursor-pointer"
            :class="{ 'animate-spin': isSyncLoading }"
            @click="syncCourse()"
          />
        </template>
        同步课程
      </n-tooltip>
    </span>
  </n-divider>
  <n-card v-if="courses?.length > 0">
    <n-grid :x-gap="12" :y-gap="8" cols="2 s:3 m:4 l:4 xl:4 2xl:6" responsive="screen">
      <n-grid-item v-for="course in courses" :key="course.courseId">
        <n-card size="small" hoverable>
          <template #header>
            <h2 class="text-base truncate">
              {{ course.name }}
            </h2>
          </template>
          <template #cover>
            <img :src="course.image">
          </template>
          <template #action>
            <n-space :size="20">
              <n-tooltip trigger="hover">
                <template #trigger>
                  <Icon v-if="course.isLoadActivity" name="line-md:loading-loop" />
                  <Icon v-else name="material-symbols:grid-view-outline-rounded" @click="lookActivities(course)" />
                </template>
                活动列表
              </n-tooltip>

              <n-tooltip trigger="hover">
                <template #trigger>
                  <Icon v-if="course.isSigning" name="line-md:loading-loop" />
                  <Icon v-else name="material-symbols:swipe-up-outline" class="hover:animate-bounce" @click="signByCourse(course)" />
                </template>
                一键签到
              </n-tooltip>

              <n-tooltip trigger="hover">
                <template #trigger>
                  <Icon name="material-symbols:alarm-outline" class="hover:animate-swing" @click="message.warning('敬请期待')" />
                </template>
                后台签到
              </n-tooltip>
            </n-space>
          </template>
        </n-card>
      </n-grid-item>
    </n-grid>
  </n-card>
  <div v-else>
    <n-empty description="暂无课程" size="small" />
  </div>
  <n-modal
    v-model:show="showModal"
    title="活动列表"
    preset="card"
    size="medium"
    :bordered="false"
    :closable="true"
    :style="{ 'max-width': '500px' }"
    transform-origin="center"
  >
    <div v-if="activities.length > 0">
      <n-list hoverable clickable>
        <n-list-item v-for="activity in activities" :key="activity.id">
          <n-thing>
            <template v-if="activity.logo" #avatar>
              <n-avatar :size="50" :src="activity.logo" style="--n-color: rgb(255 255 255 / 0%);" />
            </template>
            <template #header>
              <div inline-flex items-center font-sans>
                <h2 text-lg>
                  {{ activity.nameOne }}
                </h2>
                <p ml-2 text-sm text-gray>
                  {{ activity.nameFour }}
                </p>
              </div>
            </template>
            <template #description>
              <n-tag :bordered="false" type="info" size="small">
                {{ activityTypeMap[activity.type] }}
              </n-tag>
            </template>
          </n-thing>
          <template #suffix>
            <n-button v-if="activity.status === 1" type="primary" @click="signByActivity(currentCourse!, activity)">
              签到
            </n-button>
          </template>
        </n-list-item>
      </n-list>
    </div>
    <div v-else>
      <n-empty description="暂无活动" size="small" />
    </div>
  </n-modal>
</template>

<style scoped>
.icon{
  --at-apply: cursor-pointer transition hover:text-red-4
}
</style>
