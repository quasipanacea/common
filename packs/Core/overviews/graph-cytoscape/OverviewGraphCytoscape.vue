<template>
	<div id="graph" style="height: 100%"></div>
	<PodCreatePopup
		:show="boolCreatePod"
		:data="dataCreatePod"
		@submit="afterCreatePod"
		@cancel="() => (boolCreatePod = false)"
	/>
	<PodRenamePopup
		:show="boolRenamePod"
		:podUuid="dataRenamePod.podUuid"
		:oldName="dataRenamePod.oldName"
		@submit="afterRenamePod"
		@cancel="() => (boolRenamePod = false)"
	/>
	<CoverCreatePopup
		:show="boolCreateCover"
		:data="dataCreateCover"
		@submit="afterCreateCover"
		@cancel="() => (boolCreateCover = false)"
	/>
	<GroupCreatePopup
		:show="boolGroupCreate"
		:data="dataGroupCreate"
		@submit="afterGroupCreate"
		@cancel="() => (boolGroupCreate = false)"
	/>
	<GroupRenamePopup
		:show="boolRenameGroup"
		:data="dataRenameGroup"
		@submit="afterRenameGroup"
		@cancel="() => (boolRenameGroup = false)"
	/>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import cytoscape from "cytoscape";
import cytoscapeCola from "cytoscape-cola";
import cytoscapeCtxMenu from "cytoscape-cxtmenu";
import cytoscapeCompoundDragAndDrop from "cytoscape-compound-drag-and-drop";
import cytoscapeLasso from "cytoscape-lasso";
import cytoscapeUndoRedo from "cytoscape-undo-redo";

import { apiObj as api } from "@/util/api";

import type * as t from "@common/types";
import PodCreatePopup from "@common/shared/components/popups/PodCreatePopup.vue";
import PodRenamePopup from "@common/shared/components/popups/PodRenamePopup.vue";
import GroupCreatePopup from "@common/shared/components/popups/GroupCreatePopup.vue";
import GroupRenamePopup from "@common/shared/components/popups/GroupRenamePopup.vue";
import CoverCreatePopup from "@common/shared/components/popups/CoverCreatePopup.vue";

const router = useRouter();

let groups = ref<t.Group_t[]>([]);
let groupsObj = reactive<Record<string, t.Pod_t[]>>({});
let pods = ref<t.Pod_t[]>([]);

let cy: cytoscape.Core | null = null;
const cyLayout: cytoscape.LayoutOptions = {
	name: "cola",
	animate: true,
};

onMounted(async () => {
	cy = cytoscape({
		container: document.getElementById("graph"),
		style: [
			{
				selector: "node[label]",
				style: {
					label: "data(label)",
				},
			},

			{
				selector: "edge[label]",
				style: {
					label: "data(label)",
					width: 3,
				},
			},
			// {
			// 	selector: 'node',
			// 	css: {
			// 		content: 'data(name)',
			// 	},
			// },

			// {
			// 	selector: 'edge',
			// 	css: {
			// 		'curve-style': 'bezier',
			// 		'target-arrow-shape': 'triangle',
			// 	},
			// },
		],
		minZoom: 0.5,
		maxZoom: 3,
	});

	let cyDND = null;
	{
		// Check before '.use()' to prevent spurious warnings on hot-reload
		if (!Object.getPrototypeOf(cy)["cxtmenu"]) {
			cytoscape.use(cytoscapeCtxMenu);
		}
		if (!Object.getPrototypeOf(cy)["compoundDragAndDrop"]) {
			cytoscape.use(cytoscapeCompoundDragAndDrop);
		}
		if (!Object.getPrototypeOf(cy)["lassoSelectionEnabled"]) {
			cytoscape.use(cytoscapeLasso);
		}
		if (!Object.getPrototypeOf(cy)["undoRedo"]) {
			cytoscape.use(cytoscapeUndoRedo);
		}
		cytoscape.use(cytoscapeCola);
		// console.log(Object.getPrototypeOf(cy))

		cyDND = cy.compoundDragAndDrop();
		cyDND.disable();

		cy.lassoSelectionEnabled(true);

		cy.cxtmenu({
			selector: "node",
			commands: (el) => {
				const json = el.json();

				if (json.data?.data?.isGroup) {
					return [
						{
							content: "Add Pod",
							select: (el) => {
								const json = el.json();

								showPodCreatePopup(json?.data?.data?.groupUuid);
							},
						},
						{
							content: "Add Cover",
							select: (el) => {
								const json = el.json();

								showCreateCoverPopup(json?.data?.data?.groupUuid);
							},
						},
						{
							content: "Go to Group",
							select: (el) => {
								const json = el.json();

								router.push(`/group/${json?.data?.data?.groupUuid}`);
							},
						},
						{
							content: "Delete Group",
							select: async (el) => {
								const json = el.json();

								if (globalThis.confirm("Are you sure")) {
									await api.core.groupRemove.mutate({
										uuid: json?.data?.data?.groupUuid,
									});
									await updateGroups();
								}
							},
						},
						{
							content: "Rename Group",
							select: async (el) => {
								const json = el.json();

								showRenameGroupPopup(
									json?.data?.data?.groupUuid,
									json?.data?.label
								);
							},
						},
					];
				} else if (json.data?.data?.isPod) {
					return [
						{
							content: "Go To Pod",
							select: (el) => {
								const json = el.json();
								const podUuid = json.data?.data?.podUuid;

								router.push(`/pod/${podUuid}`);
							},
						},
						{
							content: "Rename Pod",
							select: async (el) => {
								const json = el.json();

								showRenamePodPopup(json.data?.data?.podUuid, json.data?.label);
							},
						},
						{
							content: "Delete Pod",
							select: async (el) => {
								if (globalThis.confirm("Are you sure?")) {
									const json = el.json();
									const podUuid = json.data?.data?.podUuid;

									await api.core.podRemove.mutate({
										uuid: podUuid,
									});
									await updateGroups();
								}
							},
						},
					];
				} else {
					return [];
				}
			},
		});
		cy.cxtmenu({
			selector: "core",
			commands: [
				{
					content: "Create Group",
					select: (el) => {
						showGroupCreatePopup();
					},
				},
				{
					content: "Enable DND",
					select: (el) => {
						cyDND.enable();
					},
				},
				{
					content: "Disable DND",
					select: (el) => {
						cyDND.disable();
					},
				},
			],
		});
	}

	await updateGroups();
});

