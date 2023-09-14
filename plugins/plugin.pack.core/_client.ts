import { init as OverviewBasic } from '@quasipanacea/plugin-overview-basic/_client.js'
import { init as OverviewDebug } from '@quasipanacea/plugin-overview-debug/_client.js'
import { init as OverviewGraph } from '@quasipanacea/plugin-overview-graph/_client.js'

import { init as ModelColors } from '@quasipanacea/plugin.model.colors.controller/_client.js'
import { init as ModelDefault } from '@quasipanacea/plugin.model.default.controller/_client.js'
import { init as ModelFlat } from '@quasipanacea/plugin.model.flat.controller/_client.js'
import { init as ModelGraph } from '@quasipanacea/plugin.model.graph.controller/_client.js'
import { init as ModelLine } from '@quasipanacea/plugin.model.line.controller/_client.js'
import { init as ModelList } from '@quasipanacea/plugin.model.list.controller/_client.js'
import { init as ModelMarkmap } from '@quasipanacea/plugin.model.markmap.controller/_client.js'

import { init as ModelviewColors } from '@quasipanacea/plugin.model.colors.view/_client.js'
import { init as ModelviewDefault } from '@quasipanacea/plugin.model.default.view/_client.js'
import { init as ModelviewFlat } from '@quasipanacea/plugin.model.flat.view/_client.js'
import { init as ModelviewGraph } from '@quasipanacea/plugin.model.graph.view/_client.js'
import { init as ModelviewLine } from '@quasipanacea/plugin.model.line.view/_client.js'
import { init as ModelviewList } from '@quasipanacea/plugin.model.list.view/_client.js'
import { init as ModelviewMarkmap } from '@quasipanacea/plugin.model.markmap.view/_client.js'

import { init as PodChemical } from '@quasipanacea/plugin.pod.chemical.controller/_client.js'
import { init as PodDebug } from '@quasipanacea/plugin.pod.debug.controller/_client.js'
import { init as PodExcalidraw } from '@quasipanacea/plugin.pod.excalidraw.controller/_client.js'
import { init as PodFlashcard } from '@quasipanacea/plugin.pod.flashcard.controller/_client.js'
import { init as PodLatex } from '@quasipanacea/plugin.pod.latex.controller/_client.js'
import { init as PodMarkdown } from '@quasipanacea/plugin.pod.markdown.controller/_client.js'
import { init as PodPlaintext } from '@quasipanacea/plugin.pod.plaintext.controller/_client.js'

import { init as PodviewChemical } from '@quasipanacea/plugin.pod.chemical.view/_client.js'
import { init as PodviewDebug } from '@quasipanacea/plugin.pod.debug.view/_client.js'
import { init as PodviewExcalidraw } from '@quasipanacea/plugin.pod.excalidraw.view/_client.js'
import { init as PodviewFlashcard } from '@quasipanacea/plugin.pod.flashcard.view/_client.js'
import { init as PodviewLatex } from '@quasipanacea/plugin.pod.latex.view/_client.js'
import { init as PodviewMilkdown } from '@quasipanacea/plugin.pod.markdown.view.milkdown/_client.js'
import { init as PodviewPlaintext } from '@quasipanacea/plugin.pod.plaintext.view/_client.js'
import { init as PodviewRemark } from '@quasipanacea/plugin.pod.markdown.view.remark/_client.js'

export { metadata } from './_isomorphic.ts'

export async function initAll() {
	await Promise.all([
		OverviewBasic(),
		OverviewDebug(),
		OverviewGraph(),

		ModelColors(),
		ModelDefault(),
		ModelFlat(),
		ModelGraph(),
		ModelLine(),
		ModelList(),
		ModelMarkmap(),

		ModelviewColors(),
		ModelviewDefault(),
		ModelviewFlat(),
		ModelviewGraph(),
		ModelviewLine(),
		ModelviewList(),
		ModelviewMarkmap(),

		PodChemical(),
		PodDebug(),
		PodExcalidraw(),
		PodFlashcard(),
		PodLatex(),
		PodMarkdown(),
		PodPlaintext(),

		PodviewChemical(),
		PodviewDebug(),
		PodviewExcalidraw(),
		PodviewFlashcard(),
		PodviewLatex(),
		PodviewMilkdown(),
		PodviewPlaintext(),
		PodviewRemark(),
	])
}
