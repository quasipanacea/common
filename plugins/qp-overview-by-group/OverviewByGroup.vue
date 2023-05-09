<template>
	<div style="display: flex; flex-direction: row; height: 100%">
		<template v-for="group of groups" :key="group.uuid">
			<div>
				<button @click="deleteGroup(group.uuid)" class="pure-button">
					Delete
				</button>
				<button
					@click="showPodCreatePopup(group.uuid)"
					class="pure-button pure-button-primary"
				>
					New Pod
				</button>
				<div style="width: 200px; margin: 5px">
					<h2 style="display: inline">{{ group.name }}</h2>
					<span> ({{ group.plugin }})</span>
					<div v-for="pod of groupsObj[group.uuid]">
						<a :href="'/pod/' + pod.uuid">{{ pod.name }} </a>
						<span> ({{ pod.plugin }})</span>
					</div>
				</div>
			</div>
			<div style="border: 1px solid var(--oc-gray-3)"></div>
		</template>
		<div style="min-width: 200px; text-align: center; margin-top: 180px">
			<button
				class="pure-button pure-button-primary"
				@click="showGroupCreatePopup"
			>
				New Group
			</button>
		</div>
	</div>
	<PodCreatePopup
		:show="boolCreatePod"
		:data="dataCreatePod"
		@submit="afterCreatePod"
		@cancel="() => (boolCreatePod = false)"
	/>
	<GroupCreatePopup
		:show="boolGroupCreate"
		:data="dataGroupCreate"
		@submit="afterGroupCreate"
		@cancel="() => (boolGroupCreate = false)"
	/>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import { apiObj as api } from '@quasipanacea/common/trpcClient.ts'

import type * as t from '@quasipanacea/common/types.js'
import {
	PodCreatePopup,
	GroupCreatePopup,
} from '@quasipanacea/plugin-components/popups/index.js'

let groups = ref<t.Group_t[]>([])
let groupsObj = reactive<Record<string, t.Pod_t[]>>({})

const groupPluginOptions = ref<{ label: string; value: string }[]>([])
const groupFormData = reactive({ name: '', plugin: '' })

onMounted(async () => {
	await updateGroups()

	const plugins = await api.core.pluginList.query()
	groupPluginOptions.value = plugins.plugins
		.filter((item) => item.kind === 'group')
		.map((item) => ({
			label: item.id,
			value: item.id,
		}))
})

async function updateGroups() {
	groups.value = (await api.core.groupList.query()).groups

	const pods = (await api.core.podList.query()).pods
	for (const groupUuid of Array.from(
		new Set(pods.map((item) => item.groupUuid)),
	)) {
		const arr = pods.filter((item) => item.groupUuid === groupUuid)
		groupsObj[groupUuid] = arr
	}
}

async function getGroupPods(groupUuid: string) {
	const result = await api.core.podList.query()
	const pods = result.pods.filter((item) => {
		return (item.groupUuid = groupUuid)
	})

	return pods
}
async function createGroup() {
	await api.core.groupAdd.mutate(groupFormData)
	await updateGroups()
}
async function deleteGroup(uuid: string) {
	if (globalThis.confirm('Are you sure?')) {
		await api.core.groupRemove.mutate({ uuid })
		await updateGroups()
	}
}

// popup: create pod
const boolCreatePod = ref(false)
const dataCreatePod = reactive({ modelUuid: '' })
function showPodCreatePopup(uuid: string) {
	dataCreatePod.modelUuid = uuid
	boolCreatePod.value = true
}
async function afterCreatePod(value: unknown) {
	boolCreatePod.value = false
	await updateGroups()
}

// popup: create group
const boolGroupCreate = ref(false)
const dataGroupCreate = reactive({})
function showGroupCreatePopup() {
	boolGroupCreate.value = true
}
async function afterGroupCreate(value: unknown) {
	boolGroupCreate.value = false
	await updateGroups()
}
</script>
