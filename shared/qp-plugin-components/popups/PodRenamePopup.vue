<template>
	<h2 class="title as-2">Pod: Rename</h2>

	<div class="field">
		<label class="label" for="old-name">Old Name</label>
		<div class="control">
			<input
				class="input"
				id="old-name"
				type="text"
				v-model="props.oldName"
				disabled
			/>
		</div>
	</div>

	<div class="field">
		<label class="label" for="new-name">New Name</label>
		<div class="control">
			<input
				class="input"
				id="new-name"
				type="text"
				v-model="form.newName"
				required
			/>
		</div>
	</div>

	<div class="field">
		<div class="control">
			<input
				type="submit"
				class="button is-primary"
				@click.disabled="doSubmit"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

import { apiObj as api } from '@quasipanacea/common/trpcClient.ts'

import type * as t from '@quasipanacea/common/types.js'
import { popupEmitter } from '@quasipanacea/common/client/popup.js'

const props = defineProps<{
	oldName: string
	podUuid: string
}>()

const form = reactive<{
	newName: string
}>({
	newName: '',
})

async function doSubmit() {
	await api.core.podModify.mutate({
		uuid: props.podUuid,
		data: {
			name: form.newName,
		},
	})
	popupEmitter.post({
		id: 'hide-null',
	})
}
</script>
