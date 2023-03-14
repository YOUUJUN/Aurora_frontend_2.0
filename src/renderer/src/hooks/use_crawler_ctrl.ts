import { message as Message } from 'ant-design-vue'
import type { Ref, ToRef } from 'vue'
import type { Dayjs } from 'dayjs'

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
	offset: Ref<number>
	limit: Ref<number>
	token: Ref<string>
	buffData: Ref<TProcessedBuffData[]>
	statisticalTime: Ref<Dayjs | undefined>
	startBuffCrawlerByPage: Function
	stopBuffCrawler: Function
	clearBuffData: Function
	gatherBuffData: Function
	reverseBuff: Function
	actBuffHistoryPrices: Function
	stopBuffHistoryPrices: Function
	fetchHistoryBuffData: Function
	saveServerCacheHistoryPrice: Function
	startRefererBuff: Function
	stopRefererBuff: Function
	gatherRefererBuff: Function
	clearRefererBuff: Function
	updateLogInfo: Function
	saveServerCacheData: Function
	saveSteamPurchaseData: Function
	saveBuffPurchaseData: Function
	test: Function
}

//处理buff数据
function processBuffData(buffData: Array<any>): TProcessedBuffData[] {
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
	//起始分页数
	let actPage = ref<number>(1)
	//中止分页数
	let endPage = ref<number>(2)
	//历史价格数据统计时间
	let statisticalTime = ref<Dayjs>()
	//Referer Buff查询参数
	let offset = ref<number>(1)
	let limit = ref<number>(1000)
	let token = ref<string>('')

	let buffData = ref<TProcessedBuffData[]>([])

	//启动buff分页爬虫，默认页数为 1 - 2
	const startBuffCrawlerByPage = async (
		start: number = actPage.value,
		end: number = endPage.value,
	): Promise<void> => {
		const [err, msg] = await errorCaptured(startBuffCrawlerService, {
			startPage: start,
			endPage: end,
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
	const gatherBuffData = async (): Promise<TProcessedBuffData[]> => {
		const [err, msg] = await errorCaptured(fetchBuffCacheData)

		if (err) {
			throw err
		}

		const { message, status, data } = msg.data
		let returnData: TProcessedBuffData[] = []

		if (status) {
			Message.success(message)
			const processedBuffData = processBuffData(data)
			useDataStore().setBuffData(processedBuffData)
			returnData = processedBuffData
			buffData.value = processedBuffData
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
	const fetchHistoryBuffData = async (): Promise<TProcessedBuffData[]> => {
		const [err, msg] = await errorCaptured(fetchBuffCacheData_history)

		if (err) {
			throw err
		}

		const { message, status, data } = msg.data
		let returnData: TProcessedBuffData[] = []

		if (status) {
			Message.success(message)
			const processedBuffData = processBuffData(data)
			useDataStore().setBuffData(processedBuffData)
			returnData = processedBuffData
			buffData.value = processedBuffData
		}

		return returnData
	}

	//保存缓存历史价格数据
	const saveServerCacheHistoryPrice = async (time: Dayjs | undefined = statisticalTime.value): Promise<void> => {
		if (!time) {
			Message.warning('请先选择历史数据统计时间!')
			return
		}

		const payload = {
			statisticalTime: time?.format('YYYY-MM-DD'),
		}

		const [err, msg] = await errorCaptured(saveHistoryPriceData, payload)

		if (err) {
			throw err
		}

		const { success } = msg.data
		if (success) {
			console.log('msg', msg)
			return
		}
	}

	//启动Referer Buff爬虫
	const startRefererBuff = async (
		referer: string,
		offsetCount: number = offset.value,
		limitCount: number = limit.value,
	): Promise<void> => {
		let params = {
			offset: offsetCount,
			limit: limitCount,
			referer,
		}

		const [err, result] = await errorCaptured(startBuffRefererCrawlerLoop, params)

		if (err) {
			throw err
		}

		const { success, msg } = result.data
		Message.warning(msg)
		if (success) {
			return
		}
	}

	//关闭Referer Buff爬虫
	const stopRefererBuff = async (): Promise<void> => {
		const [err, result] = await errorCaptured(stopBuffRefererCrawlerService)

		if (err) {
			throw err
		}

		const { success, msg } = result.data

		if (success) {
			Message.success(msg)
		}
	}

	//获取Referer Buff爬虫数据
	const gatherRefererBuff = async (): Promise<void> => {
		const [err, result] = await errorCaptured(fetchRefererBuffData)

		if (err) {
			throw err
		}

		const { status, message, data } = result.data

		if (status) {
			const processedBuffData = processBuffData(data)
			useDataStore().setBuffData(processedBuffData)
			buffData.value = processedBuffData

			Message.success(message)
		}
	}

	//清除Referer Buff爬虫
	const clearRefererBuff = async (): Promise<void> => {
		const [err, msg] = await errorCaptured(clearRefererBuffCacheData)

		if (err) {
			throw err
		}

		const { message } = msg.data
		if (message) {
			Message.success(message)
		}
	}

	//更新爬虫程序登录信息
	const updateLogInfo = async (tokenValue: string = token.value): Promise<void> => {
		const [err, msg] = await errorCaptured(updateBuffCrawlerPass, {
			token: tokenValue,
		})

		if (err) {
			throw err
		}

		const { status, message } = msg.data

		if (msg) {
			if (status == 1) {
				Message.success(msg.data.message)
			} else {
				Message.error(msg.data.message)
			}
		}
	}

	//保存缓存数据
	const saveServerCacheData = async (): Promise<void> => {
		const payload = [
			{
				name: '折叠刀（★ StatTrak™） | 森林 DDPAT (战痕累累)',
				difference: 9655.682999999999,
				cost: '580',
				steamPrice: '12041.98',
				costPerformance: 16.647729310344827,
				buyNum: 0,
				profits: 7403.832739999999,
				buffProfits: 565.5,
				rate: 0.9530392842373098,
				steamUrl:
					'https://steamcommunity.com/market/listings/730/%E2%98%85%20StatTrak%E2%84%A2%20Flip%20Knife%20%7C%20Forest%20DDPAT%20%28Battle-Scarred%29',
				historyUrl:
					'https://buff.163.com/api/market/goods/price_history/buff?game=csgo&goods_id=43532&currency=CNY&days=30&_=1640246631792',
				recordUrl: 'https://buff.163.com/api/market/goods/bill_order?game=csgo&goods_id=43532&_=1640246631792',
				refererUrl: 'https://buff.163.com/market/goods?goods_id=43532&from=market',
			},
			{
				name: '暗影双匕（★ StatTrak™） | 森林 DDPAT (战痕累累)',
				difference: 5730.4095,
				cost: '388.8',
				steamPrice: '7199.07',
				costPerformance: 14.738707561728394,
				buyNum: 2,
				profits: 4384.183410000001,
				buffProfits: 379.08,
				rate: 0.9473431984964724,
				steamUrl:
					'https://steamcommunity.com/market/listings/730/%E2%98%85%20StatTrak%E2%84%A2%20Shadow%20Daggers%20%7C%20Forest%20DDPAT%20%28Battle-Scarred%29',
				historyUrl:
					'https://buff.163.com/api/market/goods/price_history/buff?game=csgo&goods_id=43869&currency=CNY&days=30&_=1640245937843',
				recordUrl: 'https://buff.163.com/api/market/goods/bill_order?game=csgo&goods_id=43869&_=1640245937843',
				refererUrl: 'https://buff.163.com/market/goods?goods_id=43869&from=market',
			},
		]

		const [err, msg] = await errorCaptured(saveGoodsData, {
			goods: payload,
		})

		if (err) {
			throw err
		}

		if (msg) {
			console.log('msg', msg)
		}
	}

	//存储steam购买记录
	const saveSteamPurchaseData = async (goods: any[]): Promise<void> => {
		if (goods.length < 1) {
			return
		}

		const [err, msg] = await errorCaptured(saveSteamPurchase, {
			goods,
			buy_time: new Date().getTime(),
		})

		if (err) {
			throw err
		}

		const { message, status } = msg.data
		if (msg) {
			if (status == 1) {
				Message.success(message)
			} else {
				Message.error(message)
			}
		}
	}

	const saveBuffPurchaseData = async (goods: TProcessedBuffData[]): Promise<void> => {
		if (goods.length < 1) {
			return
		}

		const [err, msg] = await errorCaptured(saveBufffPurchase, {
			goods,
			buy_time: new Date().getTime(),
		})

		if (err) {
			throw err
		}

		const { message, status } = msg.data
		if (msg) {
			if (status == 1) {
				Message.success(message)
			} else {
				Message.error(message)
			}
		}
	}

	const test = () => {
		console.log('actPage', actPage.value)
	}

	return {
		actPage,
		endPage,
		offset,
		limit,
		token,
		buffData,
		statisticalTime,
		startBuffCrawlerByPage,
		stopBuffCrawler,
		clearBuffData,
		gatherBuffData,
		reverseBuff,
		actBuffHistoryPrices,
		stopBuffHistoryPrices,
		fetchHistoryBuffData,
		saveServerCacheHistoryPrice,
		startRefererBuff,
		stopRefererBuff,
		gatherRefererBuff,
		clearRefererBuff,
		updateLogInfo,
		saveServerCacheData,
		saveSteamPurchaseData,
		saveBuffPurchaseData,
		test,
	}
}

export default useCrawlerCtrl
