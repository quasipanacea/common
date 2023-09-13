import * as t from '../types.ts'
import type cytoscape from 'cytoscape'

export async function getPluginFromFormat(
	api,
	format: string,
	pluginFamily: t.PluginFamilySingular_t,
) {
	const indexJson = await api.core.settingsGet.query()
	const pluginId = indexJson.mimes[pluginFamily][format]

	return pluginId
}
