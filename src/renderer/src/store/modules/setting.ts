import type { SettingInfo } from '#renderer/store'

import { defineStore } from 'pinia'
import { store } from '@renderer/store'

export const useSettingStore = defineStore({
	id: 'setting',
	state: (): SettingInfo => ({
		theme: '',
		accentColor: '',
	}),
})

export function useSettingStoreWithOut() {
	return useSettingStore(store)
}
