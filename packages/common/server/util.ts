import * as path from 'std/path/mod.ts'
import * as toml from 'std/toml/mod.ts'
import { z } from 'zod'

import { config } from './config.ts'
import * as util from './util.ts'

export function jsonStringify(obj: Record<string, unknown>) {
	return JSON.stringify(obj, null, '\t')
}

export function tomlStringify(obj: Record<string, unknown>) {
	return toml.stringify(obj)
}

export function getPublicDir() {
	let public_dir = ''
	const env = Deno.env.get('QP_PUBLIC')
	if (env) {
		public_dir = env
	} else {
		public_dir = path.join(Deno.cwd(), './public')
	}

	return public_dir
}

export function getDataDir() {
	return path.join(config.documentsDir, 'data')
}

export function validateSchema<Schema extends z.AnyZodObject>(
	obj: Record<string, unknown>,
	schema: z.AnyZodObject,
): z.infer<Schema> {
	const result = schema.strict().safeParse(obj)
	if (!result.success) {
		throw new util.JSONError(result.error.format())
	}
	return result.data
}

export class JSONError extends Error {
	obj: Record<string, unknown>

	constructor(
		obj: Record<string, unknown>,
		serializationType: 'json' | 'toml' = 'json',
	) {
		let str = '???'
		switch (serializationType) {
			case 'json':
				str = jsonStringify(obj)
				break
			case 'toml':
				str = tomlStringify(obj)
		}

		super(`JSON Error: ${str}`)

		this.name = this.constructor.name
		this.obj = obj
	}
}
