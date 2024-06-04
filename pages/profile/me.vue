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
  <div class="flex flex-col space-y-4">
    <Alert>
      <Icon name="lucide:info" />
      <AlertTitle>Cette page est modifiable !</AlertTitle>
      <AlertDescription>
        Ici, vous êtes chez vous. Vous êtes libre de modifier un quelconque élément sur la page afin
        que votre profil reflète réellement qui vous êtes.
      </AlertDescription>
    </Alert>
    <div class="space-y flex flex-row items-center space-x-4">
      <ProfileAvatar v-if="profile" :profile="profile" size="base" />
      <h
        class="w-full rounded px-2 py-4 text-4xl font-extrabold tracking-tight transition-colors hover:bg-accent focus:bg-accent focus:outline-none lg:text-5xl"
        contenteditable="true"
      >
        {{ profile?.full_name }}
      </h>
    </div>
    <div class="flex flex-col space-y-2">
      <div class="flex flex-row items-center space-x-2">
        <Icon name="lucide:mail" class="h-6 w-6" />
        <p
          class="h-10 w-full rounded px-2 py-2.5 text-sm font-medium transition-colors hover:bg-accent focus:bg-accent focus:outline-none"
          contenteditable="true"
        >
          john.doe@gmail.com
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost">
              <Icon name="lucide:eye" class="mr-2" />
              Public
              <Icon name="lucide:chevron-down" class="ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup model-value="public">
              <DropdownMenuRadioItem value="public">Public</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="private">Privée</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="mentoring">Mentorés uniquement</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <p
      class="rounded px-2 py-2 transition-colors hover:bg-accent focus:bg-accent focus:outline-none"
      contenteditable="true"
    >
      {{ profile?.about_me || "Je n'ai pas encore défini de description." }}
    </p>
  </div>
</template>
