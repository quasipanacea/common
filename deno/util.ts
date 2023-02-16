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
