<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AvatarRoot } from 'radix-vue'
import { type AvatarVariants, avatarVariant } from '../ui/avatar'
import { cn } from '@/lib/utils'
import type { Database } from '~/lib/schema'

const supabase = useSupabaseClient<Database>()
const props = withDefaults(
  defineProps<{
    profile: Database['public']['Tables']['profiles']['Row']
    class?: HTMLAttributes['class']
    size?: AvatarVariants['size']
    shape?: AvatarVariants['shape']
    editable?: boolean
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
const fileInput = ref<HTMLInputElement | null>(null)
function handleAvatarClick() {
  if (props.editable && fileInput.value) {
    fileInput.value.click()
  }
}
async function handleUpload() {
  const files = fileInput.value?.files
  if (files && files.length > 0) {
    const file = files.item(0)!
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const { data: storageFile, error: storageError } = await supabase.storage
      .from('avatars')
      .upload(`${props.profile.id}/${fileName}`, file, { upsert: true })
    if (storageError) {
      console.error(storageError)
      return
    }
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: props.profile.id, avatar_url: storageFile.path })
    if (error) {
      console.error(error)
      return
    }
    refresh()
    console.log('refreshing')
  }
}

const { data: url, refresh } = useAsyncData(`profile/${props.profile.id}/avatar`, async () => {
  if (props.profile.avatar_url.length == 0) return undefined

  const { data } = await supabase.storage
    .from('avatars')
    .createSignedUrl(props.profile.avatar_url, 3600)
  return data?.signedUrl
})
</script>

<template>
  <AvatarRoot
    @click="editable && handleAvatarClick()"
    :class="cn(avatarVariant({ size, shape }), props.class)"
  >
    <AvatarImage v-if="url" :src="url || ''"></AvatarImage>
    <AvatarFallback>{{ shortName }}</AvatarFallback>
  </AvatarRoot>
  <input v-if="editable" type="file" ref="fileInput" class="hidden" @change="handleUpload" />
</template>
