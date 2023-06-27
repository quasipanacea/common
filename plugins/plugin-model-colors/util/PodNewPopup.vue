<template>
	<h2 class="title is-4">Pod: New</h2>

	<div class="field">
		<label class="label">Model Uuid</label>
		<div class="control">
			<input class="input" type="text" v-model="model.uuid" disabled />
		</div>
	</div>

	<div class="field">
		<label class="label">Name</label>
		<div class="control">
			<input class="input" type="text" v-model="form.name" />
		</div>
	</div>

	<div class="field">
		<label for="plugin" class="label">Plugin</label>
		<div class="control">
			<div class="select">
				<select id="plugin" v-model="form.plugin">
					<option v-for="plugin of podPlugins" :key="plugin" :value="plugin">
						{{ plugin }}
					</option>
				</select>
			</div>
		</div>
	</div>

	<div class="field">
		<label for="color" class="label">Color</label>
		<div class="control">
			<div class="select">
				<select id="color" v-model="form.color">
					<option
						v-for="color of ['red', 'blue', 'green', 'yellow']"
						:key="color"
						:value="color"
					>
						{{ color }}
					</option>
				</select>
			</div>
		</div>
	</div>

	<div class="field">
		<div class="control">
			<button class="button is-primary" @click="sendRequest">Submit</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import {
	popup,
	trpcClient,
	type BareAppRouter,
} from '@quasipanacea/common/client/index.js'

const props = defineProps<{
	model: {
		uuid: string
	}
}>()

const api = trpcClient.yieldClient<BareAppRouter>()

const podPlugins = ref<string[]>([])
onMounted(async () => {
	const { plugins } = await api.core.pluginList.query({ family: 'pod' })

	podPlugins.value = plugins.map((plugin) => plugin.id)
})
const form = reactive({
	name: '',
	plugin: '',
	color: '',
})

async function sendRequest() {
	await api.core.podAdd.mutate({
		model: {
			uuid: props.model.uuid,
		},
		plugin: form.plugin,
		name: form.name,
	})
	await api.core.podModifyExtra.mutate({})
	popup.hideNoData('null')
}
</script>
