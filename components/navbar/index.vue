<script setup lang="ts">
import type { Database } from '~/lib/schema'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { data: profile } = await useAsyncData('profile', async () => {
  if (!user) return undefined
  const result = await supabase
    .from('profiles')
    .select()
    .eq('id', user.value?.id ?? '')
    .single()
  if (result.error) throw result.error
  return result.data
})
</script>

<template>
  <nav class="flex w-screen flex-row items-center justify-between px-10 py-5 align-middle">
    <NuxtLink to="/">
      <Logo class="h-10" />
    </NuxtLink>
    <NavbarMenu class="space-x-2">
      <NavbarMenuItem title="Programmes de mentorat">
        <div class="grid w-[40rem] grid-cols-2 p-4">
          <NavbarMenuCard title="Consulter l'annuaire des offres" to="/offer/list">
            Vous êtes à la recherche d'un peu d'aide ? L'annuaire vous permez de trouver ce dont
            vous avez besoin
          </NavbarMenuCard>
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
    <NuxtLink v-if="!user" to="/sign-in">
      <Button>
        <Icon name="lucide:scan-face" class="mr-2 h-6 w-6" /> Rejoindre la communauté
      </Button>
    </NuxtLink>
    <NuxtLink v-else>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button v-if="profile" variant="ghost">
            <ProfileAvatar :profile="profile" class="mr-2" size="xs" />
            {{ profile.full_name }}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-48">
          <DropdownMenuGroup>
            <NuxtLink to="/profile/me">
              <DropdownMenuItem>
                <Icon name="lucide:user" class="mr-2" /> Mon profil
              </DropdownMenuItem>
            </NuxtLink>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem class="text-destructive" @click="supabase.auth.signOut()">
              <Icon name="lucide:log-out" class="mr-2" /> Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </NuxtLink>
  </nav>
</template>
