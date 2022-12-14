import type { App } from 'vue'

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import('@renderer/views/Home.vue'),
		children: [
			{
				path: '/',
				component: () => import('@renderer/components/Root/Player/UserCenter.vue'),
			},
		],
	},
	{
		path: '/Crawler',
		name: 'Crawler',
		component: () => import('@renderer/views/Crawler.vue'),
		children: [
			{
				path: '',
				component: () => import('@renderer/components/Root/Player/CrawlerList.vue'),
			},
			{
				path: 'BuffCrawler',
				component: () => import('@renderer/components/Crawler/BuffCrawler.vue'),
				meta: { keepAlive: true },
			},
			{
				path: 'PurchaseAnalyser',
				component: () => import('@renderer/components/Crawler/PurchaseAnalyser.vue'),
				meta: { keepAlive: true },
			},
			{
				path : 'DataAnalyser',
				component : () => import('@/renderer/components/Crawler/DataAnalyser.vue')
			}
		],
	},
]

export const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})

export function setupRouter(app: App<Element>) {
	app.use(router)
}
