<template>
  <div>
    <Suspense>
      <template #fallback>
        <div op50 italic>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
      <div flex justify-center>
        <n-card max-w-6xl>
          <div min-w-sm>
            <Hero />
            <AccountList />
            <!-- <Operation /> -->
            <Log />
          </div>
        </n-card>
      </div>
    </Suspense>
  </div>
</template>
