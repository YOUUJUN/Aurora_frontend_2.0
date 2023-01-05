import type { BrowserWindow } from 'electron'

import { ipcMain } from 'electron'
import {
	startDevBuffCrawler,
	startPrdBuffCrawler,
	stopBuffCrawler,
	restartBuffCrawler,
	getBuffCrawlerLog,
	showNotification,
} from '../services/buffCrawler'

export function setupIpcMainListener(win: BrowserWindow): void {
	//ipcMain listener

	ipcMain.on('minimize', () => {
		win.minimize()
	})

	ipcMain.on('maximize', () => {
		if (win.isMaximized()) {
			win.unmaximize()
			win.center()
		} else {
			win.maximize()
		}
	})

	ipcMain.on('closeWindow', () => {
		win.close()
	})
}

export function setupBuffCrawlerIpcMainListener(win: BrowserWindow): void {
	// buff crawler ipc listener

	ipcMain.on('startDevBuffCrawler', (event, params) => {
		startDevBuffCrawler(params)
			.then((res) => {
				win.webContents.send('buffCrawlerRunning', res)
			})
			.catch((err) => {
				win.webContents.send('startBuffCrawlerFailed', err)
			})
			.finally(() => {
				win.webContents.send('startBuffCrawlerDone')
			})
	})

	ipcMain.on('startPrdBuffCrawler', (event, params) => {
		console.log('let us start buff crawler prd')
		startPrdBuffCrawler(params)
			.then((res) => {
				win.webContents.send('buffCrawlerRunning', res)
			})
			.catch((err) => {
				win.webContents.send('startBuffCrawlerFailed', err)
			})
			.finally(() => {
				win.webContents.send('startBuffCrawlerDone')
			})
	})

	ipcMain.on('stopBuffCrawler', (event, params) => {
		console.log('let us stop buff crawler')
		stopBuffCrawler(params)
			.then((res) => {
				win.webContents.send('buffCrawlerClosing', res)
			})
			.catch((err) => {
				win.webContents.send('stopBuffCrawlerFailed', err)
			})
			.finally(() => {
				win.webContents.send('stopBuffCrawlerDone')
			})
	})

	ipcMain.on('reStartBuffCrawler', (event, params) => {
		console.log('let us restart buff crawler')
		restartBuffCrawler(params)
			.then((res) => {
				win.webContents.send('buffCrawlerRunning', res)
			})
			.catch((err) => {
				win.webContents.send('startBuffCrawlerFailed', err)
			})
			.finally(() => {
				win.webContents.send('startBuffCrawlerDone')
			})
	})

	ipcMain.on('getBuffCrawlerLog', (event, params) => {
		console.log('let us get buff logs    ')
		getBuffCrawlerLog(params)
	})

	ipcMain.on('notifyLoopEnd', () => {
		showNotification({
			title: `通知！！！`,
			body: `本次循环任务已经完成！`,
			timeoutType: 'never',
		})
	})
}
