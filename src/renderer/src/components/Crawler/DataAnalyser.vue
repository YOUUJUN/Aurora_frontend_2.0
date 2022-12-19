<script setup lang="ts">
import type { Ref } from 'vue'
import { onMounted } from 'vue'

import * as echarts from 'echarts'
import { ref } from 'vue'

import { useRoute } from 'vue-router'
import { useDataStore } from '@renderer/store/modules/data'

type EChartsOption = echarts.EChartsOption

const chart = ref('chart')

const drawChart = (data: Array<any>) => {
	const xData = data.map((item) => item.name)
	const yBuffData = data.map((item) => item.cost)
	const ySteamData = data.map((item) => item.steamPrice)

	const chartDom = document.getElementById('chart')!
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
}

onMounted(() => {
	const buffData = useDataStore().buffData
	const LowCostData = buffData.filter((item) => {
		if (parseInt(item.cost) <= 300) {
			return item
		}
	})
	console.log('LowCostData', LowCostData)
	drawChart(<any[]>LowCostData)
})
</script>

<template>
	<article class="root bg2">
		<main class="chart-wrap">
			<div id="chart" ref="chart"></div>
		</main>
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
	display: flex;
	height: 100%;
	width: 100%;
	border-radius: 20px;
}

.chart-wrap {
	width: 100%;
	height: 100%;
}

#chart {
	width: 100%;
	height: 500px;
}
</style>
