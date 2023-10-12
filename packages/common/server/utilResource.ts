// import * as path from 'node:path'
import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import { z } from 'zod'
import * as pluginServer from './pluginServer.ts'

import * as t from '../types.ts'
import { utilPlugin, utilResource } from './index.ts'
import * as util from './util.ts'

// utility
async function runHook<
	PluginFamilySingular extends t.ResourceNamesSingular_t,
	PluginFamilyPlural extends t.ResourceNamesPlural_t,
>(
	pluginFamilySingular: PluginFamilySingular,
	pluginFamilyPlural: PluginFamilyPlural,
	hook: 'add' | 'remove',
	uuid: string,
): Promise<void> {
	// TODO
	console.info('HOOKS ARE NOT IMPLEMENTED')

	// if (
	// 	pluginFamilySingular === 'overview' ||
	// 	pluginFamilySingular === 'theme' ||
	// 	pluginFamilySingular === 'pack'
	// ) {
	// 	throw new TypeError(
	// 		`Failed to run the '${hook}' because the plugin family '${pluginFamilySingular}' is not supported.`,
	// 	)
	// }

	// let resource
	// const resourcesJson = await getResourcesJson(pluginFamilyPlural)
	// for (const [uuidEntry, resourceEntry] of Object.entries(
	// 	resourcesJson[pluginFamilyPlural],
	// )) {
	// 	if (uuid === uuidEntry) {
	// 		resource = resourceEntry
	// 		continue
	// 	}
	// }
	// if (!resource) {
	// 	// TODO it has already been removed
	// 	// throw new Error(
	// 	// 	`Failed to run the '${hook}' hook because the '${pluginFamilySingular}' resource with the uuid of '${uuid}' could not be found.`,
	// 	// )
	// 	return
	// }

	// const settingsJson = await getSettingsJson()
	// const pluginId = settingsJson?.mimes?.[pluginFamilySingular]?.[resource.format]
	// if (!pluginId) {
	// 	throw new Error(
	// 		`Failed to run the '${hook}' hook because a corresponding plugin id could not be found for the format '${resource.format}' (in uuid '${uuid}')`,
	// 	)
	// }

	// const plugin = pluginServer.get<PluginFamilyPlural>(pluginFamilySingular, pluginId)

	// const dir = utilResource.getResourceDir(pluginFamilyPlural, uuid)
	// if (!dir) {
	// 	throw new Error(`dir is not defined for family ${pluginFamilyPlural}, ${uuid}`)
	// }

	// if (hook === 'add') {
	// 	if (plugin.hooks && plugin.hooks.makeState && plugin.hooks.onAdd) {
	// 		const state = await plugin.hooks.makeState({
	// 			dir,
	// 			singular: resource,
	// 		})
	// 		await plugin.hooks.onAdd({ dir, state, singular: resource })
	// 	}
	// } else {
	// 	if (plugin.hooks && plugin.hooks.makeState && plugin.hooks.onRemove) {
	// 		const state = await plugin.hooks.makeState({
	// 			dir,
	// 			singular: resource,
	// 		})
	// 		await plugin.hooks.onRemove({ dir, state, singular: resource })
	// 	}
	// }
}

// generic
export async function resourceAdd(
	family: t.ResourceNamesSingular_t,
	familyPlural: t.ResourceNamesPlural_t,
	input: Record<string, unknown>,
	rJsonFile: string,
	rJsonFn: () => Promise<Record<string, any>>,
): Promise<string> {
	const uuid = crypto.randomUUID()

	const rJson = await rJsonFn()
	rJson[familyPlural][uuid] = input
	await fs.writeFile(rJsonFile, util.jsonStringify(rJson))

	const dir = getResourceDir(familyPlural, uuid)
	await fs.mkdir(dir, { recursive: true })

	runHook(family, familyPlural, 'add', uuid)

	return uuid
}

export async function resourceRemove(
	family: t.ResourceNamesSingular_t,
	familyPlural: t.ResourceNamesPlural_t,
	input: { uuid: string },
	rJsonFile: string,
	rJsonFn: () => Promise<Record<string, any>>,
): Promise<void> {
	runHook(family, familyPlural, 'remove', input.uuid)

	const dir = getResourceDir(familyPlural, input.uuid)
	await fs.mkdir(dir, { recursive: true })

	const rJson = await rJsonFn()
	if (rJson[familyPlural][input.uuid]) {
		delete rJson[familyPlural][input.uuid]
	}
	await fs.writeFile(rJsonFile, util.jsonStringify(rJson))
}

