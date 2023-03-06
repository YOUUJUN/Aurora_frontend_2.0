export const EnvEnum = {
	baseUrl: import.meta.env.RENDERER_VITE_BASE_URL as unknown as string,
	indexUrl: import.meta.env.RENDERER_VITE_INDEX_URL as unknown as string,
	apiBaseUrl: import.meta.env.RENDERER_VITE_API_BASE_URL as unknown as string,
	servicePath: import.meta.env.RENDERER_VITE_ABSOLUTE_PATH as unknown as string,
	socketUrl: import.meta.env.RENDERER_VITE_SOCKET_BASE_URL as unknown as string,
}
