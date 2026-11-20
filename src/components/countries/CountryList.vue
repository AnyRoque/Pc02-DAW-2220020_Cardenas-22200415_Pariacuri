<template>
  <div v-if="countries.length" class="row q-col-gutter-md">
    <div
      v-for="country in countries"
      :key="country.codes?.alpha_2"
      class="col-12 col-sm-6 col-md-4 col-lg-3"
    >
      <CountryCard
        :country="country"
        @select="emit('select', $event)"
        @currency="emit('currency', $event)"
      />
    </div>
  </div>
  <q-banner v-else class="bg-grey-2 text-grey-8" rounded>
    <template #avatar>
      <q-icon name="travel_explore" color="grey-7" />
    </template>
    No hay países que coincidan con la búsqueda.
  </q-banner>
</template>

<script setup>
import CountryCard from './CountryCard.vue'

defineProps({
  countries: { type: Array, required: true },
})

const emit = defineEmits(['select', 'currency'])
</script>
