<script setup>
import { computed, ref, watch } from 'vue'
import iso from 'i18n-iso-countries'
import spanish from 'i18n-iso-countries/langs/es.json'
import CurrencyDialog from '@/components/currency/CurrencyDialog.vue'
import { countriesApi, getObjects, getErrorMessage } from '@/boot/axios'
import { useRoute } from 'vue-router'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'

iso.registerLocale(spanish)

const route = useRoute()
const codigo = computed(() => route.params.code)
const country = ref(null)
const loading = ref(true)
const error = ref('')
const selectedCurrency = ref(null)
const currencyOpen = ref(false)
const attempt = ref(0)
const number = new Intl.NumberFormat('es-PE')
const countryName = computed(
  () => country.value?.names?.translations?.spa?.common || country.value?.names?.common,
)
const facts = computed(() => {
  const c = country.value
  return [
    ['Población', c.population != null && number.format(c.population)],
    ['Área', c.area?.kilometers != null && number.format(c.area.kilometers) + ' km²'],
    ['Idiomas', c.languages?.map((lang) => lang.native_name || lang.name).join(', ')],
    ['Zona horaria', c.timezones?.join(', ')],
    [
      'Código telefónico',
      c.calling_codes?.map((code) => '+' + String(code).replace(/^\+/, '')).join(', '),
    ],
    ['Dominio', c.tlds?.join(', ')],
    ['Lado de conducción', { left: 'Izquierda', right: 'Derecha' }[c.cars?.driving_side]],
  ]
})

function openCurrency(currency) {
  selectedCurrency.value = currency
  currencyOpen.value = true
}

watch(
  [codigo, attempt],
  async ([code], _, onCleanup) => {
    const controller = new AbortController()
    onCleanup(() => controller.abort())
    currencyOpen.value = false
    loading.value = true
    error.value = ''
    try {
      if (!/^[a-z]{2}$/i.test(code)) throw new Error('El código de país debe tener dos letras.')
      const response = await countriesApi.get('/codes.alpha_2/' + code.toUpperCase(), {
        signal: controller.signal,
      })
      if (controller.signal.aborted) return
      const [detail] = getObjects(response)
      if (!detail) throw new Error('No se encontró el país.')
      country.value = detail
    } catch (e) {
      if (!controller.signal.aborted)
        error.value = e.isAxiosError ? getErrorMessage(e, 'No se pudo cargar el país.') : e.message
    } finally {
      if (!controller.signal.aborted) loading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <q-page class="detail q-pa-md q-py-lg">
    <LoadingState v-if="loading" message="Cargando país…" />
    <ErrorState v-else-if="error" :message="error" @retry="attempt++" />
    <article v-else-if="country">
      <div class="hero">
        <img
          :src="'https://flagcdn.com/w320/' + codigo.toLowerCase() + '.png'"
          :alt="'Bandera de ' + countryName"
        />
        <div>
          <div>{{ country.continents?.join(' · ') || country.region }}</div>
          <h1>{{ countryName }}</h1>
          <div class="text-h6">
            Capital · {{ country.capitals?.map((item) => item.name).join(', ') || 'Sin datos' }}
          </div>
        </div>
      </div>
      <q-card flat bordered class="q-pa-lg">
        <dl class="facts">
          <div v-for="[label, value] in facts" :key="label">
            <dt>{{ label }}</dt>
            <dd>{{ value || 'Sin datos' }}</dd>
          </div>
        </dl>
        <q-separator />
        <h2>Países fronterizos</h2>
        <p>
          {{
            country.borders?.map((code) => iso.getName(code, 'es') || code).join(', ') ||
            'Sin fronteras terrestres'
          }}
        </p>
        <h2>Moneda</h2>
        <q-btn
          v-for="currency in country.currencies"
          :key="currency.code"
          outline
          rounded
          no-caps
          color="teal-9"
          class="q-mr-sm q-mb-xs"
          :label="currency.name + ' · ' + currency.code"
          @click="openCurrency(currency)"
        />
        <p v-if="!country.currencies?.length">Sin datos</p>
      </q-card>
      <CurrencyDialog v-model="currencyOpen" :currency="selectedCurrency" />
    </article>
  </q-page>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 1rem 0 2rem;
}
.hero img {
  width: min(100%, 320px);
  height: auto;
  border: 1px solid #d2dad7;
}
h1 {
  font-size: clamp(2.4rem, 6vw, 4rem);
  line-height: 1.1;
  margin: 0.4rem 0 0.8rem;
  letter-spacing: -0.035em;
}
h2 {
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 1.2rem 0 0.5rem;
}
.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: 1.5rem;
  margin: 0 0 1.5rem;
}
dt {
  color: #506960;
}
dd {
  margin: 0.25rem 0 0;
  font-size: 1.1rem;
}
</style>
