import { Router } from "../../../../src/mod.ts";
import * as send from "../../../../src/util/sendUtils.ts";

import * as c from "./controller.ts";

export const router = new Router();

router.post("/read-markdown", async (ctx) => {});

router.post("/read-pdf", async (ctx) => {});

router.post("/open-markdown", async (ctx) => {});

router.post("/open-pdf", async (ctx) => {
	await c.openPdfInNativeApp();

	send.success(ctx);
});

router.post("/generate-pdf", async (ctx) => {
	await c.generatePdf();

	send.success(ctx);
});
