import { Router } from "../../../../src/mod.ts";
import * as send from "../../../../src/util/sendUtils.ts";

import * as c from "./controller.ts";

export const router = new Router();

router.post("/common-create", async (ctx) => {
	await c.create();

	send.success(ctx);
});

router.post("/read-textfile", async (ctx) => {
	await c.read();

	send.success(ctx);
});

router.post("/open-textfile", async (ctx) => {
	await c.open();

	send.success(ctx);
});
