<template>
  <nav px-6 py-2 border="b gray-400/10" flex="~ gap-2 " items-center>
    <AppLogo />
    <div flex="auto" />

    <div flex="~ gap-4" items-center>
      <NuxtLink to="/changelog">
        <div font-medium text-sm hover="opacity-100 text-green-600">
          更新公告
        </div>
      </NuxtLink>
      <NuxtLink to="/help">
        <div font-medium text-sm hover="opacity-100 text-green-600">
          帮助说明
        </div>
      </NuxtLink>

      <AppDarkToggle />
      <UserDropdown />
    </div>
  </nav>
</template>
