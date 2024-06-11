<script setup lang="ts">
import type { Database } from '~/lib/schema'

const props = defineProps<{
  program?: Database['public']['Tables']['program']['Row'] & {
    profile: Database['public']['Tables']['profile']['Row'] | null
  }
}>()
</script>

<template>
  <NuxtLink :to="`/program/${program?.id}`" class="w-1/3">
    <Card>
      <img
        class="h-40 w-full rounded-t object-cover"
        src="https://www.entraid.com/wp-content/uploads/2017/02/agro-mover-BW6A0711.jpg"
      />
      <CardHeader>
        <p class="font-medium leading-5">{{ program?.name }}</p>
        <div class="flex flex-row pt-4">
          <Button variant="outline" size="sm">ACS</Button>
        </div>
      </CardHeader>
      <CardContent>
        <p class="line-clamp-6 text-sm font-medium leading-4">
          {{ program?.description }}
        </p>
      </CardContent>
      <Separator />
      <CardFooter class="space-x-2 pt-6">
        <ProfileAvatar v-if="program && program.profile" :profile="program.profile" />
        <div class="flex flex-col">
          <p class="font-medium leading-5">{{ program?.profile?.full_name || 'Erreur' }}</p>
          <p class="text-sm font-medium leading-none">Saintes, France</p>
        </div>
      </CardFooter>
    </Card>
  </NuxtLink>
</template>