export async function resourceModify<Resource_t>(
	family: t.ResourceNamesSingular_t,
	familyPlural: t.ResourceNamesPlural_t,
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
	await fs.writeFile(rJsonFile, util.jsonStringify(rJson))

	return {
		...rJson[familyPlural][input.uuid],
		uuid: input.uuid,
	}
}

export async function resourceModifyExtra<Resource_t>(
	family: t.ResourceNamesSingular_t,
	familyPlural: t.ResourceNamesPlural_t,
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
	await fs.writeFile(rJsonFile, util.jsonStringify(rJson))

	return {
		...rJson[familyPlural][input.uuid],
		uuid: input.uuid,
	}
}

export async function resourceList<Resource_t>(
	family: t.ResourceNamesSingular_t,
	familyPlural: t.ResourceNamesPlural_t,
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
export function getResourcesDir(resourceName: t.ResourceNamesPlural_t): string {
	return path.join(util.getDataDir(), resourceName)
}

export function getModelsDir(): string {
	return getResourcesDir('models')
}

export function getPodsDir(): string {
	return getResourcesDir('pods')
}

// dir (instance)
export function getResourceDir(resourceName: t.ResourceNamesPlural_t, uuid: string) {
	return path.join(getResourcesDir(resourceName), uuid.slice(0, 2), uuid.slice(2))
}

export function getModelDir(uuid: string): string {
	return getResourceDir('models', uuid)
}

export function getPodDir(uuid: string): string {
	return getResourceDir('pods', uuid)
}

// file
export function getResourcesJsonFile(resourceName: t.ResourceNamesPlural_t) {
	return path.join(util.getDataDir(), resourceName + '.json')
}

export function getModelsJsonFile(): string {
	return getResourcesJsonFile('models')
}

export function getPodsJsonFile(): string {
	return getResourcesJsonFile('pods')
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
	models: t.SchemaModelsJson,
	pods: t.SchemaPodsJson,
}
export async function getResourcesJson<ResourceName extends t.ResourceNamesPlural_t>(
	resourceName: ResourceName,
	defaultContent: string = `{ "${resourceName}": {} }`,
) {
	const jsonFile = getResourcesJsonFile(resourceName)
	let content
	try {
		content = await fs.readFile(jsonFile, 'utf-8')
	} catch (err) {
		if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'ENOENT') {
			content = defaultContent
			await fs.writeFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<(typeof Table)[ResourceName]>(
		JSON.parse(content),
		Table[resourceName],
	)
}

export async function getModelsJson(): Promise<t.SchemaModelsJson_t> {
	const jsonFile = getModelsJsonFile()
	let content
	try {
		content = await fs.readFile(jsonFile, 'utf-8')
	} catch (err) {
		if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'ENOENT') {
			content = '{ "models": {} }'
			await fs.writeFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaModelsJson>(
		JSON.parse(content),
		t.SchemaModelsJson,
	)
}

export async function getPodsJson(): Promise<t.SchemaPodsJson_t> {
	const jsonFile = getPodsJsonFile()
	let content
	try {
		content = await fs.readFile(jsonFile, 'utf-8')
	} catch (err) {
		if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'ENOENT') {
			content = '{ "pods": {} }'
			await fs.writeFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaPodsJson>(
		JSON.parse(content),
		t.SchemaPodsJson,
	)
}

export async function getSettingsJson(): Promise<t.SchemaSettingsJson_t> {
	const jsonFile = getSettingsJsonFile()
	let content
	try {
		content = await fs.readFile(jsonFile, 'utf-8')
	} catch (err) {
		if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'ENOENT') {
			content = '{}'
			await fs.writeFile(jsonFile, content)
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
		content = await fs.readFile(jsonFile, 'utf-8')
	} catch (err) {
		if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'ENOENT') {
			content = '{ "formats": {} }'
			await fs.writeFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaIndexJson>(
		JSON.parse(content),
		t.SchemaIndexJson,
	)
}
