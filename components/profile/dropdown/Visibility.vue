<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: string
  modelValue?: string
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

function visibilityName(visibility?: string) {
  if (visibility === 'public') {
    return 'Publique'
  }
  if (visibility === 'private') {
    return 'Privée'
  }

  if (visibility === 'mentored') {
    return 'Mentoré(s)'
  }
}

function visibilityIcon(visibility?: string) {
  return visibility === 'public' ? 'lucide:eye' : 'lucide:eye-off'
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="ghost">
        <Icon :name="visibilityIcon(modelValue)" class="mr-2" />
        {{ visibilityName(modelValue) }}
        <Icon name="lucide:chevron-down" class="ml-1" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuRadioGroup
        v-bind:model-value="modelValue"
        @update:model-value="
          (v) => {
            emits('update:modelValue', v as unknown as string)
          }
        "
      >
        <DropdownMenuRadioItem value="public">Public</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="private">Privée</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="mentored">Mentorés uniquement</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
