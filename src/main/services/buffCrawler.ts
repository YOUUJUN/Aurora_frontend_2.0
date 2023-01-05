const Path = require('path')
const util = require('util')
const execFile = util.promisify(require('child_process').execFile)
import { Notification } from 'electron'

const buffCrawlerPath = Path.resolve('../backend')

export async function startDevBuffCrawler(execPath = buffCrawlerPath) {
	console.log('buffCrawlerPath', execPath)
	try {
		// await execFile('pm2 start ecosystem.config.js', ['--env development'], {
		//     windowsHide : false,
		//     cwd : buffCrawlerPath
		// })

		let result = await execFile('npm run dev', {
			windowsHide: false,
			cwd: execPath,
			shell: true,
		})

		console.log('result', result)
		return result
	} catch (e) {
		console.log(e)
		throw e
	}
}

export async function startPrdBuffCrawler(execPath = buffCrawlerPath) {
	try {
		// await execFile('pm2 start ecosystem.config.js', ['--env development'], {
		//     windowsHide : false,
		//     cwd : buffCrawlerPath
		// })

		let result = await execFile('npm run prd', {
			windowsHide: false,
			cwd: execPath,
			shell: true,
		})

		console.log('result', result)
		return result
	} catch (e) {
		console.log(e)
		throw e
	}
}

export async function stopBuffCrawler(execPath = buffCrawlerPath) {
	try {
		let result = await execFile('pm2 stop aurora', {
			windowsHide: false,
			cwd: execPath,
			shell: true,
		})

		console.log('result', result)
		return result
	} catch (e) {
		console.log(e)
		throw e
	}
}

export async function restartBuffCrawler(execPath = buffCrawlerPath) {
	try {
		let result = await execFile('pm2 restart aurora', {
			windowsHide: false,
			cwd: execPath,
			shell: true,
		})

		console.log('result', result)
		return result
	} catch (e) {
		console.log(e)
		throw e
	}
}

export async function getBuffCrawlerLog(execPath = buffCrawlerPath) {
	try {
		let logs = await execFile('start cmd.exe /K pm2 log aurora', {
			windowsHide: false,
			cwd: execPath,
			shell: true,
		})

		console.log('logs', logs)
	} catch (e) {
		console.log(e)
	}
}

export function showNotification(options) {
	console.log('if notify works', Notification.isSupported())
	let notify = new Notification(options)
	notify.timeoutType = 'never'
	notify.show()
}
