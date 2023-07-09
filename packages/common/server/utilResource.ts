import * as path from 'std/path/mod.ts'
import { z } from 'zod'
import * as pluginServer from './pluginServer.ts'

import * as t from '../types.ts'
import { utilPlugin, utilResource } from './index.ts'
import * as util from './util.ts'

// utility
async function runHook<
	PluginFamilySingular extends t.PluginFamilySingular_t,
	PluginFamilyPlural extends t.PluginFamilyPlural_t,
>(
	pluginFamilySingular: PluginFamilySingular,
	pluginFamilyPlural: PluginFamilyPlural,
	hook: 'add' | 'remove',
	uuid: string,
): Promise<void> {
	if (
		pluginFamilySingular === 'overview' ||
		pluginFamilySingular === 'theme' ||
		pluginFamilySingular === 'pack'
	) {
		throw new TypeError(
			`Failed to run the '${hook}' because the plugin family '${pluginFamilySingular}' is not supported.`,
		)
	}

	let resource
	const resourcesJson = await getResourcesJson(pluginFamilyPlural)
	for (const [uuidEntry, resourceEntry] of Object.entries(
		resourcesJson[pluginFamilyPlural],
	)) {
		if (uuid === uuidEntry) {
			resource = resourceEntry
			continue
		}
	}
	if (!resource) {
		// TODO it has already been removed
		// throw new Error(
		// 	`Failed to run the '${hook}' hook because the '${pluginFamilySingular}' resource with the uuid of '${uuid}' could not be found.`,
		// )
		return
	}

	const settingsJson = await getSettingsJson()
	const pluginId =
		settingsJson?.mimes?.[pluginFamilySingular]?.[resource.format]
	if (!pluginId) {
		throw new Error(
			`Failed to run the '${hook}' hook because a corresponding plugin id could not be found for the format '${resource.format}' (in uuid '${uuid}')`,
		)
	}

	const plugin = pluginServer.get<PluginFamilyPlural>(
		pluginFamilySingular,
		pluginId,
	)

	const dir = utilResource.getResourceDir(pluginFamilyPlural, uuid)
	if (!dir) {
		throw new Error(
			`dir is not defined for family ${pluginFamilyPlural}, ${uuid}`,
		)
	}

	if (hook === 'add') {
		if (plugin.hooks && plugin.hooks.makeState && plugin.hooks.onAdd) {
			const state = await plugin.hooks.makeState({
				dir,
				singular: resource,
			})
			await plugin.hooks.onAdd({ dir, state, singular: resource })
		}
	} else {
		if (plugin.hooks && plugin.hooks.makeState && plugin.hooks.onRemove) {
			const state = await plugin.hooks.makeState({
				dir,
				singular: resource,
			})
			await plugin.hooks.onRemove({ dir, state, singular: resource })
		}
	}
}

// generic
export async function resourceAdd(
	family: t.PluginFamilySingular_t,
	familyPlural: t.PluginFamilyPlural_t,
	input: Record<string, unknown>,
	rJsonFile: string,
	rJsonFn: () => Promise<Record<string, any>>,
): Promise<string> {
	const uuid = crypto.randomUUID()

	const rJson = await rJsonFn()
	rJson[familyPlural][uuid] = input
	await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson))

	const dir = getResourceDir(familyPlural, uuid)
	await Deno.mkdir(dir, { recursive: true })

	runHook(family, familyPlural, 'add', uuid)

	return uuid
}

export async function resourceRemove(
	family: t.PluginFamilySingular_t,
	familyPlural: t.PluginFamilyPlural_t,
	input: { uuid: string },
	rJsonFile: string,
	rJsonFn: () => Promise<Record<string, any>>,
): Promise<void> {
	runHook(family, familyPlural, 'remove', input.uuid)

	const dir = getResourceDir(familyPlural, input.uuid)
	await Deno.mkdir(dir, { recursive: true })

	const rJson = await rJsonFn()
	if (rJson[familyPlural][input.uuid]) {
		delete rJson[familyPlural][input.uuid]
	}
	await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson))
}

