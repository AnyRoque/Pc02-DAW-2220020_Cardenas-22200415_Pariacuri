<template>
  <q-banner class="bg-red-1 text-negative" rounded>
    <template #avatar>
      <q-icon name="error_outline" color="negative" />
    </template>
    {{ message }}
    <template v-if="retry" #action>
      <q-btn flat color="negative" icon="refresh" label="Reintentar" @click="emit('retry')" />
    </template>
  </q-banner>
</template>

<script setup>
defineProps({
  message: { type: String, required: true },
  retry: { type: Boolean, default: true },
})

const emit = defineEmits(['retry'])
</script>
