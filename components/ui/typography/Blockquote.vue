<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  defaultValue?: string | number
  modelValue?: string | number
  editable?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <blockquote v-if="!editable" :class="cn(props.class, '')">
    <slot />
  </blockquote>
  <input
    v-else
    v-model="modelValue"
    :class="
      cn(
        'rounded px-2 py-4 transition-colors hover:bg-accent focus:bg-accent focus:outline-none',
        props.class,
      )
    "
  />
</template>
