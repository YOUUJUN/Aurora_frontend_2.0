type TUseDataManageReturn<T> = {
	splitIntoChunks: (arr: T[], chunkSize: number) => T[][]
	splitIntoEqualChunks: (arr: T[], chunkSize: number) => T[][]
}

function useDataManage<T = any>(): TUseDataManageReturn<T> {
	//将数组分为若干份
	function splitIntoChunks<T>(arr: T[], chunkSize: number) {
		const chunks: T[][] = []
		let i = 0
		while (i < arr.length) {
			chunks.push(arr.slice(i, i + chunkSize))
			i += chunkSize
		}
		return chunks
	}

	//将数组分为若干等分
	function splitIntoEqualChunks<T>(arr: T[], chunkCount: number) {
		const chunkSize = Math.ceil(arr.length / chunkCount)
		return splitIntoChunks<T>(arr, chunkSize)
	}

	return {
		splitIntoChunks,
		splitIntoEqualChunks,
	}
}

export { useDataManage }
