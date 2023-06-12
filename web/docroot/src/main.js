import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './css/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import {useAppStore} from "@/stores/app";

// Create an instance of our Vue app
const app = createApp(App)

// Add the store
app.use(createPinia())

// Global properties
// The back end URL
app.config.globalProperties.baseUrl = window.location.protocol + '//' + window.location.hostname + ':8000'
// The steam workshop URL
app.config.globalProperties.steamUrl = 'https://steamcommunity.com/sharedfiles/filedetails/?id='

// A global error handler
app.config.errorHandler = (err, instance, info) => {
    const store = useAppStore()
    store.errorText = err.message
    console.error('GLOBAL ERROR HANDLER!   ', err, instance, info)
}

// Mount it
app.mount('#app')
