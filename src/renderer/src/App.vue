<script setup lang="ts">
import CustomTitleBar from '@renderer/components/Root/CustomTitleBar.vue'
import SideNav from '@renderer/components/Root/SideNav.vue'
import Bg from '@renderer/components/Root/Bg.vue'

import { computed } from 'vue'
import { useSettingStore } from '@renderer/store/modules/setting'

const settingStore = useSettingStore()

const theme = computed(() => settingStore.theme)
const accentColor = computed(() => settingStore.accentColor)
</script>

<template>
	<a-config-provider :locale="locale">
		<article id="wrap" class="container light_theme">
		<header class="header-wrap">
			<CustomTitleBar />
		</header>

		<main class="main-wrap">
			<aside class="left-panel-wrap">
				<SideNav />
			</aside>

			<article class="article-wrap">
				<router-view />
			</article>
		</main>

		<footer></footer>

		<Bg></Bg>
	</article>
	</a-config-provider>
	
</template>

<script lang="ts">
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
	data() {
		return {
			locale : zhCN
		}
	},
}
</script>

<style scoped>
* {
	scroll-behavior: smooth;
	box-sizing: border-box;
}

body {
	height: 100vh;
	overflow: hidden;
	padding: 0;
	margin: 0;
}

button {
	-webkit-app-region: no-drag;
}

#app {
	height: 100vh;
	background: rgb(8, 8, 8);
}

.container {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.header-wrap {
	position: fixed;
	top: 0;
	height: 45px;
	width: 100%;
	background-color: #f0f0f0;
	z-index: 3;
}

.main-wrap {
	display: flex;
	height: 100vh;
	flex-direction: row;
	padding: 10px;
	gap: 10px;
	padding-top: 55px;
}

.left-panel-wrap {
	position: relative;
	flex: 0;
	display: flex;
	flex-direction: column;
	width: 220px;
	min-width: 220px;
}

.article-wrap {
	position: relative;
	flex: 1;
}
</style>

<style>
@import '@renderer/styles/theme/themer.css';
@import '@renderer/styles/theme/utility_classes.css';
</style>
