<template>
  <q-card
    class="country-card full-height cursor-pointer"
    tabindex="0"
    @click="emit('select', alpha2)"
    @keyup.enter="emit('select', alpha2)"
  >
    <q-img :src="flagUrl(alpha2, 'w320')" :alt="`Bandera de ${name}`" :ratio="16 / 10" fit="cover">
      <template #error>
        <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">Sin bandera</div>
      </template>
    </q-img>

    <q-card-section>
      <div class="text-h6 ellipsis">{{ name }}</div>
      <div class="text-caption text-grey-7">{{ continentLabel(country.region) }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row items-center no-wrap q-mb-xs">
        <q-icon name="location_city" class="q-mr-sm" color="primary" />
        <span class="ellipsis">{{ primaryCapital(country) }}</span>
      </div>
      <div class="row items-center no-wrap">
        <q-icon name="groups" class="q-mr-sm" color="primary" />
        <span>{{ formatNumber(country.population) }} hab.</span>
      </div>
    </q-card-section>

    <q-card-actions class="q-pt-none q-px-md q-pb-md">
      <CurrencyChip
        v-for="currency in country.currencies || []"
        :key="currency.code"
        :currency="currency"
        @open="emit('currency', $event)"
      />
      <span v-if="!country.currencies?.length" class="text-caption text-grey-6">Sin moneda</span>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import CurrencyChip from '@/components/currency/CurrencyChip.vue'
import { continentLabel, countryName, flagUrl, formatNumber, primaryCapital } from '@/utils/country'

const props = defineProps({
  country: { type: Object, required: true },
})

const emit = defineEmits(['select', 'currency'])

const alpha2 = computed(() => props.country.codes?.alpha_2)
const name = computed(() => countryName(props.country))
</script>

<style scoped>
.country-card {
  display: flex;
  flex-direction: column;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.country-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.country-card :deep(.q-card__actions) {
  margin-top: auto;
}
</style>
