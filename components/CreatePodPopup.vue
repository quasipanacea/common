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
					<label for="collection-uuid">Collection UUID</label>
					<input
						id="collection-uuid"
						type="text"
						v-model="formData.collectionUuid"
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
import { api } from '@/util/api'
import { onMounted, reactive, ref, watch } from 'vue'

import type * as t from '@common/types'
import PopupComponent from '@/components/PopupComponent.vue'

const props = defineProps<{
	show: boolean
	data: {
		collectionUuid: string
	}
}>()
const emit = defineEmits(['cancel', 'submit'])

const pluginOptions = ref([])
onMounted(async () => {
	pluginOptions.value = (await api.pluginList.query()).plugins
		.filter((item) => item.kind === 'pod')
		.map((item) => ({
			label: item.id,
			value: item.id,
		}))
})
const formData = reactive<{
	name: string
	pluginId: string
	collectionUuid: string
}>({
	name: '',
	pluginId: '',
	collectionUuid: '',
})
watch(props, (val) => {
	formData.collectionUuid = val.data.collectionUuid
})

async function doSubmit() {
	await api.podAdd.mutate(formData)
	emit('submit')
}
</script>