export async function resourceModify<Resource_t>(
	family: t.PluginFamilySingular_t,
	familyPlural: t.PluginFamilyPlural_t,
	input: {
		uuid: string
		data: Record<string, unknown>
	},
	rJsonFile: string,
	rJsonFn: () => Promise<Record<string, any>>,
): Promise<Resource_t> {
	const rJson = await rJsonFn()

	if (!(input.uuid in rJson[familyPlural])) {
		throw new Error(`Failed to find uuid ${input.uuid}`)
	}

	rJson[familyPlural][input.uuid] = {
		...rJson[familyPlural][input.uuid],
		...input.data,
	}
	await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson))

	return {
		...rJson[familyPlural][input.uuid],
		uuid: input.uuid,
	}
}

export async function resourceModifyExtra<Resource_t>(
	family: t.PluginFamilySingular_t,
	familyPlural: t.PluginFamilyPlural_t,
	input: {
		uuid: string
		field: string
		data: Record<string, unknown>
	},
	rJsonFile: string,
	rJsonFn: () => Promise<Record<string, any>>,
): Promise<Resource_t> {
	const rJson = await rJsonFn()

	if (!(input.uuid in rJson[familyPlural])) {
		throw new Error(`Failed to find uuid ${input.uuid}`)
	}

	if (!('extra' in rJson[familyPlural][input.uuid])) {
		rJson[familyPlural][input.uuid].extra = {}
	}

	if (!(input.field in rJson[familyPlural][input.uuid].extra)) {
		rJson[familyPlural][input.uuid].extra[input.field] = {}
	}

	rJson[familyPlural][input.uuid].extra[input.field] = {
		...rJson[familyPlural][input.uuid].extra[input.field],
		...input.data,
	}
	await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson))

	return {
		...rJson[familyPlural][input.uuid],
		uuid: input.uuid,
	}
}

export async function resourceList<Resource_t>(
	family: t.PluginFamilySingular_t,
	familyPlural: t.PluginFamilyPlural_t,
	rJsonFn: () => Promise<Record<string, any>>,
): Promise<Resource_t[]> {
	const rJson = await rJsonFn()

	const resources = []
	for (const [uuid, obj] of Object.entries<Record<string, unknown>>(
		rJson[familyPlural],
	)) {
		resources.push({
			...obj,
			uuid,
		})
	}

	return resources as Resource_t[]
}

// dir
export function getResourcesDir(resourceName: t.PluginFamilyPlural_t): string {
	return path.join(util.getDataDir(), resourceName)
}

export function getOrbsDir(): string {
	return getResourcesDir('orbs')
}

export function getLinksDir(): string {
	return getResourcesDir('links')
}

export function getModelsDir(): string {
	return getResourcesDir('models')
}

export function getModelViewsDir(): string {
	return getResourcesDir('modelviews')
}

export function getPodsDir(): string {
	return getResourcesDir('pods')
}

export function getPodviewsDir(): string {
	return getResourcesDir('podviews')
}

// dir (instance)
export function getResourceDir(
	resourceName: t.PluginFamilyPlural_t,
	uuid: string,
) {
	return path.join(
		getResourcesDir(resourceName),
		uuid.slice(0, 2),
		uuid.slice(2),
	)
}

export function getOrbDir(uuid: string): string {
	return getResourceDir('orbs', uuid)
}

export function getLinkDir(uuid: string): string {
	return getResourceDir('links', uuid)
}

export function getModelDir(uuid: string): string {
	return getResourceDir('models', uuid)
}

export function getModelviewDir(uuid: string): string {
	return getResourceDir('modelviews', uuid)
}

export function getPodDir(uuid: string): string {
	return getResourceDir('pods', uuid)
}

export function getPodviewDir(uuid: string): string {
	return getResourceDir('podviews', uuid)
}

// file
export function getResourcesJsonFile(resourceName: t.PluginFamilyPlural_t) {
	return path.join(util.getDataDir(), resourceName + '.json')
}

export function getOrbsJsonFile(): string {
	return getResourcesJsonFile('orbs')
}

export function getLinksJsonFile(): string {
	return getResourcesJsonFile('links')
}

export function getModelsJsonFile(): string {
	return getResourcesJsonFile('models')
}

export function getModelviewsJsonFile(): string {
	return getResourcesJsonFile('modelviews')
}

