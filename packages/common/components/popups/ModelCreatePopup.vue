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
					<select name="pluginId" id="plugin-id" v-model="form.plugin" required>
						<option
							v-for="plugin in modelPlugins"
							:value="plugin.id"
							:key="plugin.id"
						>
							{{ plugin.id }}
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

const modelPlugins = ref<t.Plugin_t[]>([])
onMounted(async () => {
	const { plugins } = await api.core.pluginList.query({ family: 'model' })

	modelPlugins.value = plugins
	if (!form.plugin) {
		form.plugin = plugins[0].id
	}
})

const form = reactive<{
	name: string
	plugin: t.PluginFamilySingular_t | ''
}>({
	name: '',
	plugin: '',
})

async function submitData() {
	await api.core.modelAdd.mutate(form)
	popup.hideNoData('null')
}
</script>
