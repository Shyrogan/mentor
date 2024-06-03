<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList :class="class">
      <slot />
    </NavigationMenuList>
  </NavigationMenu>
</template>
