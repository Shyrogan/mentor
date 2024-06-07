<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { useToast } from '~/components/ui/toast'
import type { Database } from '~/lib/schema'

definePageMeta({
  layout: 'auth',
})

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
)
const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (credentials) => {
  const supabase = useSupabaseClient<Database>()
  const { error } = await supabase.auth.signInWithPassword(credentials)
  if (error) {
    const toaster = useToast()
    toaster.toast({
      title: 'Une erreur est survenue !',
      description: JSON.stringify({
        code: error.code,
        message: error.message,
      }),
    })
    return
  }
  navigateTo('/')
})
</script>

<template>
  <CardHeader>
    <CardTitle>Connexion</CardTitle>
    <CardDescription>
      Connectez-vous directement à l'aide de votre réseau social favoris ou encore avec un e-mail et
      un mot de passe.
    </CardDescription>
  </CardHeader>
  <form @submit="onSubmit">
    <CardContent class="space-y-4">
      <div class="flex flex-col space-y-2">
        <Button variant="outline" class="w-full">
          <Icon name="lucide:facebook" class="mr-2 h-4 w-4" /> Connexion avec Facebook
        </Button>
        <Button variant="outline" class="w-full">
          <Icon name="uil:google" class="mr-2 h-4 w-4" /> Connexion avec Google
        </Button>
      </div>
      <Separator />
      <div class="flex flex-col space-y-2">
        <FormField v-slot="{ componentField }" name="email">
          <FormLabel>Adresse e-mail</FormLabel>
          <FormMessage />
          <FormControl>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@gmail.com"
              v-bind="componentField"
            />
          </FormControl>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormLabel>Mot de passe</FormLabel>
          <FormMessage />
          <FormControl>
            <Input id="password" type="password" v-bind="componentField" />
          </FormControl>
        </FormField>
      </div>
    </CardContent>
    <CardFooter class="flex-col space-y-2">
      <Button type="submit" class="w-full">Se connecter</Button>

      <Button variant="link" class="whitespace-normal" as-child>
        <NuxtLink to="/sign-up">
          Vous n'utilisez pas ces réseaux sociaux et ne possédez pas de compte ? Inscrivez-vous
          !</NuxtLink
        >
      </Button>
    </CardFooter>
  </form>
</template>
