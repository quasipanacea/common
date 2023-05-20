import { unified } from 'unified'
import remarkToc from 'remark-toc'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeStringify from 'rehype-stringify'

import 'katex/dist/contrib/mhchem'

export async function markdownToHtml(input: string) {
	const output = await unified()
		.use(remarkToc)
		.use(remarkParse)
		.use(remarkMath)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeKatex)
		.use(rehypeExternalLinks, {
			target: '_blank',
			rel: 'nofollow ',
		})
		.use(rehypeStringify)
		.process(input)

	return String(output)
}
