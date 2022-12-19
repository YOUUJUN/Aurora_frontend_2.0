import { defineStore } from 'pinia'
import { store } from '@renderer/store'

interface IDataState {
	buffData: any[]
}

export const useDataStore = defineStore({
	id: 'data',
	state: (): IDataState => ({
		buffData: [],
	}),

	actions: {
		setBuffData(data: any[]): void {
            console.log('data', data)
			this.buffData = data
		},
	},
})

export function useDataStoreWithout() {
	return useDataStore(store)
}
