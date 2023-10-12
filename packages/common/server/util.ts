import * as path from 'node:path'
import * as toml from '@ltd/j-toml'
import { z } from 'zod'

import { getConfig } from './config.ts'
import * as util from './util.ts'

export function jsonStringify(obj: Record<string, unknown>) {
	return JSON.stringify(obj, null, '\t')
}

export function tomlStringify(obj: Record<string, unknown>) {
	return toml.stringify(obj as any)
}

export function getPublicDir() {
	let public_dir = ''
	const env = process.env.QP_PUBLIC
	if (env) {
		public_dir = env
	} else {
		public_dir = path.join(process.cwd(), './public')
	}

	return public_dir
}

export function getDataDir() {
	// return path.join(config.documentsDir, 'data')
	return path.join(getConfig().documentsDir, 'data')
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

	constructor(obj: Record<string, unknown>, serializationType: 'json' | 'toml' = 'json') {
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
