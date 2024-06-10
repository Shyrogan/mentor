<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  modelValue?: string | number
  editable?: boolean
  multiline?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const children = useSlots().default?.call(this)[0].children?.toString()
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: children,
})

function onValueChange(e: KeyboardEvent) {
  const target = e.target as HTMLElement
  modelValue.value = target.outerText
}
</script>

<template>
  <p v-if="!editable" :class="cn('font-medium leading-7', props.class)">
    <slot />
  </p>
  <p
    v-else-if="editable && multiline"
    @keyup="onValueChange"
    contenteditable
    :class="
      cn(
        'resize-none rounded px-2 py-1.5 font-medium leading-7 transition-colors hover:bg-accent focus:bg-accent focus:outline-none',
        props.class,
      )
    "
  >
    {{ children }}
  </p>
  <input
    v-else
    v-model="modelValue"
    :class="
      cn(
        'resize-none rounded px-2 py-1.5 font-medium leading-7 transition-colors hover:bg-accent focus:bg-accent focus:outline-none',
        props.class,
      )
    "
  />
</template>
