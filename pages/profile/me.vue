<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { sonner } from '~/components/ui/sonner'
import { useToast } from '~/components/ui/toast'
import type { Database } from '~/lib/schema'

definePageMeta({
  middleware: 'require-auth',
})

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { data: profile, refresh } = await useAsyncData(
  `profile/${user.value?.id ?? ''}`,
  async () => {
    if (!user) return undefined
    const result = await supabase
      .from('profile')
      .select()
      .eq('id', user.value?.id ?? '')
      .single()
    if (result.error) throw result.error
    return result.data
  },
)

const formSchema = toTypedSchema(
  z.object({
    full_name: z.string().regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]{2,} [A-Za-zÀ-ÖØ-öø-ÿ]{2,}$/, {
      message: 'Merci de reseigner un nom complet.',
    }),
    email: z.string().email(),
    email_visibility: z.enum(['public', 'private', 'mentored']),
    phone_number: z.string(),
    phone_number_visibility: z.enum(['public', 'private', 'mentored']),
  }),
)
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    full_name: profile.value?.full_name ?? undefined,
    email: profile.value?.email,
    email_visibility: profile.value?.email_visibility ?? undefined,
    phone_number: profile.value?.phone_number ?? undefined,
    phone_number_visibility: profile.value?.phone_number_visibility ?? undefined,
  },
})

watch(
  form.controlledValues,
  () => {
    if (!form.meta.value.dirty) return
    sonner('Ceci est un brouillon.', {
      id: 'brouillon',
      description: "Les changements que vous venez de faire n'ont pas été enregistrés.",
      action: {
        label: 'Enregister',
        onClick: async () => {
          if (!(await form.validate())) return
          const { error } = await supabase
            .from('profile')
            .upsert({
              id: profile.value!.id,
              ...form.values,
            })
            .single()
          if (error) {
            const toast = useToast()
            toast.toast({
              title: 'Une erreur est survenue',
              description: JSON.stringify({ message: error.message, code: error.code }),
            })
          }
          refresh()
        },
      },
      duration: 100000,
    })
  },
  { immediate: false },
)
</script>

<template>
  <form class="flex flex-col space-y-4">
    <Alert>
      <Icon name="lucide:info" />
      <AlertTitle>Cette page est modifiable !</AlertTitle>
      <AlertDescription>
        Ici, vous êtes chez vous. Vous êtes libre de modifier un quelconque élément sur la page afin
        que votre profil reflète réellement qui vous êtes.
      </AlertDescription>
    </Alert>
    <div class="space-y flex flex-row items-center space-x-4">
      <ProfileAvatar editable v-if="profile" :profile="profile" size="base" />
      <FormField v-slot="{ componentField }" name="full_name">
        <div class="flex w-full flex-col">
          <FormControl>
            <H1 class="w-full" v-bind="componentField" editable />
          </FormControl>
          <FormMessage />
        </div>
      </FormField>
    </div>
    <div class="flex flex-col space-y-2">
      <div class="ml-2 flex flex-row items-center space-x-2">
        <Icon name="lucide:mail" class="h-6 w-6" />
        <FormField v-slot="{ componentField }" name="email">
          <div class="flex w-full flex-col">
            <FormControl>
              <P class="w-full" v-bind="componentField" editable />
            </FormControl>
            <FormMessage />
          </div>
        </FormField>
        <FormField v-slot="{ componentField }" name="email_visibility">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost">
                <Icon name="lucide:eye" class="mr-2" />
                Visibilité
                <Icon name="lucide:chevron-down" class="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup v-bind="componentField">
                <DropdownMenuRadioItem value="public">Public</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="private">Privée</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="mentored">Mentorés uniquement</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </FormField>
      </div>
      <div class="ml-2 flex flex-row items-center space-x-2">
        <Icon name="lucide:phone" class="h-6 w-6" />
        <FormField v-slot="{ componentField }" name="phone_number">
          <div class="flex w-full flex-col">
            <FormControl>
              <P class="w-full" v-bind="componentField" editable />
            </FormControl>
            <FormMessage />
          </div>
        </FormField>
        <FormField v-slot="{ componentField }" name="phone_number_visibility">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost">
                <Icon name="lucide:eye" class="mr-2" />
                Visibilité
                <Icon name="lucide:chevron-down" class="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup v-bind="componentField">
                <DropdownMenuRadioItem value="public">Public</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="private">Privée</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="mentored">Mentorés uniquement</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </FormField>
      </div>
    </div>
    <FormField v-slot="{ componentField }" name="about_me">
      <P class="w-full" editable multiline v-bind="componentField">
        {{ profile?.about_me || "Je n'ai pas encore défini de description." }}
      </P>
    </FormField>
  </form>
</template>
