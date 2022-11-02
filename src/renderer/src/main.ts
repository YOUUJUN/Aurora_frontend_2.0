import { createApp } from 'vue'
import App from './App.vue'

import { setupStore } from '@renderer/store'
import { router, setupRouter } from '@renderer/router/index'

async function bootstrap() {
	const app = createApp(App)

	// 配置 store
	setupStore(app)

	// 配置 router
	setupRouter(app)

	app.mount('#app')
}

bootstrap()
