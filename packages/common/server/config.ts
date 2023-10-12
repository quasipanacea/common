// import * as path from 'node:path'
import * as path from 'node:path'
import * as fss from 'node:fs'
import * as os from 'node:os'
import { z } from 'zod'

const schema = z.object({
	documentsDir: z.string().min(1),
})

// export const config = await getProcessedConfig()

export function getConfig() {
	return getProcessedConfig()
}

function getProcessedConfig(): z.infer<typeof schema> {
	const config = readConfig()

	if (config.documentsDir.at(0) === '~') {
		const home = os.homedir()
		if (!home) throw new Error("Could not read environment variable 'HOME'")

		config.documentsDir = path.join(home, config.documentsDir.slice(1))
	}

	return config
}

function readConfig(): z.infer<typeof schema> {
	const configFile = getConfigFile()
	let config
	try {
		const configText = fss.readFileSync(configFile, 'utf-8')
		config = JSON.parse(configText)
	} catch (err) {
		if (
			err instanceof Error &&
			(err as NodeJS.ErrnoException).code === 'ENOENT'
		) {
			console.error(`Config file does not exist: ${configFile}`)
			process.exit(1)
		} else {
			throw err
		}
	}

	// const result = await schema.safeParseAsync(config)
	const result = schema.safeParse(config)
	if (!result.success) {
		console.error(result.error.flatten())
		throw new Error('Failed to validate schema')
	} else {
		return result.data
	}
}

function getConfigFile() {
	let xdgConfigHome = process.env.XDG_CONFIG_HOME
	if (!xdgConfigHome || xdgConfigHome[0] !== '/') {
		const home = os.homedir()
		if (!home) throw new Error("Could not read environment variable 'HOME'")

		xdgConfigHome = path.join(home, '.config')
	}

	return path.join(xdgConfigHome, 'quasipanacea', 'server.json')
}
