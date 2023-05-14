<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<h2 class="title as-2">View: Create</h2>

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
			<label class="label" for="plugin">Plugin</label>
			<div class="control">
				<div class="select">
					<select name="plugin" id="plugin" v-model="form.plugin" required>
						<option
							v-for="plugin in viewPluginOptions"
							:value="plugin"
							:key="plugin"
						>
							{{ plugin }}
						</option>
					</select>
				</div>
			</div>
		</div>

		<div class="field">
			<label class="label" for="group-uuid">Model UUID</label>
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
					@click.prevent="doSubmit"
				/>
			</div>
		</div>
	</PopupComponent>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'

import { apiObj as api } from '@quasipanacea/common/trpcClient.ts'

import type * as t from '@quasipanacea/common/types.js'
import PopupComponent from '../PopupComponent.vue'

const props = defineProps<{
	show: boolean
	data: {
		modelUuid: string
	}
}>()
const emit = defineEmits(['cancel', 'submit'])

const viewPluginOptions = ref<string[]>([])
onMounted(async () => {
	viewPluginOptions.value = (
		await api.core.pluginList.query({ kind: 'view' })
	).plugins.map((item) => item.id)
})

const form = reactive<{
	name: string
	plugin: string
	model: {
		uuid: string
	}
}>({
	name: '',
	plugin: '',
	model: {
		uuid: '',
	},
})
watch(props, (val) => {
	form.model.uuid = val.data.modelUuid
})

async function doSubmit() {
	await api.core.viewAdd.mutate(form)
	emit('submit')
}
</script>
