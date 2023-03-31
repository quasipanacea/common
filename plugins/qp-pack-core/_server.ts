import * as PodChemical from './dependencies/@quasipanacea/pod-chemical/_server.ts'
import * as PodDebug from './dependencies/@quasipanacea/pod-debug/_server.ts'
import * as PodLatex from './dependencies/@quasipanacea/pod-latex/_server.ts'
import * as PodMarkdown from './dependencies/@quasipanacea/pod-markdown/_server.ts'
import * as PodPlaintext from './dependencies/@quasipanacea/pod-plaintext/_server.ts'

export const podPlugins = [
	PodChemical,
	PodDebug,
	PodLatex,
	PodMarkdown,
	PodPlaintext,
]
