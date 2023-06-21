import { z, path } from '../mod.ts'

import * as t from '../types.ts'
import * as util from './util.ts'

// generic
export async function resourceAdd(
	input: Record<string, unknown>,
	rJsonFile: string,
	rJsonFn: () => Promise<Record<string, any>>,
	key: string,
): Promise<string> {
	const uuid = crypto.randomUUID()

	const rJson = await rJsonFn()
	rJson[key][uuid] = {
		...input,
	}
	await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson))

	return uuid
}

export async function resourceRemove(
	input: { uuid: string },
	rJsonFile: string,
	rJsonFn: () => Promise<Record<string, any>>,
	key: string,
): Promise<void> {
	const rJson = await rJsonFn()

	if (rJson[key][input.uuid]) {
		delete rJson[key][input.uuid]
	}
	await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson))
}

export async function resourceModify<Resource_t>(
	input: {
		uuid: string
		data: Record<string, unknown>
	},
	rJsonFile: string,
	rJsonFn: () => Promise<Record<string, any>>,
	key: string,
): Promise<Resource_t> {
	const rJson = await rJsonFn()

	if (!(input.uuid in rJson[key])) {
		throw new Error(`Failed to find uuid ${input.uuid}`)
	}

	rJson[key][input.uuid] = {
		...rJson[key][input.uuid],
		...input.data,
	}
	await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson))

	return {
		...rJson[key][input.uuid],
		uuid: input.uuid,
	}
}

export async function resourceModifyExtra<Resource_t>(
	input: {
		uuid: string
		field: string
		data: Record<string, unknown>
	},
	rJsonFile: string,
	rJsonFn: () => Promise<Record<string, any>>,
	key: string,
): Promise<Resource_t> {
	const rJson = await rJsonFn()

	if (!(input.uuid in rJson[key])) {
		throw new Error(`Failed to find uuid ${input.uuid}`)
	}

	if (!('extra' in rJson[key][input.uuid])) {
		rJson[key][input.uuid].extra = {}
	}

	if (!(input.field in rJson[key][input.uuid].extra)) {
		rJson[key][input.uuid].extra[input.field] = {}
	}

	rJson[key][input.uuid].extra[input.field] = {
		...rJson[key][input.uuid].extra[input.field],
		...input.data,
	}
	await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson))

	return {
		...rJson[key][input.uuid],
		uuid: input.uuid,
	}
}

export async function resourceList<Resource_t>(
	rJsonFn: () => Promise<Record<string, any>>,
	key: string,
): Promise<Resource_t[]> {
	const rJson = await rJsonFn()

	const resources = []
	for (const [uuid, obj] of Object.entries<Record<string, unknown>>(
		rJson[key],
	)) {
		resources.push({
			...obj,
			uuid,
		})
	}

	return resources as Resource_t[]
}

// dir
export function getOrbsDir(): string {
	return path.join(util.getDataDir(), 'orbs')
}

export function getLinksDir(): string {
	return path.join(util.getDataDir(), 'links')
}

export function getModelsDir(): string {
	return path.join(util.getDataDir(), 'models')
}

export function getPodsDir(): string {
	return path.join(util.getDataDir(), 'pods')
}

export function getGroupsDir(): string {
	return path.join(util.getDataDir(), 'groups')
}

export function getViewsDir(): string {
	return path.join(util.getDataDir(), 'views')
}

// file
export function getOrbsJsonFile(): string {
	return path.join(util.getDataDir(), 'orbs.json')
}

export function getLinksJsonFile(): string {
	return path.join(util.getDataDir(), 'links.json')
}

export function getModelsJsonFile(): string {
	return path.join(util.getDataDir(), 'models.json')
}

export function getPodsJsonFile(): string {
	return path.join(util.getDataDir(), 'pods.json')
}

export function getGroupsJsonFile(): string {
	return path.join(util.getDataDir(), 'groups.json')
}

export function getViewsJsonFile(): string {
	return path.join(util.getDataDir(), 'views.json')
}

// dir (instance)
export function getOrbDir(uuid: string): string {
	return path.join(getOrbsDir(), uuid.slice(0, 2), uuid.slice(2))
}

export function getLinkDir(uuid: string): string {
	return path.join(getLinksDir(), uuid.slice(0, 2), uuid.slice(2))
}

export function getModelDir(uuid: string): string {
	return path.join(getModelsDir(), uuid.slice(0, 2), uuid.slice(2))
}

export function getPodDir(uuid: string): string {
	return path.join(getPodsDir(), uuid.slice(0, 2), uuid.slice(2))
}

export function getGroupDir(uuid: string): string {
	return path.join(getGroupsDir(), uuid.slice(0, 2), uuid.slice(2))
}

export function getViewDir(uuid: string): string {
	return path.join(getViewsDir(), uuid.slice(0, 2), uuid.slice(2))
}

// json
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

export async function getGroupsJson(): Promise<t.SchemaGroupsJson_t> {
	const jsonFile = getGroupsJsonFile()
	let content
	try {
		content = await Deno.readTextFile(jsonFile)
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "groups": {} }'
			await Deno.writeTextFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaGroupsJson>(
		JSON.parse(content),
		t.SchemaGroupsJson,
	)
}

export async function getViewsJson(): Promise<t.SchemaViewsJson_t> {
	const jsonFile = getViewsJsonFile()
	let content
	try {
		content = await Deno.readTextFile(jsonFile)
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "views": {} }'
			await Deno.writeTextFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaViewsJson>(
		JSON.parse(content),
		t.SchemaViewsJson,
	)
}
