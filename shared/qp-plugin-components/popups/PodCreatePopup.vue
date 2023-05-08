<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<form class="pure-form pure-form-aligned">
			<fieldset>
				<legend><h2>Pod: Create</h2></legend>

				<div class="pure-control-group">
					<label for="name">Name</label>
					<input id="name" type="text" v-model="form.name" required />
				</div>

				<div class="pure-control-group">
					<label for="plugin">Plugin</label>
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

				<div class="pure-control-group">
					<label for="group-uuid">Group UUID</label>
					<input
						id="group-uuid"
						type="text"
						v-model="form.model.uuid"
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

const pluginOptions = ref<{ label: string; value: string }[]>([])
onMounted(async () => {
	pluginOptions.value = (await api.core.pluginList.query()).plugins
		.filter((item) => item.kind === 'pod')
		.map((item) => ({
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
		uuid: '',
	},
})
watch(props, (val) => {
	form.model.uuid = val.data.modelUuid
})

async function doSubmit() {
	await api.core.podAdd.mutate(form)
	emit('submit')
}
</script>
