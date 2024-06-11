<script setup lang="ts">
import type { Database } from '~/lib/schema'

const route = useRoute()
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
if (user.value && route.params.id === user.value.id) {
  //navigateTo('/')
}
const { data: profile } = await useAsyncData(`profile/${route.params.id}`, async () => {
  if (!user) return undefined
  const result = await supabase.from('profile').select().eq('id', route.params.id).single()
  if (result.error) throw result.error
  return result.data
})
</script>

<template>
  <div class="flex flex-col space-y-4">
    <div class="space-y flex flex-row items-center space-x-4">
      <ProfileAvatar v-if="profile" :profile="profile" size="base" />
      <H1 class="w-full">{{ profile?.full_name }}</H1>
      <Button variant="secondary">
        <Icon name="lucide:message-circle-plus" class="mr-2 h-4 w-4" />
        Démarrer une discussion
      </Button>
    </div>
    <div class="flex flex-col space-y-2">
      <div class="ml-2 flex flex-row items-center space-x-2">
        <Icon name="lucide:mail" class="h-5 w-5" />
        <P class="w-full">{{ profile?.email }}</P>
      </div>
      <div class="ml-2 flex h-10 flex-row items-center space-x-2">
        <Icon name="lucide:phone" class="h-5 w-5" />
        <P class="w-full">{{ profile?.phone_number }}</P>
      </div>
    </div>
    <P class="w-full" multiline>{{ profile?.about_me }}</P>
  </div>
</template>
