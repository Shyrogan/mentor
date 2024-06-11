<script setup lang="ts">
import type { Database } from '~/lib/schema'

const user = useSupabaseUser()
const supabase = useSupabaseClient<Database>()
async function createProgram() {
  if (!user.value) return
  const { error, data } = await supabase
    .from('program')
    .insert({
      id: self.crypto.randomUUID(),
      owner: user.value?.id,
      price: 5,
    })
    .select()
    .single()
  if (error) {
    console.error(error)
    return
  }
  navigateTo('/program/' + data?.id)
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger>
      <slot />
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Vous vous allez créer un programme de mentorat.</AlertDialogTitle>
        <AlertDialogDescription>
          Une fois votre offre créée, il est probable qu'un administrateur MentorAg consulte votre
          profil afin de s'assurer qu'il ne s'agisse pas d'une fausse offre. Ainsi, il est possible
          que l'on vous contacte par mail ou par téléphone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Je refuse</AlertDialogCancel>
        <AlertDialogAction @click="createProgram">Ok !</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
