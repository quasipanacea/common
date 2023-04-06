<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<form class="pure-form pure-form-aligned">
			<fieldset>
				<legend><h2>Create Anchor</h2></legend>

				<div class="pure-control-group">
					<label for="name">Name</label>
					<input type="text" id="name" required v-model="form.name" />
				</div>

				<div class="pure-control-group">
					<label for="plugin-id">Plugin</label>
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
import { onMounted, reactive, ref } from 'vue'

import type * as t from '@quasipanacea/common/types'
import { apiObj as api } from '@quasipanacea/common/trpcClient.ts'

import PopupComponent from '../PopupComponent.vue'

const props = defineProps<{
	show: boolean
}>()
const emit = defineEmits(['cancel', 'submit'])

const plugins = ref<t.Plugin_t[]>([])
onMounted(async () => {
	plugins.value = (await api.core.pluginList.query({ kind: 'anchor' })).plugins
})

const form = reactive<{
	name: string
	plugin: string
}>({
	name: '',
	plugin: '',
})

async function doSubmit() {
	await api.core.anchorAdd.mutate(form)
	emit('submit')
}
</script>
