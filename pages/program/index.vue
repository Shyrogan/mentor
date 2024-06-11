<script setup lang="ts">
import type { Database } from '~/lib/schema'

const supabase = useSupabaseClient<Database>()
const { data, error, refresh } = useAsyncData('programs', async () => {
  const { data, error } = await supabase.from('program').select('*, profile(*)').limit(10)
  if (error) throw error
  return data
})
</script>

<template>
  <div class="flex w-full flex-row space-x-4">
    <ProgramRegistryCard v-if="data" v-for="program in data" :program="program" />
  </div>
</template>
