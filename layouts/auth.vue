<template>
  <main class="flex h-screen w-screen flex-col items-center justify-center align-middle">
    <NuxtLink to="/">
      <Logo class="mb-10 h-16" />
    </NuxtLink>
    <Card class="w-[28rem]">
      <slot />
    </Card>
  </main>
</template>
