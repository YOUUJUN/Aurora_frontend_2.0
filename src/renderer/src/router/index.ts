import type { App } from 'vue'

import { createRouter, createWebHistory } from 'vue-router'

import CrawlerVue from '@renderer/views/Crawler.vue'
import UserCenterVue from '@renderer/components/Root/Player/UserCenter.vue'
import CrawlerListVue from '@renderer/components/Root/Player/CrawlerList.vue'
import BuffCrawlerVue from '@renderer/components/Crawler/BuffCrawler.vue'
import PurchaseAnalyserVue from '@renderer/components/Crawler/PurchaseAnalyser.vue'
import DataAnalyserVue from '@renderer/components/Crawler/DataAnalyser.vue'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import('@renderer/views/Home.vue'),
		children: [
			{
				path: '/',
				component: UserCenterVue,
			},
		],
	},
	{
		path: '/Crawler',
		name: 'Crawler',
		component: CrawlerVue,
		children: [
			{
				path: '',
				component: CrawlerListVue,
			},
			{
				path: 'BuffCrawler',
				component: BuffCrawlerVue,
				meta: { keepAlive: true },
			},
			{
				name: 'PurchaseAnalyser',
				path: 'PurchaseAnalyser',
				component: PurchaseAnalyserVue,
				meta: { keepAlive: true },
			},
			{
				name: 'DataAnalyser',
				path: 'DataAnalyser',
				component: DataAnalyserVue,
			},
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
