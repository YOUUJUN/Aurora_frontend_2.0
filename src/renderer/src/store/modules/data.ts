import { defineStore } from 'pinia'
import { store } from '@renderer/store'

interface IDataState {
	buffData: TProcessedBuffData
}

export const useDataStore = defineStore({
	id: 'data',
	state: (): IDataState => ({
		buffData: [],
	}),

	actions: {
		setBuffData(data: TProcessedBuffData): void {
			console.log('data', data)
			this.buffData = data
		},

		reverseBuffData(){
			this.buffData.reverse()
		}
	},
})

export function useDataStoreWithout() {
	return useDataStore(store)
}
