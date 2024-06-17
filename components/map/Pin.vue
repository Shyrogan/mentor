<script setup lang="ts">
import type { Position } from 'geojson'
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  center?: Position
}>()
</script>

<template>
  <MapboxMap
    mapId="map-pin"
    v-if="center"
    :options="{
      center: center,
      projection: {
        name: 'mercator',
      },
      dragPan: false,
      attributionControl: false,
      scrollZoom: { around: 'center' },
      touchZoomRotate: { around: 'center' },
      zoom: 10.0,
    }"
    :class="cn('!top-none !relative', props.class)"
  >
  </MapboxMap>
</template>
