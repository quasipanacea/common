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
	console.log(args)
	// TODO: security
	const p = Deno.run({
		// cmd: ["systemd-run", "--user", ...args],
		cmd: ['bash', '-c', `setsid ${args.join(' ')}`],
		stderr: 'piped',
		stdout: 'piped',
	})
	const [status, stdout, stderr] = await Promise.all([
		p.status(),
		p.output(),
		p.stderrOutput(),
	])
	console.log(
		new TextDecoder().decode(stdout),
		new TextDecoder().decode(stderr),
	)
	if (!status.success) {
		throw new Error('Failed to spawn background process:' + stdout + stderr)
	}
	p.close()
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

export function setupCurrentAltMenu(boundaryEl: any, action: () => void) {}
