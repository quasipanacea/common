<template>
	<div>
		<h2 class="title is-4">Pod: Edit Metadata</h2>

		<template v-if="currentPod">
			<div class="field">
				<label class="label">Uuid</label>
				<div class="control">
					<input class="input" type="text" :placeholder="props.uuid" disabled />
				</div>
			</div>

			<div class="field">
				<label class="label">Name</label>
				<div class="control">
					<input class="input" type="text" v-model="props.name" disabled />
				</div>
			</div>

			<div class="field">
				<label class="label">Description</label>
				<div class="control">
					<textarea class="textarea" v-model="form.description"></textarea>
				</div>
			</div>

			<div class="field">
				<label class="label">Add Tag</label>

				<div class="is-flex is-align-items-center">
					<input class="input" type="text" v-model="tagName" />
					<button class="button is-primary" @click="addTag">Add</button>
				</div>
			</div>
			<div class="field is-grouped is-grouped-multiline">
				<div v-for="tag of form.tags" class="control">
					<div class="tags has-addons">
						<span class="tag is-dark">{{ tag }}</span>
						<a class="tag is-delete" @click="removeTag(tag)"></a>
					</div>
				</div>
			</div>

			<div class="control">
				<button class="button is-primary" @click.prevent="sendRequest">
					Submit
				</button>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'

import { t } from '@quasipanacea/common/index.ts'
import {
	popup,
	trpcClient,
	type BareAppRouter,
} from '@quasipanacea/common/client/index.js'

const props = defineProps<{
	uuid: string
	name: string
	description: string
	tags: string[]
}>()

const api = trpcClient.yieldClient<BareAppRouter>()

const form = reactive<{
	description: string
	tags: string[]
}>({
	description: '',
	tags: [],
})
const currentPod = ref<t.Pod_t>()
onMounted(async () => {
	await updateData(props.uuid, props.description, props.tags)
})

const tagName = ref('')
function addTag() {
	form.tags.push(tagName.value)
	tagName.value = ''
}
function removeTag(name: string) {
	form.tags = form.tags.filter((tag) => tag !== name)
}

watch(props, async (val) => {
	await updateData(props.uuid, val.description, val.tags)
})

async function updateData(uuid: string, description: string, tags: string[]) {
	const { pods: podsRes } = await api.core.podList.query({
		uuid,
	})
	currentPod.value = podsRes[0]

	form.description = description
	form.tags = tags
}

async function sendRequest() {
	await api.core.podModifyExtra.mutate({
		uuid: props.uuid,
		field: 'model.flat',
		data: {
			description: form.description,
			tags: form.tags,
		},
	})
	popup.hideNoData('null')
}
</script>
