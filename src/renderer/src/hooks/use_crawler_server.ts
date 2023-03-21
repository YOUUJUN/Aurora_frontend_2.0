const { ipcRenderer } = window.electron
import { createVNode } from 'vue'
import type { Ref } from 'vue'
import type { Socket } from 'socket.io-client'
import { EnvEnum } from '@renderer/enums/env_enum'
import { message as Message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useSocketIO } from '@renderer/hooks/use_socketio'

type TUseCrawlerServerReturn = {
	servePath: Ref<string>
	serverStatus: Ref<'default' | 'error' | 'success' | 'warning' | 'processing'>
	serverStatusText: Ref<string>
	serverStartTime: Ref<string>
	serverEndTime: Ref<string>
	serverSocketInstance: Socket
	sendMessageToNode: (message: string, payload?: any) => void
	startCrawlerServer: (info: string) => void
	stopCrawlerServer: () => void
	reStartCrawlerServer: () => void
	getBuffCrawlerLog: () => void
}

const useCrawlerServer = (): TUseCrawlerServerReturn => {
	const servePath = ref<string>(EnvEnum.servicePath)
	const { socket } = useSocketIO(EnvEnum.socketUrl)
	const serverStatus = ref<'default' | 'error' | 'success' | 'warning' | 'processing'>('default')
	const serverStatusText = ref<string>('closed')
	const serverStartTime = ref<string>('')
	const serverEndTime = ref<string>('')

	ipcRenderer.on('buffCrawlerRunning', (e, payload) => {
		console.log('im in!!!!!!!!!!!!!!!!!!!!!!!')
		serverStatus.value = 'processing'
		serverStatusText.value = 'Running'
		serverStartTime.value = new Date().toLocaleString()
		Message.success('服务启动成功!')
	})

	ipcRenderer.on('buffCrawlerClosing', (e, payload) => {
		serverStatus.value = 'default'
		serverStatusText.value = 'closed'
		serverEndTime.value = new Date().toLocaleString()
		Message.success('服务关闭成功!')
	})

	const sendMessageToNode = (message: string, payload?: any): void => {
		console.log('msg', message, payload)
		ipcRenderer.send(message, payload)
	}

	const invokeEndLoop = () => {
		socket.once('endLoop', (payload) => {
			sendMessageToNode('notifyLoopEnd')
		})
	}

	const startCrawlerServer = (info: string) => {
		let command = ''
		if (info === 'dev') {
			command = 'startDevBuffCrawler'
		} else if (info === 'prd') {
			command = 'startPrdBuffCrawler'
		}
		Modal.confirm({
			title: '是否确认打开服务?',
			icon: createVNode(ExclamationCircleOutlined),
			content: '该操作会在后台启动 pm2 buffCrawler 服务',
			onOk() {
				return new Promise<void>((resolve, reject) => {
					console.log('-------------------lalalalalla')
					sendMessageToNode(command, servePath.value)

					ipcRenderer.once('startBuffCrawlerFailed', (e, payload) => {
						Message.error('服务启动失败!')
						reject()
					})
					ipcRenderer.once('startBuffCrawlerDone', (e, payload) => {
						resolve()
						setTimeout(() => {
							invokeEndLoop()
						}, 10000)
					})
				})
			},

			onCancel() {},
		})
	}

	const stopCrawlerServer = () => {
		Modal.confirm({
			title: '是否确认关闭服务?',
			icon: createVNode(ExclamationCircleOutlined),
			content: '该操作会关闭后台 pm2 buffCrawler 服务',
			onOk() {
				return new Promise<void>((resolve, reject) => {
					sendMessageToNode('stopBuffCrawler', servePath.value)
					ipcRenderer.once('stopBuffCrawlerFailed', (e, payload) => {
						Message.error('服务启动失败!')
						reject()
					})
					ipcRenderer.once('stopBuffCrawlerDone', (e, payload) => {
						resolve()
					})
				})
			},

			onCancel() {},
		})
	}

	const reStartCrawlerServer = () => {
		Modal.confirm({
			title: '是否确认重启服务?',
			icon: createVNode(ExclamationCircleOutlined),
			content: '该操作会重启后台 pm2 buffCrawler 服务',
			onOk() {
				return new Promise<void>((resolve, reject) => {
					sendMessageToNode('reStartBuffCrawler', servePath.value)
					ipcRenderer.once('startBuffCrawlerFailed', (e, payload) => {
						Message.error('服务启动失败!')
						reject()
					})
					ipcRenderer.once('startBuffCrawlerDone', (e, payload) => {
						resolve()
						setTimeout(() => {
							invokeEndLoop()
						}, 10000)
					})
				})
			},

			onCancel() {},
		})
	}

	//开启服务器打印日志
	const getBuffCrawlerLog = (): void => {
		sendMessageToNode('getBuffCrawlerLog', servePath.value)
	}

	return {
		servePath,
		serverStatus,
		serverStatusText,
		serverStartTime,
		serverEndTime,
		serverSocketInstance: socket,
		sendMessageToNode,
		startCrawlerServer,
		stopCrawlerServer,
		reStartCrawlerServer,
		getBuffCrawlerLog,
	}
}

export default useCrawlerServer
