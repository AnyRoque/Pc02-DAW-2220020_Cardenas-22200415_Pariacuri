<template>
  <q-chip
    clickable
    color="teal-1"
    text-color="teal-9"
    icon="currency_exchange"
    @click.stop="emit('open', currency)"
  >
    {{ currency.code }}<span v-if="currency.symbol" class="q-ml-xs">({{ currency.symbol }})</span>
    <q-tooltip>{{ currency.name }} · ver tipo de cambio</q-tooltip>
  </q-chip>
</template>

<script setup>
defineProps({
  currency: { type: Object, required: true },
})

const emit = defineEmits(['open'])
</script>
