<template>
	<div>
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
					@click.disabled="submitData"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

import { t } from '@quasipanacea/common/index.ts'
import {
	popup,
	trpcClient,
	type BareAppRouter,
} from '@quasipanacea/common/client/index.js'

const props = defineProps<{
	oldName: string
	podUuid: string
}>()

const form = reactive<{
	newName: string
}>({
	newName: '',
})

const api = trpcClient.yieldClient<BareAppRouter>()

async function submitData() {
	await api.core.podModify.mutate({
		uuid: props.podUuid,
		data: {
			name: form.newName,
		},
	})

	popup.hideNoData('null')
}
</script>
