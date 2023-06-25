<template>
	<div>
		<h2 class="title as-2">Pod: Create</h2>
		<div class="field">
			<label class="label" for="name">Name</label>
			<div class="control">
				<input
					class="input"
					id="name"
					type="text"
					v-model="form.name"
					required
				/>
			</div>
		</div>

		<div class="field">
			<label class="label" for="plugin">Plugin</label>
			<div class="control">
				<div class="select">
					<select name="plugin" id="plugin" v-model="form.plugin" required>
						<option
							v-for="item in pluginOptions"
							:key="item.value"
							:value="item.value"
						>
							{{ item.label }}
						</option>
					</select>
				</div>
			</div>
		</div>

		<div class="field">
			<label clas="label" for="group-uuid">Model UUID</label>
			<div class="control">
				<input
					class="input"
					id="group-uuid"
					type="text"
					v-model="form.model.uuid"
					required
					disabled
				/>
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
import { onMounted, reactive, ref, watch } from 'vue'

import { popup, trpcClient, type BareAppRouter } from '../../client/index.ts'
import { t } from '../../index.ts'

const props = defineProps<{
	modelUuid: string
}>()

const api = trpcClient.yieldClient<BareAppRouter>()

const pluginOptions = ref<{ label: string; value: string }[]>([])
onMounted(async () => {
	const { plugins } = await api.core.pluginList.query({ kind: 'pod' })
	pluginOptions.value = plugins.map((item) => ({
		label: item.id,
		value: item.id,
	}))
})
const form = reactive<{
	name: string
	type: string
	plugin: string
	model: {
		uuid: string
	}
}>({
	name: '',
	type: 'node',
	plugin: '',
	model: {
		uuid: props.modelUuid,
	},
})

watch(props, (val) => {
	form.model.uuid = val.modelUuid
})

async function submitData() {
	await api.core.podAdd.mutate(form)
	popup.hideNoData('null')
}
</script>
