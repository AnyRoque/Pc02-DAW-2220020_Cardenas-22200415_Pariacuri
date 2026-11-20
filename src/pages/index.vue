<template>
  <q-page class="q-pa-md q-pa-lg-xl">
    <div class="q-mb-lg">
      <div class="text-h4">Explorador de países</div>
      <div class="text-subtitle1 text-grey-7">
        Busca por capital, filtra por continente y consulta el tipo de cambio
      </div>
    </div>

    <CountryFilter v-model="filters" class="q-mb-md" />

    <div v-if="!store.loading && !store.errorMessage" class="text-caption text-grey-7 q-mb-sm">
      {{ store.countries.length }} país(es) encontrados
    </div>

    <LoadingState v-if="store.loading" message="Cargando países..." />
    <ErrorState
      v-else-if="store.errorMessage"
      :message="store.errorMessage"
      @retry="loadCountries"
    />
    <CountryList
      v-else
      :countries="store.countries"
      @select="openCountry"
      @currency="openCurrency"
    />

    <CurrencyDialog v-model="currencyOpen" :currency="selectedCurrency" />
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCountriesStore } from '@/stores/countries-store'
import CountryFilter from '@/components/countries/CountryFilter.vue'
import CountryList from '@/components/countries/CountryList.vue'
import CurrencyDialog from '@/components/currency/CurrencyDialog.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'

const store = useCountriesStore()
const router = useRouter()

const filters = ref({ capital: null, region: null })
const currencyOpen = ref(false)
const selectedCurrency = ref(null)

// Capital -> /capitals?q= | Continente -> /region/{continente} | Nada -> listado inicial
function loadCountries() {
  const capital = filters.value.capital?.trim()
  const region = filters.value.region

  if (capital) return store.searchByCapital(capital, region)
  if (region) return store.fetchByRegion(region)
  return store.fetchCountries()
}

function openCountry(code) {
  router.push(`/pais/${code.toLowerCase()}`)
}

function openCurrency(currency) {
  selectedCurrency.value = currency
  currencyOpen.value = true
}

watch(filters, loadCountries)

onMounted(() => {
  if (!store.countries.length) loadCountries()
})
</script>
