import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import './style.css'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
