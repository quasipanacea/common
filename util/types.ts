import { Router, z } from "@src/mod.ts";

export type Hooks = {
	onCreate: (dir: string) => void | Promise<void>;
	onRemove: (dir: string) => void | Promise<void>;
};

export type Pod = {
	type: string;
	uuid: string;
	dir: string;
};

export type Endpoint<
	Schema extends {
		req: z.AnyZodObject;
		res: z.AnyZodObject;
	}
> = {
	route: string;
	// handler: (router: Router, api: Endpoint<Schema>["api"], pod: Pod) => void;
	api: (
		pod: Pod,
		data: z.infer<Schema["req"]>
	) => Promise<z.infer<Schema["res"]>> | z.infer<Schema["res"]>;
};
