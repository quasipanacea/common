<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<h2 class="title is-4">Model: Edit Properties</h2>
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
			<label class="label">Old Name</label>
			<div class="control">
				<input
					class="input"
					type="text"
					:placeholder="props.data.oldName"
					disabled
				/>
			</div>
		</div>

		<div class="field">
			<label class="label">New Name</label>
			<div class="control">
				<input class="input" type="text" v-model="form.newName" />
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
import PopupComponent from '../PopupComponent.vue'

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
