import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

function pathResolve(dir: string) {
	return resolve(process.cwd(), '.', dir)
}

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
				'#renderer' : resolve('src/renderer/types'),
				'@' : resolve('src'),
				
			},
		},
		plugins: [vue()],
	},
})