export function getPodsJsonFile(): string {
	return getResourcesJsonFile('pods')
}

export function getPodviewsJsonFile(): string {
	return getResourcesJsonFile('podviews')
}

export function getSettingsJsonFile(): string {
	return path.join(util.getDataDir(), 'settings.json')
}

export function getIndexJsonFile(): string {
	return path.join(util.getDataDir(), 'index.json')
}

// json
const Table = {
	// TODO
	overviews: t.SchemaOverviewsJson,
	orbs: t.SchemaOrbsJson,
	links: t.SchemaLinksJson,
	models: t.SchemaModelsJson,
	modelviews: t.SchemaModelviewsJson,
	pods: t.SchemaPodsJson,
	podviews: t.SchemaPodviewsJson,
	themes: t.SchemaThemesJson,
	pack: t.SchemaPacksJson,
}
export async function getResourcesJson<
	ResourceName extends t.PluginFamilyPlural_t,
>(
	resourceName: ResourceName,
	defaultContent: string = `{ "${resourceName}": {} }`,
) {
	const jsonFile = getResourcesJsonFile(resourceName)
	let content
	try {
		content = await Deno.readTextFile(jsonFile)
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = defaultContent
			await Deno.writeTextFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<(typeof Table)[ResourceName]>(
		JSON.parse(content),
		Table[resourceName],
	)
}

export async function getOrbsJson(): Promise<t.SchemaOrbsJson_t> {
	const jsonFile = getOrbsJsonFile()
	let content
	try {
		content = await Deno.readTextFile(jsonFile)
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "orbs": {} }'
			await Deno.writeTextFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaOrbsJson>(
		JSON.parse(content),
		t.SchemaOrbsJson,
	)
}

export async function getLinksJson(): Promise<t.SchemaLinksJson_t> {
	const jsonFile = getLinksJsonFile()
	let content
	try {
		content = await Deno.readTextFile(jsonFile)
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "links": {} }'
			await Deno.writeTextFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaLinksJson>(
		JSON.parse(content),
		t.SchemaLinksJson,
	)
}

export async function getModelsJson(): Promise<t.SchemaModelsJson_t> {
	const jsonFile = getModelsJsonFile()
	let content
	try {
		content = await Deno.readTextFile(jsonFile)
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "models": {} }'
			await Deno.writeTextFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaModelsJson>(
		JSON.parse(content),
		t.SchemaModelsJson,
	)
}

export async function getModelviewsJson(): Promise<t.SchemaModelviewsJson_t> {
	const jsonFile = getResourcesJsonFile('modelviews')
	let content
	try {
		content = await Deno.readTextFile(jsonFile)
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "modelviews": {} }'
			await Deno.writeTextFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaModelviewsJson>(
		JSON.parse(content),
		t.SchemaModelviewsJson,
	)
}

export async function getPodsJson(): Promise<t.SchemaPodsJson_t> {
	const jsonFile = getPodsJsonFile()
	let content
	try {
		content = await Deno.readTextFile(jsonFile)
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "pods": {} }'
			await Deno.writeTextFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaPodsJson>(
		JSON.parse(content),
		t.SchemaPodsJson,
	)
}

export async function getPodviewsJson(): Promise<t.SchemaPodviewsJson_t> {
	const jsonFile = getPodviewsJsonFile()
	let content
	try {
		content = await Deno.readTextFile(jsonFile)
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "podviews": {} }'
			await Deno.writeTextFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaPodviewsJson>(
		JSON.parse(content),
		t.SchemaPodviewsJson,
	)
}

export async function getSettingsJson(): Promise<t.SchemaSettingsJson_t> {
	const jsonFile = getSettingsJsonFile()
	let content
	try {
		content = await Deno.readTextFile(jsonFile)
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{}'
			await Deno.writeTextFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaSettingsJson>(
		JSON.parse(content),
		t.SchemaSettingsJson,
	)
}

export async function getIndexJson(): Promise<t.SchemaIndexJson_t> {
	const jsonFile = getIndexJsonFile()
	let content
	try {
		content = await Deno.readTextFile(jsonFile)
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "formats": {} }'
			await Deno.writeTextFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaIndexJson>(
		JSON.parse(content),
		t.SchemaIndexJson,
	)
}
