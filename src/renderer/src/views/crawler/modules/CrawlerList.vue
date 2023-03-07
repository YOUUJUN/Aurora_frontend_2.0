<script setup lang="ts">
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function sayHi(): void {
	console.log('hi')
}

function goTo(target: any): void {
	router.push(target)
}
</script>

<template>
	<section class="title bg2">
		<h2>爬虫列表</h2>
	</section>

	<section class="panel-wrap bg2">
		<div class="panel">
			<el-scrollbar>
				<div class="cards-wrap">
					<a-card hoverable style="width: 300px" @click="goTo('/Crawler/BuffCrawler')">
						<template #cover>
							<img alt="example" src="@renderer/assets/images/template/judy.jpg" />
						</template>
						<template #actions>
							<a-button @click.stop="sayHi()">
								<setting-outlined key="setting" />
							</a-button>
							<a-button>
								<edit-outlined key="edit" />
							</a-button>
							<a-button>
								<ellipsis-outlined key="ellipsis" />
							</a-button>
						</template>
						<a-card-meta title="Buff Crawler" description="This is the description">
							<template #avatar>
								<a-avatar src="@renderer/assets/images/template/rainbow.png" />
							</template>
						</a-card-meta>
					</a-card>
				</div>
			</el-scrollbar>
		</div>
	</section>
</template>

<script lang="ts">
export default {
	data() {
		return {}
	},
}
</script>

<style scoped>
.Crawler {
	position: absolute;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	width: 100%;
	overflow: hidden;
}

.title {
	flex: 0;
	padding: 15px 25px;
	margin-bottom: 10px;
	border-radius: 20px;
}

.title h2 {
	font-size: 18px;
	margin: 0;
}

.panel-wrap {
	position: relative;
	flex: 1;
	border-radius: 20px;
	overflow: hidden;
}

.panel {
	position: absolute;
	top: 0;
	bottom: 0;
	width: 100%;
}

.cards-wrap {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-start;
	padding: 30px;
}
</style>
