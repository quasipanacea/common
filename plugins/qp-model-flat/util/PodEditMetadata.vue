<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<h2 class="title is-4">Model: Edit Metadata</h2>
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
				<textarea class="textarea" v-model="props.data.description"></textarea>
			</div>
		</div>

		<div class="field">
			<label class="label">Add Tag</label>

			<div style="display: flex; align-items: center">
				<input class="input" type="text" />
				<button class="button is-primary">Add</button>
			</div>
		</div>
		<div class="field is-grouped is-grouped-multiline">
			<div class="control">
				<div class="tags has-addons">
					<span class="tag is-dark">alfa</span>
					<a class="tag is-delete"></a>
				</div>
			</div>
			<div class="control">
				<div class="tags has-addons">
					<span class="tag is-dark">bravo</span>
					<a class="tag is-delete"></a>
				</div>
			</div>
			<div class="control">
				<div class="tags has-addons">
					<span class="tag is-dark">charlie</span>
					<a class="tag is-delete"></a>
				</div>
			</div>
		</div>

		<div class="control">
			<button class="button is-primary" @click.prevent="doSubmit">
				Submit
			</button>
		</div>
	</PopupComponent>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'

import { apiObj as api } from '@quasipanacea/common/trpcClient.ts'

import type * as t from '@quasipanacea/common/types.js'
import PopupComponent from '@quasipanacea/plugin-components/PopupComponent.vue'

const emit = defineEmits(['cancel', 'submit'])
const props = defineProps<{
	show: boolean
	data: {
		uuid: string
		oldName: string
	}
}>()

const form = reactive<{
	newName: string
}>({
	newName: '',
})
watch(props, (val) => {
	form.newName = val.data.oldName
})

async function doSubmit() {
	await api.core.modelModify.mutate({
		uuid: props.data.uuid,
		data: {
			name: form.newName,
		},
	})
	emit('submit')
}
</script>
