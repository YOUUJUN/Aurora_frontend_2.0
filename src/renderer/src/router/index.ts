import {createRouter, createWebHistory} from "vue-router";

import Home from "../views/Home.vue";
import UserCenter from "../components/Root/Player/UserCenter.vue";
import CrawlerList from "../components/Root/Player/CrawlerList.vue";
import Crawler from "../views/Crawler.vue";
import BuffCrawler from "../components/Extra/BuffCrawler.vue";
import PurchaseAnalyser from "../components/Extra/PurchaseAnalyser.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/",
                component: UserCenter,
            },
        ],
    },
    {
        path: "/Crawler",
        name: "Crawler",
        component: Crawler,
        children: [
            {
                path: "",
                component: CrawlerList,
            },
            {
                path: "BuffCrawler",
                component: BuffCrawler,
                meta: { keepAlive: true }
            },
            {
                path: "PurchaseAnalyser",
                component: PurchaseAnalyser,
                meta: { keepAlive: true }
            },
        ],
    },
];

const router = createRouter({
    history : createWebHistory(process.env.BASE_URL),
    routes,
})

export default router;
