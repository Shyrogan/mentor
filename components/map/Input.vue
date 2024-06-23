<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '~/lib/utils'
import type { Feature, FeatureCollection, Point } from 'geojson'

const props = defineProps<{
  class?: HTMLAttributes['class']
  mapClass?: HTMLAttributes['class']
  inputClass?: HTMLAttributes['class']
  modelValue?: Point | undefined
  editable?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: undefined | Point): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: undefined,
})

const { findFeaturesByName, findNameByCoordinates, featureToName } = useNuxtApp().$proton
const {
  data: name,
  error: nameError,
  refresh: refreshName,
} = useAsyncData(`POINTNAME[${modelValue.value?.coordinates}]`, async () => {
  if (!modelValue.value) return ''
  return await findNameByCoordinates(
    modelValue.value.coordinates[0],
    modelValue.value.coordinates[1],
  )
})

const results = ref<FeatureCollection<Point>>()
async function research(input: string) {
  try {
    results.value = await findFeaturesByName(input)
  } catch (e: unknown) {}
}
</script>

<template>
  <Popover v-if="editable">
    <PopoverTrigger as-child>
      <P class="text-left" editable :model-value="name ?? ''" />
    </PopoverTrigger>
    <PopoverContent class="p-0">
      <Command @update:search-term="research">
        <CommandInput class="h-9" placeholder="Rechercher un lieu-dit..." />
        <CommandEmpty class="font-medium">
          Nous n'avons pas trouvé le lieu-dit indiqué...
        </CommandEmpty>
        <CommandList>
          <CommandItem
            v-for="feature in results?.features"
            :key="featureToName(feature)"
            :value="featureToName(feature)"
            @select="
              () => {
                modelValue = feature.geometry
                emits('update:modelValue', feature.geometry)
                refreshName()
              }
            "
          >
            {{ featureToName(feature) }}
          </CommandItem>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
  <P v-else class="text-left">{{ name }}</P>
</template>
