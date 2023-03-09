import type { App } from 'vue'

import { createRouter, createWebHistory } from 'vue-router'

import CrawlerVue from '@renderer/views/crawler/index.vue'
import UserCenterVue from '@renderer/views/user_center/index.vue'
import CrawlerListVue from '@renderer/views/crawler/modules/CrawlerList.vue'
import BuffCrawlerVue from '@renderer/views/crawler/modules/BuffCrawler.vue'
import PurchaseAnalyserVue from '@renderer/views/crawler/modules/PurchaseAnalyser.vue'
import DataAnalyserVue from '@renderer/views/crawler/modules/DataAnalyser.vue'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import('@renderer/components/Root/Player/Home.vue'),
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
