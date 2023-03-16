import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
	type TApi = {
		openExternal: (url: string) => void
	}

	interface Window {
		electron: ElectronAPI
		api: TApi
	}
}
