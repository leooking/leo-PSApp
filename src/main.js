import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVfm } from 'vue-final-modal'
import LogRocket from 'logrocket'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import VueAwesomePaginate from 'vue-awesome-paginate'
import Badge from 'primevue/badge'
import BadgeDirective from 'primevue/badgedirective'

import App from './App.vue'
import router from './router'
import user from './lib/user'

user.setup()
const app = createApp(App)

try {
  if (!!VITE_API_MODE && VITE_API_MODE !== 'dev') {
    LogRocket.init('7knwep/pscibiscom')
    console.log('ran')
  }
} catch (err) {
  LogRocket.init('7knwep/pscibiscom')
}

app.use(createPinia())
app.use(createVfm())
app.use(PrimeVue)
app.use(router)
app.use(PrimeVue)
app.directive('tooltip', Tooltip)
app.directive('badge', BadgeDirective)
app.use(VueAwesomePaginate)

app.mount('#app')
