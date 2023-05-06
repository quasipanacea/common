<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<h2 class="title is-4">Anchor: Create Child</h2>

		<div class="control">
			<label class="label">Name</label>
			<input class="input" type="text" v-model="form.name" />
		</div>

		<div class="control">
			<label class="label">Type</label>
			<div class="select">
				<select v-model="form.childType">
					<option v-for="value of childTypes" :id="value">
						{{ value }}
					</option>
				</select>
			</div>
		</div>

		<div class="control">
			<label class="label">Plugin</label>
			<div class="select" v-if="form.childType === 'pod'">
				<select v-model="form.podPlugin">
					<option v-for="value of podPlugins" :value="value">
						{{ value }}
					</option>
				</select>
			</div>
		</div>

		<div class="control">
			<button class="button is-primary" @click.prevent="doSubmit">
				Submit
			</button>
		</div>
	</PopupComponent>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch, ref } from 'vue'

import { apiObj as api } from '@quasipanacea/common/trpcClient.ts'

import type * as t from '@quasipanacea/common/types.js'
import PopupComponent from '../PopupComponent.vue'

const emit = defineEmits(['cancel', 'submit'])
const props = defineProps<{
	show: boolean
	data: {
		anchorUuid: string
	}
}>()

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

async function doSubmit() {
	if (form.childType === 'orb') {
		await api.core.orbAdd.mutate({
			name: form.name,
			anchor: {
				uuid: props.data.anchorUuid,
			},
		})
	} else if (form.childType === 'pod') {
		await api.core.podAdd.mutate({
			name: form.name,
			plugin: form.podPlugin,
			anchor: {
				uuid: props.data.anchorUuid,
			},
		})
	}
	emit('submit')
}
</script>
