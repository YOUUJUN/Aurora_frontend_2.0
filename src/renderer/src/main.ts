import { createApp } from 'vue'
import App from './App.vue'

//添加 websocket
import SocketService from '@renderer/api/socketService'
//触发对于服务器的socket连接
SocketService.Instance.connect();

import { setupStore } from '@renderer/store'
import { router, setupRouter } from '@renderer/router/index'

async function bootstrap() {
	const app = createApp(App)

	//绑定socket单例
	app.config.globalProperties.$socket = SocketService.Instance

	// 配置 store
	setupStore(app)

	// 配置 router
	setupRouter(app)

	app.mount('#app')
}

bootstrap()
