<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
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
					@click.prevent="doSubmit"
				/>
			</div>
		</div>
	</PopupComponent>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'

import { useApi3, type BareAppRouter } from '@quasipanacea/common/trpcClient.ts'
import type * as t from '@quasipanacea/common/types.js'

import PopupComponent from '../PopupComponent.vue'

const props = defineProps<{
	show: boolean
	data: {
		modelUuid: string
	}
}>()
const emit = defineEmits(['cancel', 'submit'])

const api = useApi3<BareAppRouter>()

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
