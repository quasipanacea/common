import type { OnPodCreate, OnPodRemove } from "@src/verify/types.ts";

export const onPodCreate: OnPodCreate = function (pod) {
	console.log("created", pod);
};

export const onPodRemove: OnPodRemove = function (pod) {
	console.log("removed", pod);
};
