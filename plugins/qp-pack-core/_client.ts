import * as CoverList from '@quasipanacea/cover-list/_client.js'
import * as CoverMarkmap from '@quasipanacea/cover-markmap/_client.js'

import * as GroupLine from '@quasipanacea/group-line/_client.js'

import * as OverviewByGroup from '@quasipanacea/overview-by-group/_client.js'
import * as OverviewDebug from '@quasipanacea/overview-debug/_client.js'
import * as OverviewGraphCytoscape from '@quasipanacea/overview-graph-cytoscape/_client.js'
import * as OverviewGraphVis from '@quasipanacea/overview-graph-vis/_client.js'
import * as OverviewMindelixir from '@quasipanacea/overview-mindelixir/_client.js'

import * as PodChemical from '@quasipanacea/pod-chemical/_client.js'
import * as PodDebug from '@quasipanacea/pod-debug/_client.js'
import * as PodLatex from '@quasipanacea/pod-latex/_client.js'
import * as PodMarkdown from '@quasipanacea/pod-markdown/_client.js'
import * as PodPlaintext from '@quasipanacea/pod-plaintext/_client.js'

export const coverPlugins = [CoverList, CoverMarkmap]

export const groupPlugins = [GroupLine]

export const overviewPlugins = [
	OverviewByGroup,
	OverviewDebug,
	OverviewGraphCytoscape,
	OverviewGraphVis,
	OverviewMindelixir,
]

export const podPlugins = [
	PodChemical,
	PodDebug,
	PodLatex,
	PodMarkdown,
	PodPlaintext,
]
