<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<form class="pure-form pure-form-aligned">
			<fieldset>
				<legend><h2>Create Group</h2></legend>

				<div class="pure-control-group">
					<label for="name">Name</label>
					<input type="text" id="name" required v-model="form.name" />
				</div>

				<div class="pure-control-group">
					<label for="plugin">Plugin</label>
					<select name="plugin" id="plugin" v-model="form.plugin" required>
						<option
							v-for="plugin in groupPluginOptions"
							:value="plugin.value"
							:key="plugin.value"
						>
							{{ plugin.label }}
						</option>
					</select>
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

import { apiObj as api } from '@quasipanacea/common/trpcClient'

import type * as t from '@quasipanacea/common/types'
import PopupComponent from '../PopupComponent.vue'

defineProps<{
	show: boolean
	data: {}
}>()
const emit = defineEmits(['cancel', 'submit'])

const groupPluginOptions = ref<{ label: string; value: string }[]>([])
onMounted(async () => {
	groupPluginOptions.value = (await api.core.pluginList.query()).plugins
		.filter((item) => item.kind === 'group')
		.map((item) => ({
			label: item.id,
			value: item.id,
		}))
})

const form = reactive<{
	name: string
	plugin: string
	groupUuid: string
}>({
	name: '',
	plugin: '',
	groupUuid: '',
})

async function doSubmit() {
	await api.core.groupAdd.mutate(form)
	emit('submit')
}
</script>
