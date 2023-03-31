import * as CoverList from '@quazipanacea/cover-list/_client.js'
import * as CoverMarkmap from '@quazipanacea/cover-markmap/_client.js'

import * as GroupLine from '@quazipanacea/group-line/_client.js'

import * as OverviewByGroup from '@quazipanacea/overview-by-group/_client.js'
import * as OverviewDebug from '@quazipanacea/overview-debug/_client.js'
import * as OverviewGraphCytoscape from '@quazipanacea/overview-graph-cytoscape/_client.js'
import * as OverviewGraphVis from '@quazipanacea/overview-graph-vis/_client.js'
import * as OverviewMindelixir from '@quazipanacea/overview-mindelixir/_client.js'

import * as PodChemical from '@quazipanacea/pod-chemical/_client.js'
import * as PodDebug from '@quazipanacea/pod-debug/_client.js'
import * as PodLatex from '@quazipanacea/pod-latex/_client.js'
import * as PodMarkdown from '@quazipanacea/pod-markdown/_client.js'
import * as PodPlaintext from '@quazipanacea/pod-plaintext/_client.js'

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
