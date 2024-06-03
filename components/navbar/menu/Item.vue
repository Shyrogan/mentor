<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

defineProps<{
  title: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <NavigationMenuItem>
    <NavigationMenuTrigger>{{ title }}</NavigationMenuTrigger>
    <NavigationMenuContent>
      <slot />
    </NavigationMenuContent>
  </NavigationMenuItem>
</template>
