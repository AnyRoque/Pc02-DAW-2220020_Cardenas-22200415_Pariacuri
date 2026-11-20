<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-teal-10"><q-toolbar class="shell"><q-toolbar-title>Country Explorer</q-toolbar-title></q-toolbar></q-header>
    <q-page-container><router-view :key="$route.path" /></q-page-container>
  </q-layout>
</template>
<style>
body { background: #f4f6f4; color: #183c38; }
.shell, .detail { max-width: 980px; margin: auto; }
</style>
