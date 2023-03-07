import { TRPCError } from "@src/mod.ts";
import * as util2 from "@src/util/util.ts";

import { trpc } from "@common/trpc.ts";

export async function assertFileExists(filepath: string) {
	try {
		const f = await Deno.open(filepath, {
			createNew: true,
			write: true,
		});
		f.close();
	} catch (err: unknown) {
		if (!(err instanceof Deno.errors.AlreadyExists)) {
			throw err;
		}
	}
}

export async function run_bg(args: string[]) {
	console.log(args);
	// TODO: security
	const p = Deno.run({
		// cmd: ["systemd-run", "--user", ...args],
		cmd: ["bash", "-c", `setsid ${args.join(" ")}`],
		stderr: "piped",
		stdout: "piped",
	});
	const [status, stdout, stderr] = await Promise.all([
		p.status(),
		p.output(),
		p.stderrOutput(),
	]);
	console.log(
		new TextDecoder().decode(stdout),
		new TextDecoder().decode(stderr)
	);
	if (!status.success) {
		throw new Error("Failed to spawn background process:" + stdout + stderr);
	}
	p.close();
}

export const stuffPod = (trpc) => {
	return trpc.middleware(async ({ ctx, input, next }) => {
		if ((input as any).uuid) {
			const uuid = (input as any).uuid;

			ctx.pod = await util2.getPod(uuid);
		}

		if (!ctx.pod) {
			throw new TRPCError({ code: "PRECONDITION_FAILED" });
		}

		return next({
			ctx: {
				pod: ctx.pod,
			},
		});
	});
};

export const stuffState = (trpc, hooks) => {
	return trpc.middleware(async ({ ctx, next }) => {
		if (!ctx.pod) {
			throw new TRPCError({ code: "PRECONDITION_FAILED" });
		}

		if (hooks.makeState) {
			ctx.state = await hooks.makeState(ctx.pod);
		}

		if (!ctx.state) {
			throw new TRPCError({ code: "PRECONDITION_FAILED" });
		}

		return next({
			ctx: {
				state: ctx.state,
			},
		});
	});
};
