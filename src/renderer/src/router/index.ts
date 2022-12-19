import type { App } from 'vue'

import { createRouter, createWebHistory } from 'vue-router'

import Home from '@renderer/views/Home.vue'
import UserCenter from '@renderer/components/Root/Player/UserCenter.vue'
import CrawlerList from '@renderer/components/Root/Player/CrawlerList.vue'
import Crawler from '@renderer/views/Crawler.vue'
import BuffCrawler from '@renderer/components/Crawler/BuffCrawler.vue'
import PurchaseAnalyser from '@renderer/components/Crawler/PurchaseAnalyser.vue'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		children: [
			{
				path: '/',
				component: UserCenter,
			},
		],
	},
	{
		path: '/Crawler',
		name: 'Crawler',
		component: Crawler,
		children: [
			{
				path: '',
				component: CrawlerList,
			},
			{
				path: 'BuffCrawler',
				component: BuffCrawler,
				meta: { keepAlive: true },
			},
			{
				path: 'PurchaseAnalyser',
				component: PurchaseAnalyser,
				meta: { keepAlive: true },
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
