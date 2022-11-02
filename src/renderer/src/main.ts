import { createApp } from 'vue'
import App from './App.vue'

import { setupStore } from '@renderer/store'

async function bootstrap() {
	const app = createApp(App)

	// Configure store
	// 配置 store
	setupStore(app)

	app.mount('#app')
}

bootstrap()
