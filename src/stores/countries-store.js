import { defineStore } from 'pinia'
import { countriesApi, getObjects, getErrorMessage } from '@/boot/axios'

// Campos que usa la tarjeta del listado (reduce el tamaño de la respuesta)
const LIST_FIELDS = 'names.common,codes.alpha_2,codes.alpha_3,capitals,population,region,currencies'
const PAGE_SIZE = 100

export const useCountriesStore = defineStore('countries', {
  state: () => ({
    countries: [],
    loading: false,
    errorMessage: '',


    // alpha_3 -> { name, alpha2 } para mostrar los países fronterizos
    borderIndex: {},
  }),
  actions: {
    // GET /countries/v5 (listado inicial)
    async fetchCountries() {
      await this.runListRequest(async () => {
        const all = await fetchAllPages(LIST_FIELDS)
        this.saveBorderIndex(all)
        return all
      })
    },

    // GET /countries/v5/capitals?q={texto}
    async searchByCapital(text, region = null) {
      await this.runListRequest(async () => {
        const response = await countriesApi.get('/capitals', {
          params: { q: text, limit: PAGE_SIZE, response_fields: LIST_FIELDS },
        })
        const objects = getObjects(response)
        return region ? objects.filter((country) => country.region === region) : objects
      })
    },

    // GET /countries/v5/region/{continente}
    async fetchByRegion(region) {
      await this.runListRequest(async () => {
        const response = await countriesApi.get(`/region/${encodeURIComponent(region)}`, {
          params: { limit: PAGE_SIZE, response_fields: LIST_FIELDS },
        })
        return getObjects(response)
      })
    },

    async runListRequest(request) {
      this.loading = true
      this.errorMessage = ''

      try {
        this.countries = await request()
      } catch (error) {
        // La búsqueda sin coincidencias responde 404: se muestra como lista vacía
        if (error.response?.status === 404) {
          this.countries = []
        } else {
          this.countries = []
          this.errorMessage = getErrorMessage(error, 'No se pudieron cargar los países.')
        }
      } finally {
        this.loading = false
      }
    },

    saveBorderIndex(countries) {
      this.borderIndex = Object.fromEntries(
        countries
          .filter((country) => country.codes?.alpha_3)
          .map((country) => [
            country.codes.alpha_3,
            { name: country.names?.common, alpha2: country.codes.alpha_2 },
          ]),
      )
    },
  },
})

// La API pagina de 100 en 100: se piden páginas hasta que meta.more sea false
async function fetchAllPages(fields) {
  const all = []
  let offset = 0
  let more = true

  while (more) {
    const response = await countriesApi.get('', {
      params: { limit: PAGE_SIZE, offset, response_fields: fields },
    })
    const objects = getObjects(response)
    all.push(...objects)
    more = Boolean(response.data?.data?.meta?.more) && objects.length > 0
    offset += PAGE_SIZE
  }

  return all
}
