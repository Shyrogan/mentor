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
  <h4 v-if="!editable" :class="cn('scroll-m-20 text-xl font-semibold tracking-tight', props.class)">
    <slot />
  </h4>
  <input
    v-else
    v-model="modelValue"
    :class="
      cn(
        'scroll-m-20 rounded px-2 py-4 text-xl font-semibold tracking-tight transition-colors hover:bg-accent focus:bg-accent focus:outline-none',
        props.class,
      )
    "
  />
</template>
