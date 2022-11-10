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

	ipcMain.on('startDevBuffCrawler', () => {
		console.log('let us start buff crawler dev')
		startDevBuffCrawler()
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

	ipcMain.on('startPrdBuffCrawler', () => {
		console.log('let us start buff crawler prd')
		startPrdBuffCrawler()
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

	ipcMain.on('stopBuffCrawler', () => {
		console.log('let us stop buff crawler')
		stopBuffCrawler()
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

	ipcMain.on('reStartBuffCrawler', () => {
		console.log('let us restart buff crawler')
		restartBuffCrawler()
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

	ipcMain.on('getBuffCrawlerLog', () => {
		console.log('let us get buff logs    ')
		getBuffCrawlerLog()
	})

	ipcMain.on('notifyLoopEnd', () => {
		showNotification({
			title: `通知！！！`,
			body: `本次循环任务已经完成！`,
			timeoutType: 'never',
		})
	})
}
