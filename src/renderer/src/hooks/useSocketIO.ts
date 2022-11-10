import type { Socket, SocketOptions } from 'socket.io-client'

import { io } from 'socket.io-client'

export interface IUseSocketIOOptions extends SocketOptions {}

export interface IUseSocketIOReturn {
	socket: Socket
}

export function useSocketIO(url: string, options?: IUseSocketIOOptions): IUseSocketIOReturn {
	const socket = io(url, options)

	return {
		socket,
	}
}
