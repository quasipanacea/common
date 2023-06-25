import { initTRPC } from '@trpc/server'

import { util, trpcServer } from '@quasipanacea/common/server/index.ts'

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
export const executeAllMiddleware = (trpc: any, hooks: any) => {
	return trpcServer.instance.middleware(async ({ ctx, input, next }: any) => {
		const uuid = input.uuid

		ctx.pod = await util.getPod(uuid)
		ctx.state = await hooks.makeState(ctx.pod)

		return next({
			ctx: {
				pod: ctx.pod,
				state: ctx.state,
			},
		})
	})
}
