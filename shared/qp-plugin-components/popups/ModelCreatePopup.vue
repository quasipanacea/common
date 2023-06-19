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
							v-for="plugin in plugins"
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

import type * as t from '@quasipanacea/common/types'
import { useApi3, type BareAppRouter } from '@quasipanacea/common/client/trpcClient.ts'
import { hidePopupNoData } from '@quasipanacea/common/client/popup'

const api = useApi3<BareAppRouter>()

const plugins = ref<t.Plugin_t[]>([])
onMounted(async () => {
	plugins.value = (await api.core.pluginList.query({ kind: 'model' })).plugins
})

const form = reactive<{
	name: string
	plugin: string
}>({
	name: '',
	plugin: '',
})

async function submitData() {
	await api.core.modelAdd.mutate(form)
	hidePopupNoData('null')
}
</script>
