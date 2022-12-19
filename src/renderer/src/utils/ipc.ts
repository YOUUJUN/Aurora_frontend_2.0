const { ipcRenderer } = window.electron

export function sendMessageToNode(message: string, payload?: any): void {
	ipcRenderer.send(message, payload)
	console.log('msg', message)
}

