<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <small :class="cn('text-sm font-medium leading-none', props.class)">
    <slot />
  </small>
</template>
