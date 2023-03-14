<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<form class="pure-form pure-form-aligned">
			<fieldset>
				<legend><h2>Create Cover</h2></legend>

				<div class="pure-control-group">
					<label for="name">Name</label>
					<input type="text" id="name" required v-model="formData.name" />
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
							v-for="(plugin, i) in groupPluginOptions"
							:value="plugin.value"
							:key="plugin.value"
						>
							{{ plugin.label }}
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
						value="Create"
						class="pure-button"
						@click.prevent="doSubmit"
					/>
				</div>
			</fieldset>
		</form>
	</PopupComponent>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'

import { apiObj as api } from '@/util/api'

import type * as t from '@common/types'
import PopupComponent from '@/components/PopupComponent.vue'

const props = defineProps<{
	show: boolean
	data: {
		groupUuid: string
	}
}>()
const emit = defineEmits(['cancel', 'submit'])

const groupPluginOptions = ref<{ label: string; value: string }[]>([])
onMounted(async () => {
	groupPluginOptions.value = (await api.core.pluginList.query()).plugins
		.filter((item) => item.kind === 'cover')
		.map((item) => ({
			label: item.id,
			value: item.id,
		}))
})

const formData = reactive<{
	name: string
	pluginId: string
	groupUuid: string
}>({
	name: '',
	pluginId: '',
	groupUuid: '',
})
watch(props, (val) => {
	formData.groupUuid = val.data.groupUuid
})

async function doSubmit() {
	await api.core.coverAdd.mutate(formData)
	emit('submit')
}
</script>
