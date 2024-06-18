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
const route = useRoute()
const { data: programWithLocation, refresh } = await useAsyncData(
  `program/${route.params.id ?? ''}`,
  async () => {
    const program = await supabase
      .from('program')
      .select()
      .eq('id', route.params.id ?? '')
      .single()
    if (program.error) throw program.error

    const location = await supabase.rpc('get_latitude_longitude', {
      location: program.data.location,
    })
    if (location.error) throw program.error

    return { program: program.data, location: location.data }
  },
)
const program = computed(() => programWithLocation.value?.program)
const location = computed(() => programWithLocation.value?.location)
const canEdit = computed(
  () => (program.value && user.value && program.value.owner === user.value.id) || false,
)
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(3, {
      message: 'Merci de reseigner un nom à votre offre.',
    }),
    description: z.string().min(3, {
      message: 'Merci de reseigner un description à votre offre.',
    }),
    location: z
      .object({
        type: z.enum(['Point']),
        coordinates: z.array(z.number()),
      })
      .nullable(),
  }),
)
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: program.value?.name,
    description: program.value?.description || undefined,
    location: location.value
      ? {
          type: 'Point',
          coordinates: location.value,
        }
      : undefined,
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
          const { location, ...values } = form.values
          const { error } = await supabase
            .from('program')
            .upsert({
              id: program.value!.id,
              owner: program.value!.owner,
              price: program.value!.price,
              location:
                location && `POINT(${location.coordinates![1]} ${location.coordinates![0]})`,
              ...values,
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
    <Alert v-if="canEdit">
      <Icon name="lucide:info" />
      <AlertTitle>Cette page est modifiable !</AlertTitle>
      <AlertDescription>
        Ici, vous êtes chez vous. Vous êtes libre de modifier un quelconque élément sur la page afin
        que votre profil reflète réellement qui vous êtes.
      </AlertDescription>
    </Alert>
    <div class="space-y flex flex-row items-center space-x-4">
      <FormField v-slot="{ componentField }" name="name">
        <div class="flex w-full flex-col">
          <FormControl>
            <H1 class="w-full" :editable="canEdit" v-bind="componentField">
              {{ program?.name }}
            </H1>
            <FormMessage />
          </FormControl>
        </div>
      </FormField>
    </div>
    <div class="flex flex-col space-y-2">
      <div class="ml-2 flex flex-row items-center space-x-2">
        <Icon name="lucide:map-pinned" class="h-6 w-6" />
        <FormField v-slot="{ componentField }" name="location">
          <div class="flex w-full flex-col">
            <FormControl>
              <MapInput map-class="w-full h-32" :editable="canEdit" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </div>
        </FormField>
      </div>
    </div>
    <FormField v-slot="{ componentField }" name="description">
      <P class="w-full" :editable="canEdit" multiline v-bind="componentField">
        {{
          program?.description || 'Ce programme de mentorat ne possède pas encore de description.'
        }}
      </P>
    </FormField>
    <MapPin class="h-40 !rounded-lg" :center="form.values.location?.coordinates" />
  </form>
</template>
