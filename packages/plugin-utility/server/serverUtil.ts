import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'

import { t } from '@quasipanacea/common/index.ts'
import {
	utilPlugin,
	utilResource,
	trpcServer,
} from '@quasipanacea/common/server/index.ts'

export async function assertFileExists(filepath: string, content?: string) {
	try {
		const f = await Deno.open(filepath, {
			createNew: true,
			write: true,
		})
		if (content) {
			await f.write(new TextEncoder().encode(content))
		}
		f.close()
	} catch (err) {
		if (!(err instanceof Deno.errors.AlreadyExists)) {
			throw err
		}
	}
}

export async function run_bg(args: string[]) {
	// TODO: security
	const command = new Deno.Command('bash', {
		args: ['-c', `setsid ${args.join(' ')}`],
		stdout: 'piped',
		stderr: 'piped',
	})
	const { success, code, stdout, stderr } = await command.output()

	console.log(
		new TextDecoder().decode(stdout),
		new TextDecoder().decode(stderr),
	)
	if (!success) {
		throw new Error(
			`Failed to spawn background process (code: ${code}):` + stdout + stderr,
		)
	}
}

// TODO
export function useTrpc<State extends Record<string, unknown>>() {
	const inferenceOnlyTrpc = initTRPC
		.context<{
			state: State
		}>()
		.create()

	return trpcServer.instance as unknown as typeof inferenceOnlyTrpc
}

export function yieldPluginProcedure<
	V extends t.Hooks<'pod', W>,
	U extends object = object,
	T extends ReturnType<
		ReturnType<typeof initTRPC.context<U>>['create']
	> = ReturnType<ReturnType<typeof initTRPC.context<U>>['create']>,
	W extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
>(trpcInstance: T, hooks: V) {
	return trpcInstance.procedure
		.input(
			z.object({
				uuid: t.Uuid,
			}),
		)
		.use(async ({ ctx, input, next }) => {
			const uuid = input.uuid
			const pluginFamily = 'pods'

			const resourceDir = await utilResource.getResourceDir(pluginFamily, uuid)
			let resourceData
			{
				const json = await utilResource.getResourcesJson(pluginFamily)
				for (const [rUuid, rData] of Object.entries(json[pluginFamily])) {
					if (uuid === rUuid) {
						resourceData = rData
						continue
					}
				}
				if (!resourceData) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: `Failed to find uuid ${input.uuid} for family ${pluginFamily}`,
					})
				}
			}

			let state = {}
			if (hooks.makeState) {
				state = await hooks.makeState({
					dir: resourceDir,
					pod: resourceData,
				})
			}

			return next({
				ctx: {
					dir: resourceDir,
					pod: resourceData,
					state,
				},
			})
		})
}

export const pluginProcedure = trpcServer.instance.procedure
	.input(
		z
			.object({
				uuid: t.Uuid,
			})
			.passthrough(),
	)
	.use(async ({ ctx, input, next }) => {
		const uuid = input.uuid
		const pluginFamily = 'pods'

		const resourceDir = await utilResource.getResourceDir(pluginFamily, uuid)
		let resourceData
		{
			const json = await utilResource.getResourcesJson(pluginFamily)
			for (const [rUuid, rData] of Object.entries(json[pluginFamily])) {
				if (uuid === rUuid) {
					resourceData = rData
					continue
				}
			}
			if (!resourceData) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: `Failed to find uuid ${input.uuid} for family ${pluginFamily}`,
				})
			}
		}

		const state = await hooks.makeState({ dir: resourceDir, pod: resourceData })

		return next({
			ctx: {
				dir: resourceDir,
				pod: resourceData,
				state: state,
			},
		})
	})

/**
 * Note: 'trpc' must be passed since it contains custom State
 */
export const executeAllMiddleware = (trpc, hooks) => {
	return trpcServer.instance.middleware(async ({ ctx, input, next }) => {
		const uuid = input.uuid
		const pluginFamily = 'pods'

		const resourceDir = await utilResource.getResourceDir(pluginFamily, uuid)
		let resourceData
		{
			const json = await utilResource.getResourcesJson(pluginFamily)
			for (const [rUuid, rData] of Object.entries(json[pluginFamily])) {
				if (uuid === rUuid) {
					resourceData = rData
					continue
				}
			}
			if (!resourceData) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: `Failed to find uuid ${input.uuid} for family ${pluginFamily}`,
				})
			}
		}

		const state = await hooks.makeState({ dir: resourceDir, pod: resourceData })

		return next({
			ctx: {
				dir: resourceDir,
				pod: resourceData,
				state: state,
			},
		})
	})
}
