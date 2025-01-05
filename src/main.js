import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import MessageAlert from '@/components/MessageAlert.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 全局注册 MessageAlert 组件
app.component('MessageAlert', MessageAlert)

app.mount('#app')