async function updateGroups() {
	groups.value = (await api.core.groupList.query()).groups;
	pods.value = (await api.core.podList.query()).pods;

	const uuidsFromPods = Array.from(
		new Set(pods.value.map((item) => item.groupUuid))
	);
	for (const groupUuid of uuidsFromPods) {
		const arr = pods.value.filter((item) => item.groupUuid === groupUuid);
		groupsObj[groupUuid] = arr;
	}

	let edges: cytoscape.CytoscapeOptions["elements"] = [];
	let nodes: cytoscape.CytoscapeOptions["elements"] = [];

	// node for each group
	nodes = nodes.concat(
		groups.value.map((item) => ({
			data: {
				id: item.uuid,
				label: item.name,
				data: { isGroup: true, groupUuid: item.uuid },
			},
		}))
	);

	// node for each item of each group
	// if group is empty, placeholder is created
	for (const group of groups.value) {
		const items = pods.value.filter((item) => item.groupUuid === group.uuid);
		if (items.length > 0) {
			nodes = nodes.concat(
				items.map((item) => ({
					data: {
						id: item.uuid,
						label: item.name,
						parent: group.uuid,
						data: { isPod: true, podUuid: item.uuid },
					},
				}))
			);
		} else {
			nodes.push({
				data: {
					id: "__PLACEHOLDER: " + group.uuid,
					label: "__placeholder",
					parent: group.uuid,
					data: {},
				},
			});
		}
	}
	cy.remove(cy?.nodes("*"));
	cy.add(nodes);
	cy.layout(cyLayout).run();
}

// popup: create cover
const boolCreateCover = ref(false);
const dataCreateCover = reactive({ groupUuid: "" });
function showCreateCoverPopup(uuid: string) {
	dataCreateCover.groupUuid = uuid;
	boolCreateCover.value = true;
}
async function afterCreateCover(value: unknown) {
	boolCreateCover.value = false;
	await updateGroups();
}

// popup: create pod
const boolCreatePod = ref(false);
const dataCreatePod = reactive({ groupUuid: "" });
function showPodCreatePopup(uuid: string) {
	dataCreatePod.groupUuid = uuid;
	boolCreatePod.value = true;
}
async function afterCreatePod(value: unknown) {
	boolCreatePod.value = false;
	await updateGroups();
}

// popup: rename pod
const boolRenamePod = ref(false);
const dataRenamePod = reactive({ podUuid: "", oldName: "" });
function showRenamePodPopup(podUuid: string, oldName: string) {
	dataRenamePod.podUuid = podUuid;
	dataRenamePod.oldName = oldName;
	boolRenamePod.value = true;
}
async function afterRenamePod(value: unknown) {
	boolRenamePod.value = false;
}

// popup: create group
const boolGroupCreate = ref(false);
const dataGroupCreate = reactive({});
function showGroupCreatePopup() {
	boolGroupCreate.value = true;
}
async function afterGroupCreate(value: unknown) {
	boolGroupCreate.value = false;
	await updateGroups();
}

// popup: rename group
const boolRenameGroup = ref(false);
const dataRenameGroup = reactive({ groupUuid: "", oldName: "" });
function showRenameGroupPopup(uuid: string, oldName: string) {
	dataRenameGroup.groupUuid = uuid;
	dataRenameGroup.oldName = oldName;
	boolRenameGroup.value = true;
}
async function afterRenameGroup(value: unknown) {
	boolRenameGroup.value = false;
	await updateGroups();
}
</script>
