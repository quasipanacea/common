import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";

import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export async function markdownToHtml(input: string) {
	const output = await unified()
		.use(remarkToc)
		.use(remarkParse)
		.use(remarkMath)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeKatex)
		.use(rehypeExternalLinks, {
			target: "_blank",
			rel: "nofollow ",
		})
		.use(rehypeStringify)
		.process(input);

	return String(output);
}
