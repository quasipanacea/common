import * as OverviewDebug from '@quasipanacea/overview-debug/_client.js'
import * as OverviewGraph from '@quasipanacea/overview-graph/_client.js'
import * as OverviewMindelixir from '@quasipanacea/overview-mindelixir/_client.js'

import * as PodChemical from '@quasipanacea/pod-chemical/_client.js'
import * as PodDebug from '@quasipanacea/pod-debug/_client.js'
import * as PodLatex from '@quasipanacea/pod-latex/_client.js'
import * as PodMarkdown from '@quasipanacea/pod-markdown/_client.js'
import * as PodPlaintext from '@quasipanacea/pod-plaintext/_client.js'

import * as ModelDefault from '../qp-model-default/_client.ts'
import * as ModelFlat from '../qp-model-flat/_client.ts'
import * as ModelGroupSimple from '@quasipanacea/model-group-simple/_client.ts'

import * as GroupLine from '../qp-model-line/_client.js'

import * as ViewList from '@quasipanacea/view-list/_client.js'
import * as ViewMarkmap from '@quasipanacea/view-markmap/_client.js'

export * from './_isomorphic.ts'

export const overviewPlugins = [
	OverviewDebug,
	OverviewGraph,
	OverviewMindelixir,
]

export const podPlugins = [
	PodChemical,
	PodDebug,
	PodLatex,
	PodMarkdown,
	PodPlaintext,
]

export const modelPlugins = [ModelDefault, ModelFlat, ModelGroupSimple]

export const groupPlugins = [GroupLine]

export const viewPlugins = [ViewList, ViewMarkmap]
