import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

//Element-plus 按需引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

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

			// 自动引入
			AutoImport({
				include: [
					/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
					/\.vue$/,
					/\.vue\?vue/, // .vue
				],
				imports: ['vue'],
				resolvers: [ElementPlusResolver(), AntDesignVueResolver()],
				dts: 'types/auto-imports.d.ts',
				dirs: ['src/store/modules'],
				vueTemplate: true, //支持Vue 模版自动引入
			}),

			// 组件自动引入
			Components({
				extensions: ['vue'],
				resolvers: [ElementPlusResolver(), AntDesignVueResolver()],
				include: [/\.vue$/, /\.vue\?vue/],
				dts: 'types/components.d.ts',
			}),
		],
	},
})
