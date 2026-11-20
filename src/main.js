import { createApp } from 'vue'
import { Quasar } from 'quasar'
import es from 'quasar/lang/es'
import 'quasar/dist/quasar.css'
import App from './App.vue'
import router from './router'

createApp(App).use(Quasar, { lang: es }).use(router).mount('#app')
