<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<h2 class="title is-4">Pod: Edit Metadata</h2>

		<template v-if="currentPod">
			<div class="field">
				<label class="label">Uuid</label>
				<div class="control">
					<input
						class="input"
						type="text"
						:placeholder="props.data.uuid"
						disabled
					/>
				</div>
			</div>

			<div class="field">
				<label class="label">Name</label>
				<div class="control">
					<input class="input" type="text" v-model="props.data.name" disabled />
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

				<div style="display: flex; align-items: center">
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
	</PopupComponent>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'

import { apiObj as api } from '@quasipanacea/common/trpcClient.ts'

import type * as t from '@quasipanacea/common/types.js'
import PopupComponent from '@quasipanacea/plugin-components/PopupComponent.vue'

const emit = defineEmits(['cancel', 'submit'])
const props = defineProps<{
	show: boolean
	data: {
		uuid: string
		name: string
		description: string
		tags: string[]
	}
}>()

const currentPod = ref<t.Pod_t>()
onMounted(async () => {
	if (props.data.uuid) {
		const { pods: podsRes } = await api.core.podList.query({
			uuid: props.data.uuid,
		})
		currentPod.value = podsRes[0]
	}
})

const tagName = ref('')
function addTag() {
	form.tags.push(tagName.value)
	tagName.value = ''
}
function removeTag(name: string) {
	form.tags = form.tags.filter((tag) => tag !== name)
}

const form = reactive<{
	description: string
	tags: string[]
}>({
	description: '',
	tags: [],
})
watch(props, async (val) => {
	if (val.data.uuid) {
		const { pods: podsRes } = await api.core.podList.query({
			uuid: props.data.uuid,
		})
		currentPod.value = podsRes[0]
	}

	form.description = val.data.description
	form.tags = val.data.tags
})

async function sendRequest() {
	await api.core.podModifyExtra.mutate({
		uuid: props.data.uuid,
		field: 'model.flat',
		data: {
			description: form.description,
			tags: form.tags,
		},
	})
	emit('submit')
}
</script>
