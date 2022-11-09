import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

//Element-plus 按需引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// function pathResolve(dir: string) {
// 	return resolve(process.cwd(), '.', dir)
// }

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()],
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
	},
	renderer: {
		resolve: {
			alias: {
				'@renderer': resolve('src/renderer/src'),
				'#renderer': resolve('src/renderer/types'),
				'@': resolve('src'),
			},
		},
		plugins: [
			vue(),

			//Element-plus, ant-design-vue 按需引入
			AutoImport({
				resolvers : [ElementPlusResolver(), AntDesignVueResolver()],
			}),
			Components({
				resolvers : [ElementPlusResolver(), AntDesignVueResolver()],
			}),
		],
	},
})
