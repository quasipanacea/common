<template>
	<div>
		<h2 class="title is-4">Model: Create Child</h2>

		<div class="field">
			<label class="label">Name</label>
			<div class="control">
				<input class="input" type="text" v-model="form.name" />
			</div>
		</div>

		<div class="field">
			<label class="label">Type</label>
			<div class="control">
				<div class="select">
					<select v-model="form.childType">
						<option v-for="value of childTypes" :id="value">
							{{ value }}
						</option>
					</select>
				</div>
			</div>
		</div>

		<div v-if="form.childType === 'pod'" class="field">
			<label class="label">Plugin</label>
			<div class="control">
				<div class="select">
					<select v-model="form.podPlugin">
						<option v-for="value of podPlugins" :value="value">
							{{ value }}
						</option>
					</select>
				</div>
			</div>
		</div>

		<div class="field">
			<div class="control">
				<button class="button is-primary" @click.prevent="submitData">
					Submit
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch, ref } from 'vue'

import { useApi3, type BareAppRouter } from '@quasipanacea/common/trpcClient.ts'
import { hidePopupNoData } from '@quasipanacea/common/client/popup'

const props = defineProps<{
	modelUuid: string
	validationFn: () => boolean
}>()

const api = useApi3<BareAppRouter>()

const childTypes = ref(['orb', 'pod'])
const podPlugins = ref<string[]>([])
onMounted(async () => {
	const { plugins } = await api.core.pluginList.query({ kind: 'pod' })
	podPlugins.value = plugins.map((p) => p.id)
	form.podPlugin = podPlugins.value[0]
})

const form = reactive<{
	name: string
	childType: string
	podPlugin: string
}>({
	name: '',
	childType: childTypes.value[0],
	podPlugin: '',
})

async function submitData() {
	if (form.childType === 'orb') {
		await api.core.orbAdd.mutate({
			name: form.name,
			model: {
				uuid: props.modelUuid,
			},
		})
	} else if (form.childType === 'pod') {
		await api.core.podAdd.mutate({
			name: form.name,
			plugin: form.podPlugin,
			model: {
				uuid: props.modelUuid,
			},
		})
	}
	hidePopupNoData('null')
}
</script>
