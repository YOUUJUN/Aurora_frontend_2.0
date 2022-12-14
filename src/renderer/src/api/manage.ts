import request from '@renderer/utils/localhttp'
export function postActionLocal(url: string, parameter?:any) {
	return request({
		url,
		method: 'post',
		data: parameter,
	})
}

export function getActionLocal(url: string, parameter) {
	return request({
		url,
		method: 'get',
		params: parameter,
	})
}
