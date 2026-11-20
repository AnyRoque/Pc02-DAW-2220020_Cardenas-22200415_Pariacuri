import { createRouter, createWebHashHistory } from 'vue-router'
import CountryDetailPage from '../pages/CountryDetailPage.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    // Entrada temporal mientras se integra la pantalla de listado.
    { path: '/', redirect: '/paises/pe' },
    { path: '/paises/:codigo', name: 'country-detail', component: CountryDetailPage, props: true },
  ],
})
