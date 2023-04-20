import { z, path } from './mod.ts'

import * as util from './util.ts'
import * as t from './types.ts'

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

export function getAnchorsDir(): string {
	return path.join(util.getDataDir(), 'anchors')
}

export function getPodsDir(): string {
	return path.join(util.getDataDir(), 'pods')
}

export function getGroupsDir(): string {
	return path.join(util.getDataDir(), 'groups')
}

export function getCoversDir(): string {
	return path.join(util.getDataDir(), 'covers')
}

// file
export function getOrbsJsonFile(): string {
	return path.join(util.getDataDir(), 'orbs.json')
}

export function getLinksJsonFile(): string {
	return path.join(util.getDataDir(), 'links.json')
}

export function getAnchorsJsonFile(): string {
	return path.join(util.getDataDir(), 'anchors.json')
}

export function getPodsJsonFile(): string {
	return path.join(util.getDataDir(), 'pods.json')
}

export function getGroupsJsonFile(): string {
	return path.join(util.getDataDir(), 'groups.json')
}

export function getCoversJsonFile(): string {
	return path.join(util.getDataDir(), 'covers.json')
}

// dir (instance)
export function getOrbDir(uuid: string): string {
	return path.join(getOrbsDir(), uuid.slice(0, 2), uuid.slice(2))
}

export function getLinkDir(uuid: string): string {
	return path.join(getLinksDir(), uuid.slice(0, 2), uuid.slice(2))
}

export function getAnchorDir(uuid: string): string {
	return path.join(getAnchorsDir(), uuid.slice(0, 2), uuid.slice(2))
}

export function getPodDir(uuid: string): string {
	return path.join(getPodsDir(), uuid.slice(0, 2), uuid.slice(2))
}

export function getGroupDir(uuid: string): string {
	return path.join(getGroupsDir(), uuid.slice(0, 2), uuid.slice(2))
}

export function getCoverDir(uuid: string): string {
	return path.join(getCoversDir(), uuid.slice(0, 2), uuid.slice(2))
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

export async function getAnchorsJson(): Promise<t.SchemaAnchorsJson_t> {
	const jsonFile = getAnchorsJsonFile()
	let content
	try {
		content = await Deno.readTextFile(jsonFile)
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "anchors": {} }'
			await Deno.writeTextFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaAnchorsJson>(
		JSON.parse(content),
		t.SchemaAnchorsJson,
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

export async function getCoversJson(): Promise<t.SchemaCoversJson_t> {
	const jsonFile = getCoversJsonFile()
	let content
	try {
		content = await Deno.readTextFile(jsonFile)
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "covers": {} }'
			await Deno.writeTextFile(jsonFile, content)
		} else {
			throw err
		}
	}

	return util.validateSchema<typeof t.SchemaCoversJson>(
		JSON.parse(content),
		t.SchemaCoversJson,
	)
}
