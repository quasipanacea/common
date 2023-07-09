<template>
	<div>
		<h2 class="title is-3 mb-0">Model: Create</h2>

		<div class="field">
			<label class="label" for="name">Name</label>
			<div class="control">
				<input
					class="input"
					type="text"
					id="name"
					required
					v-model="form.name"
				/>
			</div>
		</div>

		<div class="field">
			<label class="label" for="plugin-id">Plugin</label>
			<div class="control">
				<div class="select">
					<select name="pluginId" id="plugin-id" v-model="form.format" required>
						<option v-for="plugin in modelMimes" :value="plugin" :key="plugin">
							{{ plugin }}
						</option>
					</select>
				</div>
			</div>
		</div>

		<div class="field">
			<div class="control">
				<input
					class="button is-primary"
					type="submit"
					value="Create"
					@click.prevent="submitData"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import { popup, trpcClient, type BareAppRouter } from '../../client/index.ts'
import { t } from '../../index.ts'

const api = trpcClient.yieldClient<BareAppRouter>()

const modelMimes = ref<string[]>([])
onMounted(async () => {
	const indexJson = await api.core.indexGet.query()
	modelMimes.value = Object.keys(indexJson.mimes?.model ?? {})

	form.format = modelMimes.value[0]
})

const form = reactive<{
	name: string
	format: string
}>({
	name: '',
	format: '',
})

async function submitData() {
	await api.core.modelAdd.mutate(form)
	popup.hideNoData('null')
}
</script>
