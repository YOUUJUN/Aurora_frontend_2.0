import { message as Message } from 'ant-design-vue'
import type { Ref } from 'vue'

import {
	startBuffCrawlerService,
	stopBuffCrawlerService,
	clearBuffCacheData,
	fetchBuffCacheData,
	startBuffCrawlerService_history,
	stopBuffCrawlerService_history,
	fetchBuffCacheData_history,
	saveSteamPurchase,
	saveBufffPurchase,
	saveGoodsData,
	saveHistoryPriceData,
	startBuffRefererCrawlerLoop,
	stopBuffRefererCrawlerService,
	clearRefererBuffCacheData,
	fetchRefererBuffData,
	updateBuffCrawlerPass,
} from '@renderer/api/buff'
import { errorCaptured } from '@renderer/utils/help'

interface ICrawlerCtrlReturn {
	actPage: Ref<number>
	endPage: Ref<number>
	startBuffCrawlerByPage: Function
	stopBuffCrawler: Function
	clearBuffData: Function
	gatherBuffData: Function
	reverseBuff: Function
	actBuffHistoryPrices: Function
	stopBuffHistoryPrices: Function
	fetchHistoryBuffData: Function
}

//处理buff数据
function processBuffData(buffData: Array<any>): TProcessedBuffData {
	const processedData = buffData.map((data, index) => {
		return {
			key: index.toString(),
			name: data.name,
			costPerformance: Number(data.costPerformance).toFixed(2),
			historyPrices: data.historyPrice,
			cost: Number(data.cost).toFixed(2),
			steamPrice: Number(data.steamPrice).toFixed(2),
			difference: Number(data.difference).toFixed(2),
			buyNum: data.buyNum,
			profits: Number(data.profits).toFixed(2),
			buffProfits: Number(data.buffProfits).toFixed(2),
			steamUrl: data.steamUrl,
			refererUrl: data.refererUrl,
			priceList: data?.priceList || [],
			lowestBargainPriceList: data?.lowestBargainPriceList || [],
			differentialRate: data?.differentialRate,
		}
	})

	return processedData
}

const useCrawlerCtrl = (): ICrawlerCtrlReturn => {
	const actPage = ref<number>(1)
	const endPage = ref<number>(2)

	//启动buff分页爬虫，默认页数为 1 - 2
	const startBuffCrawlerByPage = async (startPage: number = 1, endPage: number = 2): Promise<void> => {
		const [err, msg] = await errorCaptured(startBuffCrawlerService, {
			startPage,
			endPage,
		})

		if (err) {
			throw err
		}

		const { message, status } = msg.data
		if (status) {
			Message.success(message)
		}
	}

	//关闭buff分页爬虫
	const stopBuffCrawler = async (): Promise<void> => {
		const [err, msg] = await errorCaptured(stopBuffCrawlerService)
		if (err) {
			throw err
		}

		const { message, status } = msg.data
		if (status) {
			Message.success(message)
		}
	}

	//清除buff数据
	const clearBuffData = async (): Promise<any> => {
		const [err, msg] = await errorCaptured(clearBuffCacheData)
		if (err) {
			throw err
		}

		const { message, status } = msg.data
		if (status) {
			Message.success(message)
			return
		}
	}

	//获取buff数据
	const gatherBuffData = async (): Promise<TProcessedBuffData> => {
		const [err, msg] = await errorCaptured(fetchBuffCacheData)

		if (err) {
			throw err
		}

		const { message, status, data } = msg.data
		let returnData: TProcessedBuffData = []

		if (status) {
			Message.success(message)
			const processedBuffData = processBuffData(data)
			useDataStore().setBuffData(processedBuffData)
			returnData = processedBuffData
		}

		return returnData
	}

	//反转buff数据排序
	const reverseBuff = (): void => {
		const { buffData, reverseBuffData } = useDataStore()
		if (buffData.length === 0) {
			gatherBuffData()
		}

		reverseBuffData()
	}

	//启动buff历史数据爬虫
	const actBuffHistoryPrices = async (): Promise<void> => {
		const [err, msg] = await errorCaptured(startBuffCrawlerService_history)
		if (err) {
			throw err
		}

		const { message, status } = msg.data
		if (status) {
			Message.success(message)
			return
		}
	}

	//关闭buff历史数据爬虫
	const stopBuffHistoryPrices = async (): Promise<void> => {
		const [err, msg] = await errorCaptured(stopBuffCrawlerService_history)
		if (err) {
			throw err
		}

		const { message, status } = msg.data
		if (status) {
			Message.success(message)
			return
		}
	}

	//获取buff历史数据
	const fetchHistoryBuffData = async (): Promise<TProcessedBuffData> => {
		const [err, msg] = await errorCaptured(fetchBuffCacheData_history)

		if (err) {
			throw err
		}

		const { message, status, data } = msg.data
		let returnData: TProcessedBuffData = []

		if (status) {
			Message.success(message)
			const processedBuffData = processBuffData(data)
			useDataStore().setBuffData(processedBuffData)
			returnData = processedBuffData
		}

		return returnData
	}

	return {
		actPage,
		endPage,
		startBuffCrawlerByPage,
		stopBuffCrawler,
		clearBuffData,
		gatherBuffData,
		reverseBuff,
        actBuffHistoryPrices,
        stopBuffHistoryPrices,
        fetchHistoryBuffData
	}
}

export default useCrawlerCtrl
