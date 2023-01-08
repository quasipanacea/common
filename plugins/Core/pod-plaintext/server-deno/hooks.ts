import type { OnPodCreate, OnPodRemove } from "@src/verify/types.ts";

export const onPodCreate: OnPodCreate = function (dir) {
	console.log("created", dir);
};

export const onPodRemove: OnPodRemove = function (dir) {
	console.log("removed", dir);
};
