<template>
  <q-card flat bordered class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-7">
        <q-input
          :model-value="modelValue.capital"
          label="Buscar por capital"
          placeholder="Ej.: Lima"
          outlined
          clearable
          debounce="500"
          @update:model-value="updateFilter('capital', $event)"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-5">
        <q-select
          :model-value="modelValue.region"
          :options="CONTINENTS"
          label="Continente"
          outlined
          clearable
          emit-value
          map-options
          @update:model-value="updateFilter('region', $event)"
        >
          <template #prepend>
            <q-icon name="public" />
          </template>
        </q-select>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { CONTINENTS } from '@/utils/country'

const props = defineProps({
  modelValue: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue'])

function updateFilter(key, value) {
  emit('update:modelValue', { ...props.modelValue, [key]: value || null })
}
</script>
