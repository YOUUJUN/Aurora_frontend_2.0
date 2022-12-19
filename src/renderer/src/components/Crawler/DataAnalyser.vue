<script setup lang="ts">
import type { Ref } from 'vue'
import { onMounted } from 'vue'

import * as echarts from 'echarts'
import { ref, nextTick } from 'vue'

import { useRoute } from 'vue-router'
import { useDataStore } from '@renderer/store/modules/data'

type EChartsOption = echarts.EChartsOption

let renderCount: Ref<number> = ref(12)

function splitIntoThree(arr) {
	const chunkSize = Math.ceil(arr.length / 3)
	return [arr.slice(0, chunkSize), arr.slice(chunkSize, chunkSize * 2), arr.slice(chunkSize * 2)]
}

function splitIntoChunks(arr: any[], chunkSize: number) {
	const chunks: any[] = []
	let i = 0
	while (i < arr.length) {
		chunks.push(arr.slice(i, i + chunkSize))
		i += chunkSize
	}
	return chunks
}

function splitIntoEqualChunks(arr, chunkCount) {
	const chunkSize = Math.ceil(arr.length / chunkCount)
	return splitIntoChunks(arr, chunkSize)
}

const drawChartByChunk = (data: Array<any>, chunkCount: number) => {
	const splitData = splitIntoEqualChunks(data, chunkCount)

	renderCount.value = chunkCount

	nextTick(() => {
		let i = 1

		while (i < chunkCount) {
			const xData = splitData[i - 1].map((item) => item.name)
			const yBuffData = splitData[i - 1].map((item) => item.cost)
			const ySteamData = splitData[i - 1].map((item) => item.steamPrice)

			const chartDom = document.getElementById(`chart_${i}`)!
			const myChart = echarts.init(chartDom)
			const option: EChartsOption = {
				legend: {
					data: ['Buff', 'Steam'],
					itemGap: 5,
				},
				xAxis: {
					type: 'category',
					data: xData,
				},
				yAxis: {
					type: 'value',
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
						label: {
							show: true,
						},
					},
				},
				toolbox: {
					show: true,
					feature: {
						mark: { show: true },
						dataView: { show: true, readOnly: false },
						magicType: { show: true, type: ['line', 'bar'] },
						restore: { show: true },
						saveAsImage: { show: true },
					},
				},
				dataZoom: [
					{
						type: 'inside',
					},
					{
						type: 'slider',
					},
					{
						show: true,
						yAxisIndex: 0,
						filterMode: 'empty',
						width: 30,
						height: '80%',
						showDataShadow: false,
						left: '93%',
					},
				],
				series: [
					{
						name: 'Buff',
						type: 'bar',
						data: yBuffData,
					},
					{
						name: 'Steam',
						type: 'bar',
						data: ySteamData,
					},
				],
			}

			myChart.setOption(option)

			i += 1
		}
	})
}

onMounted(() => {
	const buffData = useDataStore().buffData

	if (buffData.length === 0) {
		return
	}

	const LowCostData = buffData.filter((item) => {
		if (parseInt(item.cost) <= 300) {
			return item
		}
	})

	LowCostData.sort((a, b) => b.costPerformance - a.costPerformance)

	drawChartByChunk(<any[]>LowCostData, 100)
})
</script>

<template>
	<article class="root">
		<el-scrollbar>
			<header>
				<section class="title bg2">
					<h2>数据分析</h2>
				</section>
			</header>

			<main class="chart-wrap bg2">
				<div :id="`chart_${item}`" v-for="(item, index) of renderCount"></div>
			</main>
		</el-scrollbar>
	</article>
</template>

<script lang="ts">
export default {
	data() {
		return {}
	},
}
</script>

<style scoped>
.root {
	position: absolute;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	width: 100%;
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

.chart-wrap {
	flex: 1;
	width: 100%;
	border-radius: 20px;
}

.chart-wrap > div {
	margin-top: 14px;
	height: 500px;
}
</style>
