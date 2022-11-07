/**
 * better error handler for async func
 *
 * @param asyncFunc
 * @param params
 * @returns {Promise<*[]>}
 */

type TasyncFunc = (...params:any) => any[]

export async function errorCaptured(asyncFunc:TasyncFunc, ...params:any[]) {
	try {
		let res = await asyncFunc(...params)
		return [null, res]
	} catch (e) {
		return [e, null]
	}
}
