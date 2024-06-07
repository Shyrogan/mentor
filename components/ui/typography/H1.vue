<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  modelValue?: string | number
  editable?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const children = useSlots().default?.call(this)[0].children?.toString()
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: children,
})
</script>

<template>
  <h1
    v-if="!editable"
    :class="cn(props.class, 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl')"
  >
    <slot />
  </h1>
  <input
    v-else
    v-model="modelValue"
    :class="
      cn(
        'scroll-m-20 rounded px-2 py-4 text-4xl font-extrabold tracking-tight transition-colors hover:bg-accent focus:bg-accent focus:outline-none lg:text-5xl',
        props.class,
      )
    "
  />
</template>
