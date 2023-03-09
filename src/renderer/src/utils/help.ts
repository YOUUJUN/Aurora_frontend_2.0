import { isObject } from './is'

type TErrorCaptured = [unknown | null, any | null]

/**
 * better error handler for async func
 *
 * @param asyncFunc
 * @param params
 * @returns {Promise<*[]>}
 */

export async function errorCaptured(asyncFunc: Function, ...params: any[]): Promise<TErrorCaptured> {
	try {
		const res = await asyncFunc(...params)
		return [null, res]
	} catch (err) {
		return [err, null]
	}
}

// 深度合并
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
	let key: string
	for (key in target) {
		src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])
	}
	return src
}
