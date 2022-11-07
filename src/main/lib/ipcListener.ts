import { ipcMain } from 'electron'

export function setupIpcMainListener(win:any) {
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
