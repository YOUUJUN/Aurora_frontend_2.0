<script setup lang="ts">
import { HomeFilled, Tickets, Setting } from '@element-plus/icons-vue'
import { BugOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

import SettingPanel from '@renderer/views/Setting.vue'

const settingPanel = ref()

function openSetting(): void {
	console.log('settingPanel', settingPanel)
	settingPanel.value.openSetting()
}

function test(): void {
	console.log('just a test')
}
</script>

<template>
	<article class="Menu">
		<section class="top-wrap">
			<div class="top">
				<el-scrollbar>
					<div class="functions">
						<el-menu default-active="/" :router="true" class="el-menu-vertical-demo">
							<el-menu-item index="/">
								<el-icon>
									<HomeFilled />
								</el-icon>
								<span>首页</span>
							</el-menu-item>

							<el-menu-item index="/Crawler">
								<el-icon>
									<BugOutlined />
								</el-icon>
								<span>爬虫管理</span>
							</el-menu-item>

							<el-menu-item index="">
								<el-icon>
									<Tickets />
								</el-icon>
								<span>TO-DO</span>
							</el-menu-item>
						</el-menu>
					</div>
				</el-scrollbar>
			</div>
		</section>

		<section class="setting-wrap">
			<el-button :icon="Setting" round @click="openSetting()">设置</el-button>

			<el-button :icon="Setting" round @click="test()">测试</el-button>
		</section>
	</article>

	<SettingPanel ref="settingPanel" />
</template>

<script lang="ts">
export default {
	data() {
		return {}
	},
}
</script>

<style scoped>
.Menu :deep(.el-menu) {
	background-color: inherit;
}

.Menu {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.top-wrap {
	position: relative;
	flex: 1;
}

.top {
	position: absolute;
	top: 0;
	bottom: 0;
	width: 100%;
}

.functions {
	padding: 0 15px;
}

.setting-wrap {
	display: flex;
	flex-direction: column;
	flex: 0;
	padding: 15px;
}

.setting-wrap button {
	margin: 6px 0;
	font-size: 16px;
}

.setting-wrap :deep(.el-icon) {
	font-size: 16px;
	margin-right: 6px;
}
</style>
