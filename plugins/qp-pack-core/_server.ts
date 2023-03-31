import * as PodChemical from './dependencies/@quazipanacea/pod-chemical/_server.ts'
import * as PodDebug from './dependencies/@quazipanacea/pod-debug/_server.ts'
import * as PodLatex from './dependencies/@quazipanacea/pod-latex/_server.ts'
import * as PodMarkdown from './dependencies/@quazipanacea/pod-markdown/_server.ts'
import * as PodPlaintext from './dependencies/@quazipanacea/pod-plaintext/_server.ts'

export const podPlugins = [
	PodChemical,
	PodDebug,
	PodLatex,
	PodMarkdown,
	PodPlaintext,
]
