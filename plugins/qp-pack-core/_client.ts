import { init as OverviewDebug } from '@quasipanacea/overview-debug/_client.js'
import { init as OverviewGraph } from '@quasipanacea/overview-graph/_client.js'
import { init as OverviewMindelixir } from '@quasipanacea/overview-mindelixir/_client.js'

import { init as PodChemical } from '@quasipanacea/pod-chemical/_client.js'
import { init as PodDebug } from '@quasipanacea/pod-debug/_client.js'
import { init as PodLatex } from '@quasipanacea/pod-latex/_client.js'
import { init as PodMarkdown } from '@quasipanacea/pod-markdown/_client.js'
import { init as PodPlaintext } from '@quasipanacea/pod-plaintext/_client.js'

import { init as ModelDefault } from '@quasipanacea/model-default/_client.ts'
import { init as ModelFlat } from '@quasipanacea/model-flat/_client.ts'
import { init as ModelColors } from '@quasipanacea/model-colors/_client.ts'
import { init as ModelLine } from '@quasipanacea/model-line/_client.js'

import { init as ViewList } from '@quasipanacea/view-list/_client.js'
import { init as ViewMarkmap } from '@quasipanacea/view-markmap/_client.js'

export * from './_isomorphic.ts'

export async function initAll() {
	await Promise.all([
		OverviewDebug(),
		OverviewGraph(),
		OverviewMindelixir(),
		PodChemical(),
		PodDebug(),
		PodLatex(),
		PodMarkdown(),
		PodPlaintext(),
		ModelDefault(),
		ModelFlat(),
		ModelColors(),
		ModelLine(),
		ViewList(),
		ViewMarkmap()
	])
}
