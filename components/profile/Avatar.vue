<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AvatarRoot } from 'radix-vue'
import { type AvatarVariants, avatarVariant } from '../ui/avatar'
import { cn } from '@/lib/utils'
import type { Database } from '~/lib/schema'

const props = withDefaults(
  defineProps<{
    profile: Database['public']['Tables']['profiles']['Row']
    class?: HTMLAttributes['class']
    size?: AvatarVariants['size']
    shape?: AvatarVariants['shape']
  }>(),
  {
    size: 'sm',
    shape: 'circle',
  },
)

const shortName = computed(
  () =>
    props.profile.full_name
      ?.split(' ')
      .filter((s) => s.length > 0)
      .map((s) => s.at(0))
      .join('') ?? '',
)
</script>

<template>
  <AvatarRoot :class="cn(avatarVariant({ size, shape }), props.class)">
    <AvatarImage :src="profile.avatar_url ?? ''"></AvatarImage>
    <AvatarFallback>{{ shortName }}</AvatarFallback>
  </AvatarRoot>
</template>
