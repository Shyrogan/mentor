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
    firstName: z.string().min(2),
    lastName: z.string().min(2),
  }),
)
const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (credentials) => {
  const supabase = useSupabaseClient<Database>()
  const { error } = await supabase.auth.signUp({
    ...credentials,
    options: {
      data: {
        full_name: `${credentials.firstName} ${credentials.lastName}`,
        avatar_url: '',
      },
    },
  })
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
    <CardTitle>Inscription</CardTitle>
    <CardDescription>
      Vous ne souhaitez pas passer par un réseau social ? Pas de soucis ! Nous vous proposons de
      vous inscrire directement au sein de la plateforme. Cependant ne perdez pas votre mot de passe
      !
    </CardDescription>
  </CardHeader>
  <form @submit="onSubmit">
    <CardContent class="space-y-2">
      <div class="flex space-x-2">
        <div class="flex flex-col space-y-2">
          <FormField class="flex flex-col" v-slot="{ componentField }" name="lastName">
            <FormLabel>Nom</FormLabel>
            <FormControl>
              <Input id="last_name" type="last_name" placeholder="DOE" v-bind="componentField" />
            </FormControl>
          </FormField>
        </div>
        <div class="flex flex-col space-y-2">
          <FormField v-slot="{ componentField }" name="firstName">
            <FormLabel>Prénom</FormLabel>
            <FormMessage />
            <FormControl>
              <Input id="first_name" type="first_name" placeholder="John" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormField>
        </div>
      </div>
      <FormField v-slot="{ componentField }" name="email">
        <FormLabel>Adresse e-mail</FormLabel>
        <FormControl>
          <Input id="email" type="email" placeholder="john.doe@gmail.com" v-bind="componentField" />
        </FormControl>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormLabel>Mot de passe</FormLabel>
        <FormControl>
          <Input id="password" type="password" v-bind="componentField" />
        </FormControl>
      </FormField>
    </CardContent>
    <CardFooter class="flex-col space-y-2">
      <Button type="submit" class="w-full">S'inscrire</Button>
      <Button variant="link" class="whitespace-normal" as-child>
        <NuxtLink to="/sign-in">J'ai changé d'avis et je souhaite me connecter </NuxtLink>
      </Button>
    </CardFooter>
  </form>
</template>
