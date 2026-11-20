<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { convertToUsd, getUsdRate } from '../../services/restCountries'

const props = defineProps({ currency: { type: Object, required: true } })
defineEmits(['close'])
const amount = ref(1)
const rate = ref(null)
const result = ref(null)
const rateError = ref('')
const convertError = ref('')
const converting = ref(false)
const validAmount = computed(() => Number.isFinite(amount.value) && amount.value > 0)
const controller = new AbortController()
const usd = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'USD', currencyDisplay: 'code' })
const rateFormat = new Intl.NumberFormat('es-PE', { maximumSignificantDigits: 7 })

async function loadRate() {
  rateError.value = ''
  try {
    rate.value = await getUsdRate(props.currency.code, controller.signal)
  } catch (e) {
    if (!controller.signal.aborted) rateError.value = e.message
  }
}

async function convert() {
  if (!validAmount.value || converting.value) return
  converting.value = true
  result.value = null
  convertError.value = ''
  try {
    result.value = await convertToUsd(props.currency.code, amount.value, controller.signal)
  } catch (e) {
    if (!controller.signal.aborted) convertError.value = e.message
  } finally {
    converting.value = false
  }
}
watch(amount, () => { result.value = null; convertError.value = '' })
onMounted(loadRate)
onUnmounted(() => controller.abort())
</script>

<template>
  <q-dialog :model-value="true" aria-labelledby="currency-title" @hide="$emit('close')">
    <q-card class="q-pa-lg" style="width: 420px; max-width: 92vw">
      <h2 id="currency-title" class="text-h5 q-my-none">{{ currency.name }}</h2>
      <p class="text-grey-8">{{ currency.code }} · {{ currency.symbol || 'Sin símbolo' }}</p>
      <div aria-live="polite" class="q-mb-md">
        <template v-if="rateError">{{ rateError }} <q-btn flat no-caps label="Reintentar tasa" @click="loadRate" /></template>
        <strong v-else-if="rate !== null">1 {{ currency.code }} = {{ rateFormat.format(rate) }} USD</strong>
        <span v-else><q-spinner /> Consultando tasa…</span>
      </div>
      <form @submit.prevent="convert">
        <q-input v-model.number="amount" outlined type="number" min="0" step="any" :readonly="converting"
          :label="'Monto en ' + currency.code" />
        <q-btn type="submit" no-caps unelevated color="teal-9" class="q-mt-md" label="Convertir a USD"
          :loading="converting" :disable="!validAmount" />
      </form>
      <p v-if="convertError" role="alert" class="q-mt-md text-negative">{{ convertError }}</p>
      <p v-if="result !== null" role="status" class="q-mt-md text-h6">{{ usd.format(result) }}</p>
      <q-card-actions align="right"><q-btn v-close-popup flat no-caps label="Cerrar" /></q-card-actions>
    </q-card>
  </q-dialog>
</template>
