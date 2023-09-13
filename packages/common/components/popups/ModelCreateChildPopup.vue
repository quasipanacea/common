<template>
	<div>
		<h2 class="title is-4">Model: Create Child</h2>

		<div class="field">
			<label class="label">Name</label>
			<div class="control">
				<input class="input" type="text" v-model="form.name" />
			</div>
		</div>

		<div class="field">
			<label class="label">Type</label>
			<div class="control">
				<div class="select">
					<select v-model="form.childType">
						<option v-for="value of childTypes" :id="value">
							{{ value }}
						</option>
					</select>
				</div>
			</div>
		</div>

		<div v-if="form.childType === 'pod'" class="field">
			<label class="label">Plugin</label>
			<div class="control">
				<div class="select">
					<select v-model="form.format">
						<option v-for="format of podFormats" :value="format">
							{{ format }}
						</option>
					</select>
				</div>
			</div>
		</div>

		<div class="field">
			<div class="control">
				<button class="button is-primary" @click.prevent="submitData">
					Submit
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import { popup, trpcClient, type BareAppRouter } from '../../client/index.ts'
import { t } from '../../index.ts'

const props = defineProps<{
	modelUuid: string
}>()

const api = trpcClient.yieldClient<BareAppRouter>()

const podFormats = ref<string[]>([])
onMounted(async () => {
	const indexJson = await api.core.indexGet.query()
	podFormats.value = Object.keys(indexJson.mimes?.pod ?? {})

	form.format = podFormats.value[0]
})

const form = reactive<{
	name: string
	childType: string
	format: string
}>({
	name: '',
	childType: 'pod',
	format: '',
})

async function submitData() {
	await api.core.podAdd.mutate({
		name: form.name,
		format: form.format,
		model: {
			uuid: props.modelUuid,
		},
	})

	popup.hideNoData('null')
}
</script>
