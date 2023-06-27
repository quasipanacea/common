import { initTRPC } from '@trpc/server'

import {
	utilPlugin,
	utilResource,
	trpcServer,
} from '@quasipanacea/common/server/index.ts'

export async function assertFileExists(filepath: string) {
	try {
		const f = await Deno.open(filepath, {
			createNew: true,
			write: true,
		})
		f.close()
	} catch (err: unknown) {
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

export function useTrpc<State extends Record<string, unknown>>() {
	const inferenceOnlyTrpc = initTRPC
		.context<{
			state: State
		}>()
		.create()

	// TODO
	return trpcServer.instance as unknown as typeof inferenceOnlyTrpc
}

/**
 * Note: 'trpc' must be passed since it contains custom State
 */
export const executeAllMiddleware = (trpc, hooks) => {
	return trpcServer.instance.middleware(async ({ ctx, input, next }) => {
		const uuid = input.uuid

		ctx.dir = await utilResource.getResourceDir('pods', uuid)
		const json = await utilResource.getResourcesJson('pods')
		for (const [rUuid, resource] of Object.entries(json['pods'])) {
			if (uuid === rUuid) {
				ctx.pod = resource
				continue
			}
		}
		ctx.state = await hooks.makeState({ dir: ctx.dir, pod: ctx.pod })

		return next({
			ctx: {
				dir: ctx.dir,
				pod: ctx.pod,
				state: ctx.state,
			},
		})
	})
}
