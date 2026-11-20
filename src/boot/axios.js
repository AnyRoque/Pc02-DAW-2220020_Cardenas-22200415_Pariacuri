import { defineBoot } from '#q-app'
import axios from 'axios'

// Cada alumno usa su propia key (restcountries.com/sign-up) en el archivo .env
const API_KEY = import.meta.env.QCLI_RESTCOUNTRIES_KEY || 'rc_live_demo'

const authHeaders = { Authorization: `Bearer ${API_KEY}` }

export const countriesApi = axios.create({
  baseURL: 'https://api.restcountries.com/countries/v5',
  headers: authHeaders,
})

export const currenciesApi = axios.create({
  baseURL: 'https://api.restcountries.com/currencies/v1',
  headers: authHeaders,
})

// La API responde { data: { objects: [...] } } o { errors: [{ message }] }
export function getObjects(response) {
  const objects = response.data?.data?.objects
  return Array.isArray(objects) ? objects : []
}

export function getErrorMessage(error, fallback) {
  const status = error.response?.status
  const apiMessage = error.response?.data?.errors?.[0]?.message

  if (status === 401) return 'API key inválida o ausente. Revisa QCLI_RESTCOUNTRIES_KEY en el .env.'
  if (status === 404) return apiMessage || 'No se encontraron resultados.'
  if (status === 429) return 'Se superó el límite de solicitudes de la API. Intenta más tarde.'
  if (!error.response) return 'No hay conexión con la API. Revisa tu internet.'
  return apiMessage || error.message || fallback
}

export default defineBoot(({ app }) => {
  app.config.globalProperties.$countriesApi = countriesApi
  app.config.globalProperties.$currenciesApi = currenciesApi
})
