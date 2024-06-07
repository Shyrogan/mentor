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
  const result = await supabase.from('profiles').select().eq('id', route.params.id).single()
  if (result.error) throw result.error
  return result.data
})
</script>

<template>
  <div class="flex flex-col space-y-4">
    <div class="space-y flex flex-row items-center space-x-4">
      <ProfileAvatar v-if="profile" :profile="profile" size="base" />
      <H1 class="w-full">{{ profile?.full_name }}</H1>
    </div>
    <div class="flex flex-col space-y-2">
      <div class="flex flex-row items-center space-x-2">
        <Icon name="lucide:mail" class="h-6 w-6" />
        <P class="w-full"> john.doe@gmail.com </P>
      </div>
    </div>
    <H3>À propos de moi</H3>
    <P class="w-full">
      {{ profile?.about_me || 'Pas de description défini pour le moment. Bientôt peut-être :)' }}
    </P>
    <P class="font-normal text-muted-foreground">
      Aucune d'offre de mentorat proposé pour le moment.
    </P>
    <H3>Groupes de discussions</H3>
    <P class="font-normal text-muted-foreground">
      Aucune activité dans des groupes de discussion pour le moment.
    </P>
  </div>
</template>
