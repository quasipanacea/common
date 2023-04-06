import * as PodChemical from '@quasipanacea/pod-chemical/_server.ts'
import * as PodDebug from '@quasipanacea/pod-debug/_server.ts'
import * as PodLatex from '@quasipanacea/pod-latex/_server.ts'
import * as PodMarkdown from '@quasipanacea/pod-markdown/_server.ts'
import * as PodPlaintext from '@quasipanacea/pod-plaintext/_server.ts'

export * from './_isomorphic.ts'

export const podPlugins = [
	PodChemical,
	PodDebug,
	PodLatex,
	PodMarkdown,
	PodPlaintext,
]
