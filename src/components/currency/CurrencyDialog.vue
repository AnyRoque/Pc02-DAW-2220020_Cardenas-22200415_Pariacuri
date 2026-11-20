<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="currency-dialog">
      <q-card-section class="row items-center bg-teal-7 text-white">
        <q-icon name="currency_exchange" size="28px" class="q-mr-sm" />
        <div>
          <div class="text-h6">{{ store.currency?.name || 'Moneda' }}</div>
          <div class="text-caption">
            Código: {{ store.currency?.code }} · Símbolo: {{ store.currency?.symbol || '—' }}
          </div>
        </div>
        <q-space />
        <q-btn v-close-popup flat round dense icon="close" aria-label="Cerrar" />
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2 text-grey-7 q-mb-sm">Tasa actual frente al dólar (USD)</div>

        <div v-if="store.rateLoading" class="row items-center q-gutter-sm">
          <q-spinner color="teal" size="24px" />
          <span>Consultando tasa...</span>
        </div>
        <ErrorState
          v-else-if="store.rateErrorMessage"
          :message="store.rateErrorMessage"
          @retry="store.fetchRate"
        />
        <div v-else-if="store.rateToUsd">
          <div class="text-h5 text-weight-medium">
            1 {{ store.currency.code }} = {{ formatRate(store.rateToUsd) }} USD
          </div>
          <div class="text-body2 text-grey-8">
            1 USD = {{ formatRate(store.usdToCurrency) }} {{ store.currency.code }}
          </div>
          <div v-if="store.asOf" class="text-caption text-grey-6 q-mt-xs">
            Actualizado: {{ formatDate(store.asOf) }}
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle2 text-grey-7 q-mb-sm">Conversor</div>
        <q-form class="row q-col-gutter-sm items-start" @submit.prevent="convert">
          <div class="col-12 col-sm-7">
            <q-input
              v-model.number="amount"
              type="number"
              :label="`Monto en ${store.currency?.code || ''}`"
              outlined
              dense
              min="0"
              step="any"
              :rules="[(value) => value > 0 || 'Ingresa un monto mayor a 0']"
            />
          </div>
          <div class="col-12 col-sm-5">
            <q-btn
              type="submit"
              color="teal-7"
              icon="swap_horiz"
              label="Convertir a USD"
              class="full-width"
              :loading="store.convertLoading"
              :disable="!(amount > 0)"
            />
          </div>
        </q-form>

        <ErrorState
          v-if="store.convertErrorMessage"
          :message="store.convertErrorMessage"
          class="q-mt-sm"
          @retry="convert"
        />
        <q-banner v-else-if="store.conversion" class="bg-teal-1 text-teal-10 q-mt-sm" rounded>
          <div class="text-h6">
            {{ formatMoney(store.conversion.amount) }} {{ store.conversion.from?.code }} =
            {{ formatMoney(store.conversion.result) }} USD
          </div>
          <div class="text-caption">Tasa usada: {{ formatRate(store.conversion.rate) }}</div>
        </q-banner>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCurrencyStore } from '@/stores/currency-store'
import ErrorState from '@/components/common/ErrorState.vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  currency: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue'])

const store = useCurrencyStore()
const amount = ref(100)

// Cada vez que se abre con una moneda, se consulta su tasa
watch(
  () => [props.modelValue, props.currency?.code],
  ([open]) => {
    if (open && props.currency) {
      amount.value = 100
      store.open(props.currency)
    }
  },
  { immediate: true },
)

function convert() {
  if (amount.value > 0) store.convertToUsd(amount.value)
}

function formatRate(value) {
  return new Intl.NumberFormat('es-PE', { maximumSignificantDigits: 6 }).format(value)
}

function formatMoney(value) {
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(asOf) {
  return new Date(asOf * 1000).toLocaleString('es-PE')
}
</script>

<style scoped>
.currency-dialog {
  width: 100%;
  max-width: 460px;
}
</style>
