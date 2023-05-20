<template>
	<div>
		<h2 class="title is-4">Model: Edit Properties</h2>
		<div class="field">
			<label class="label">Uuid</label>
			<div class="control">
				<input class="input" type="text" :placeholder="props.uuid" disabled />
			</div>
		</div>

		<div class="field">
			<label class="label">Old Name</label>
			<div class="control">
				<input
					class="input"
					type="text"
					:placeholder="props.oldName"
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
			<button class="button is-primary" @click.prevent="submitData">
				Submit
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

import { useApi3, type BareAppRouter } from '@quasipanacea/common/trpcClient.ts'
import { hidePopupNoData } from '@quasipanacea/common/client/popup'

const props = defineProps<{
	uuid: string
	oldName: string
}>()

const api = useApi3<BareAppRouter>()

const form = reactive<{
	newName: string
}>({
	newName: '',
})
watch(props, (val) => {
	form.newName = val.oldName
})

async function submitData() {
	await api.core.modelModify.mutate({
		uuid: props.uuid,
		data: {
			name: form.newName,
		},
	})
	hidePopupNoData('null')
}
</script>
