import { defHttp } from '@renderer/utils/http/axios/index'
const axios = defHttp.getAxios()

export function postActionLocal(url: string, parameter?: any) {
	return axios.post(url, parameter)
}

export function getActionLocal(url: string, parameter?: any) {
	return axios.get(url, parameter)
}
