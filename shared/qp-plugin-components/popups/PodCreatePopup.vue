<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<form class="pure-form pure-form-aligned">
			<fieldset>
				<legend><h2>Create Pod</h2></legend>

				<div class="pure-control-group">
					<label for="name">Name</label>
					<input id="name" type="text" v-model="formData.name" required />
				</div>

				<div class="pure-control-group">
					<label for="plugin-id">Plugin ID</label>
					<select
						name="pluginId"
						id="plugin-id"
						v-model="formData.pluginId"
						required
					>
						<option
							v-for="item in pluginOptions"
							:key="item.value"
							:value="item.value"
						>
							{{ item.label }}
						</option>
					</select>
				</div>

				<div class="pure-control-group">
					<label for="group-uuid">Group UUID</label>
					<input
						id="group-uuid"
						type="text"
						v-model="formData.groupUuid"
						required
						disabled
					/>
				</div>

				<div class="pure-controls">
					<input
						type="submit"
						class="pure-button"
						value="Create"
						@click.prevent="doSubmit"
					/>
				</div>
			</fieldset>
		</form>
	</PopupComponent>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'

import { apiObj as api } from '@quazipanacea/common/trpcClient.ts'
import type * as t from '@quazipanacea/common/types.js'

import PopupComponent from '../PopupComponent.vue'

const props = defineProps<{
	show: boolean
	data: {
		groupUuid: string
	}
}>()
const emit = defineEmits(['cancel', 'submit'])

const pluginOptions = ref<{ label: string; value: string }[]>([])
onMounted(async () => {
	pluginOptions.value = (await api.core.pluginList.query()).plugins
		.filter((item) => item.kind === 'pod')
		.map((item) => ({
			label: item.id,
			value: item.id,
		}))
})
const formData = reactive<{
	name: string
	type: string
	pluginId: string
	groupUuid: string
}>({
	name: '',
	type: 'node',
	pluginId: '',
	groupUuid: '',
})
watch(props, (val) => {
	formData.groupUuid = val.data.groupUuid
})

async function doSubmit() {
	await api.core.podAdd.mutate(formData)
	emit('submit')
}
</script>
