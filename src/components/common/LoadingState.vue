<template>
  <div class="column items-center q-pa-xl text-grey-7">
    <q-spinner-globe color="primary" size="48px" />
    <div class="q-mt-md">{{ message }}</div>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, default: 'Cargando...' },
})
</script>
