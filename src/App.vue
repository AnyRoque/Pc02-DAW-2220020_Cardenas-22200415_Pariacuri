<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="public" to="/" aria-label="Inicio" />
        <q-toolbar-title class="cursor-pointer" @click="$router.push('/')">
          Country Explorer
        </q-toolbar-title>
        <div class="text-caption gt-xs">Datos: RestCountries · Banderas: flagcdn</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
