<script setup lang="ts">
import type { Database } from '~/lib/schema'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { data: profile } = await useAsyncData('profile', async () => {
  if (!user) return undefined
  const result = await supabase
    .from('profile')
    .select()
    .eq('id', user.value?.id ?? '')
    .single()
  if (result.error) throw result.error
  return result.data
})
</script>

<template>
  <nav class="flex w-screen flex-row items-center justify-between px-10 py-5 align-middle">
    <NuxtLink to="/" class="w-64">
      <Logo class="h-10" />
    </NuxtLink>
    <NavbarMenu class="space-x-2">
      <NavbarMenuItem title="Programmes de mentorat">
        <div class="grid w-[42rem] grid-cols-2 p-4">
          <NavbarMenuCard
            icon="lucide:book-open-text"
            title="Consulter le registre des programmes"
            to="/program"
          >
            Vous êtes à la recherche d'un peu d'aide ? Vous souhaitez être mentoré ? Consultez notre
            registre !
          </NavbarMenuCard>
          <ProgramAlertDialogCreate>
            <NavbarMenuCard icon="lucide:file-plus" title="Créer un programme de mentorat" to="#">
              Vous souhaitez être apprendre aux autres en faisant de votre expérience une source de
              revenue ? C'est ici que ça se passe !
            </NavbarMenuCard>
          </ProgramAlertDialogCreate>
        </div>
      </NavbarMenuItem>
      <NavbarMenuItem title="Groupes de discussion">
        <div class="grid w-[40rem] grid-cols-2 p-4">
          <NavbarMenuCard title="Comprendre les groupes de discussions" to="/">
            Pas facile au premier abord, pas vrai ? Pas de soucis, on est là pour vous aider.
          </NavbarMenuCard>
        </div>
      </NavbarMenuItem>
    </NavbarMenu>
    <div class="flex w-64 flex-row space-x-2">
      <Button v-if="user" variant="ghost" class="px-2">
        <Icon name="lucide:bell" class="h-4 w-4" />
      </Button>
      <Button v-if="user" variant="ghost" class="px-2">
        <Icon name="lucide:message-circle" class="h-4 w-4" />
      </Button>
      <Button v-if="!user || !profile" as-child>
        <NuxtLink to="/sign-in">
          <Icon name="lucide:scan-face" class="mr-2 h-6 w-6" /> Rejoindre la communauté
        </NuxtLink>
      </Button>
      <DropdownMenu v-else>
        <DropdownMenuTrigger as-child>
          <Button v-if="profile" variant="ghost">
            <ProfileAvatar :profile="profile" class="mr-2" size="xs" />
            {{ profile.full_name }}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem as-child>
              <NuxtLink :to="`/profile/${user.id}`">
                <Icon name="lucide:user" class="mr-2" /> Mon profil
              </NuxtLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem class="text-destructive" @click="supabase.auth.signOut()">
              <Icon name="lucide:log-out" class="mr-2" /> Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </nav>
</template>
