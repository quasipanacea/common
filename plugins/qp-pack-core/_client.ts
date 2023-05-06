import * as OverviewByGroup from '@quasipanacea/overview-by-group/_client.js'
import * as OverviewDebug from '@quasipanacea/overview-debug/_client.js'
import * as OverviewGraph from '@quasipanacea/overview-graph/_client.js'
import * as OverviewGraphCytoscape from '@quasipanacea/overview-graph-cytoscape/_client.js'
import * as OverviewMindelixir from '@quasipanacea/overview-mindelixir/_client.js'

import * as PodChemical from '@quasipanacea/pod-chemical/_client.js'
import * as PodDebug from '@quasipanacea/pod-debug/_client.js'
import * as PodLatex from '@quasipanacea/pod-latex/_client.js'
import * as PodMarkdown from '@quasipanacea/pod-markdown/_client.js'
import * as PodPlaintext from '@quasipanacea/pod-plaintext/_client.js'

import * as ModelDefault from '../qp-model-default/_client.ts'
import * as ModelGroupSimple from '@quasipanacea/model-group-simple/_client.ts'

import * as GroupLine from '@quasipanacea/group-line/_client.js'

import * as ViewList from '@quasipanacea/view-list/_client.js'
import * as ViewMarkmap from '@quasipanacea/view-markmap/_client.js'

export * from './_isomorphic.ts'

export const overviewPlugins = [
	OverviewByGroup,
	OverviewDebug,
	OverviewGraph,
	OverviewGraphCytoscape,
	OverviewMindelixir,
]

export const podPlugins = [
	PodChemical,
	PodDebug,
	PodLatex,
	PodMarkdown,
	PodPlaintext,
]

export const modelPlugins = [ModelDefault, ModelGroupSimple]

export const groupPlugins = [GroupLine]

export const viewPlugins = [ViewList, ViewMarkmap]
