import type { Feature, FeatureCollection, Point } from 'geojson'

export default defineNuxtPlugin({
  name: 'photon',
  setup() {
    async function findFeaturesByName(name: string): Promise<FeatureCollection<Point>> {
      return new Promise(async (resolve, reject) => {
        try {
          const result = await $fetch<GeoJSON.FeatureCollection<Point>>(
            `https://photon.komoot.io/api/?q=${name}`,
            {
              method: 'GET',
            },
          )
          const filteredFeatures = result.features
            .filter((f) => f.geometry.type === 'Point')
            .filter(
              (f) =>
                f.properties &&
                f.properties.osm_key === 'place' &&
                (f.properties.county || f.properties.state) &&
                f.properties.name &&
                f.properties.country,
            )
          resolve({
            type: 'FeatureCollection',
            features: filteredFeatures,
          })
        } catch (e: any) {
          reject(e)
        }
      })
    }

    async function findNameByCoordinates(lon: number, lat: number): Promise<string> {
      return new Promise(async (resolve, reject) => {
        try {
          const result = await $fetch<GeoJSON.FeatureCollection>(
            `https://photon.komoot.io/reverse?lon=${lon}&lat=${lat}`,
            {
              method: 'GET',
            },
          )
          const filteredFeatures = result.features
            .filter(
              (f) =>
                f.properties &&
                f.properties.osm_key === 'place' &&
                (f.properties.county || f.properties.state) &&
                f.properties.name &&
                f.properties.country,
            )
            .map((f) => f as Feature<Point>)
          if (filteredFeatures.length === 0) {
            reject('not found')
          }
          const f = filteredFeatures.at(0)!
          resolve(featureToName(f))
        } catch (e: any) {
          reject(e)
        }
      })
    }

    function featureToName(f: Feature<Point>) {
      return !f.properties
        ? ''
        : `${f.properties.name}, ${f.properties.county ?? f.properties.state}, ${f.properties.country}`
    }

    return {
      provide: {
        proton: {
          findFeaturesByName,
          findNameByCoordinates,
          featureToName,
        },
      },
    }
  },
})
