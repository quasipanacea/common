import { Hooks } from "@common/util/types.ts";

export const onPodCreate: Hooks["onCreate"] = function (dir) {
	console.log("created", dir);
};

export const onPodRemove: Hooks["onRemove"] = function (dir) {
	console.log("removed", dir);
};
