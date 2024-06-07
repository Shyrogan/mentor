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

const size = computed(
  () => `${0.75 + 1.75 * (modelValue.value?.toString()?.split('\n')?.length ?? 0)}rem`,
)
</script>

<template>
  <p v-if="!editable" :class="cn('font-medium leading-7', props.class)">
    <slot />
  </p>
  <textarea
    v-else-if="editable && multiline"
    v-model="modelValue"
    @keyup=""
    :class="
      cn(
        'resize-none rounded px-2 py-1.5 font-medium leading-7 transition-colors hover:bg-accent focus:bg-accent focus:outline-none',
        props.class,
      )
    "
    :style="'height: ' + size"
  />
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
