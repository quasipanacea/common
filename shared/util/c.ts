export function useApi<T>(api: unknown): T {
	return api as T;
}

