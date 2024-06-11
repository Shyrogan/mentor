<script setup lang="ts">
import type { NuxtLinkProps } from '#app'
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  title?: string
  icon?: string
  class?: HTMLAttributes['class']
  to?: NuxtLinkProps['to']
}>()
</script>

<template>
  <NuxtLink
    :class="
      cn(
        'flex flex-col justify-center rounded p-4 text-center transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
        props.class,
      )
    "
    :to="to"
  >
    <Icon v-if="icon" :name="icon" class="mb-4 w-full" />
    <h3 class="text-sm font-medium">{{ title }}</h3>
    <p class="text-sm text-muted-foreground">
      <slot />
    </p>
  </NuxtLink>
</template>
