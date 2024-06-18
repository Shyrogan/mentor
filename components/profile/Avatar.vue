<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AvatarRoot } from 'radix-vue'
import { type AvatarVariants, avatarVariant } from '../ui/avatar'
import { cn } from '@/lib/utils'
import type { Database } from '~/lib/schema'

const supabase = useSupabaseClient<Database>()
const props = withDefaults(
  defineProps<{
    profile: Database['public']['Tables']['profile']['Row']
    class?: HTMLAttributes['class']
    size?: AvatarVariants['size']
    shape?: AvatarVariants['shape']
    editable?: boolean
    refresh?: () => Promise<void>
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
    const { data } = supabase.storage.from('avatars').getPublicUrl(storageFile.path)
    const { error } = await supabase
      .from('profile')
      .upsert({ id: props.profile.id, avatar_url: data.publicUrl })
    if (error) {
      console.error(error)
      return
    }
    if (props.refresh) props.refresh()
  }
}
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <AvatarRoot
          @click="editable && handleAvatarClick()"
          :class="cn(avatarVariant({ size, shape }), props.class)"
        >
          <AvatarImage v-if="profile.avatar_url" :src="profile.avatar_url"></AvatarImage>
          <AvatarFallback>{{ shortName }}</AvatarFallback>
        </AvatarRoot>
      </TooltipTrigger>
      <TooltipContent v-if="editable" class="font-medium">
        Vous souhaitez modifier votre photo de profile ? Cliquez dessus !
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  <input v-if="editable" type="file" ref="fileInput" class="hidden" @change="handleUpload" />
</template>
