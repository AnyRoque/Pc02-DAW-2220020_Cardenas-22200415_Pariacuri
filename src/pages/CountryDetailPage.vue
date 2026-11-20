<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import iso from 'i18n-iso-countries'
import spanish from 'i18n-iso-countries/langs/es.json'
import CurrencyDialog from '../components/currencies/CurrencyDialog.vue'
import { getCountry } from '../services/restCountries'

iso.registerLocale(spanish)
const props = defineProps({ codigo: { type: String, required: true } })
const country = ref(null)
const loading = ref(true)
const error = ref('')
const selectedCurrency = ref(null)
const controller = new AbortController()
const number = new Intl.NumberFormat('es-PE')
const countryName = computed(() => country.value?.names?.translations?.spa?.common || country.value?.names?.common)
const facts = computed(() => {
  const c = country.value
  return [
    ['Población', c.population != null && number.format(c.population)],
    ['Área', c.area?.kilometers != null && number.format(c.area.kilometers) + ' km²'],
    ['Idiomas', c.languages?.map(lang => lang.native_name || lang.name).join(', ')],
    ['Zona horaria', c.timezones?.join(', ')],
    ['Código telefónico', c.calling_codes?.map(code => '+' + String(code).replace(/^\+/, '')).join(', ')],
    ['Dominio', c.tlds?.join(', ')],
    ['Lado de conducción', { left: 'Izquierda', right: 'Derecha' }[c.cars?.driving_side]],
  ]
})

async function loadCountry() {
  loading.value = true
  error.value = ''
  try {
    country.value = await getCountry(props.codigo, controller.signal)
  } catch (e) {
    if (!controller.signal.aborted) error.value = e.message
  } finally {
    loading.value = false
  }
}
onMounted(loadCountry)
onUnmounted(() => controller.abort())
</script>

<template>
  <q-page class="detail q-pa-md q-py-lg">
    <div v-if="loading" role="status"><q-spinner /> Cargando país…</div>
    <q-banner v-else-if="error" class="bg-white" role="alert">
      {{ error }} <q-btn flat no-caps label="Reintentar" @click="loadCountry" />
    </q-banner>
    <article v-else-if="country">
      <div class="hero">
        <img :src="'https://flagcdn.com/w320/' + codigo.toLowerCase() + '.png'" :alt="'Bandera de ' + countryName">
        <div>
          <div>{{ country.continents?.join(' · ') || country.region }}</div>
          <h1>{{ countryName }}</h1>
          <div class="text-h6">Capital · {{ country.capitals?.map(item => item.name).join(', ') || 'Sin datos' }}</div>
        </div>
      </div>
      <q-card flat bordered class="q-pa-lg">
        <dl class="facts">
          <div v-for="[label, value] in facts" :key="label">
            <dt>{{ label }}</dt><dd>{{ value || 'Sin datos' }}</dd>
          </div>
        </dl>
        <q-separator />
        <h2>Países fronterizos</h2>
        <p>{{ country.borders?.map(code => iso.getName(code, 'es') || code).join(', ') || 'Sin fronteras terrestres' }}</p>
        <h2>Moneda</h2>
        <q-btn v-for="currency in country.currencies" :key="currency.code" outline rounded no-caps
          color="teal-9" class="q-mr-sm q-mb-xs" :label="currency.name + ' · ' + currency.code"
          @click="selectedCurrency = currency" />
        <p v-if="!country.currencies?.length">Sin datos</p>
      </q-card>
      <CurrencyDialog v-if="selectedCurrency" :currency="selectedCurrency" @close="selectedCurrency = null" />
    </article>
  </q-page>
</template>

<style scoped>
.hero { display: flex; align-items: center; flex-wrap: wrap; gap: 2rem; padding: 1rem 0 2rem; }
.hero img { width: min(100%, 320px); height: auto; border: 1px solid #d2dad7; }
h1 { font-size: clamp(2.4rem, 6vw, 4rem); line-height: 1.1; margin: .4rem 0 .8rem; letter-spacing: -.035em; }
h2 { font-size: 1.15rem; font-weight: 600; line-height: 1.4; margin: 1.2rem 0 .5rem; }
.facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 1.5rem; margin: 0 0 1.5rem; }
dt { color: #506960; }
dd { margin: .25rem 0 0; font-size: 1.1rem; }
</style>
