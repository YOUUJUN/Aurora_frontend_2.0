import type { ICreateAxiosOptions, IAxiosStrategy } from '#renderer/http/axios'
import { ContentTypeEnum } from '@renderer/enums/http_enum'
import { EnvEnum } from '@renderer/enums/env_enum'

import VAxios from './axios_construction'

function createAxios(options: Partial<ICreateAxiosOptions>, configs: IAxiosStrategy) {
	return new VAxios(
		Object.assign(
			{},
			{
				baseURL: EnvEnum.baseUrl,
				headers: { 'Content-Type': ContentTypeEnum.JSON },
				withCredentials: false,
				timeout: 9000,
			},
			options,
		),
		configs,
	)
}

export const defHttp = createAxios(
	{},
	{
		if_handle_error_status: false,
		if_reduct_data_format: false,
	},
)
