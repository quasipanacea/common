<template>
	<div style="display: flex; flex-direction: row; height: 100%">
		<template v-for="collection of collections" :key="collection">
			<div>
				<button @click="deleteCollection(collection.uuid)" class="pure-button">
					Delete
				</button>
				<button
					@click="showPopupCreatePod(collection.uuid)"
					class="pure-button pure-button-primary"
				>
					New Pod
				</button>
				<div style="width: 200px; margin: 5px">
					<h2 style="display: inline">{{ collection.name }}</h2>
					<span> ({{ collection.pluginId }})</span>
					<div v-for="pod of collectionsObj[collection.uuid]">
						<a :href="'/pod/' + pod.uuid">{{ pod.name }} </a>
						<span> ({{ pod.pluginId }})</span>
					</div>
				</div>
			</div>
			<div style="border: 1px solid var(--oc-gray-3)"></div>
		</template>
		<div style="min-width: 200px; text-align: center; margin-top: 180px">
			<button
				class="pure-button pure-button-primary"
				@click="showPopupCreateCollection"
			>
				New Collection
			</button>
		</div>
	</div>
	<PopupComponent event-name="show-popup-create-collection">
		<form class="pure-form pure-form-aligned">
			<fieldset>
				<legend><h1>Create Collection</h1></legend>

				<div class="pure-control-group">
					<label for="name">Name</label>
					<input
						type="text"
						id="name"
						required
						v-model="collectionFormData.name"
					/>
				</div>

				<div class="pure-control-group">
					<label for="plugin-id">Plugin ID</label>
					<select
						name="pluginId"
						id="plugin-id"
						v-model="collectionFormData.pluginId"
						required
					>
						<option
							v-for="(plugin, i) in collectionPluginOptions"
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
						@click.prevent="createCollection"
					/>
				</div>
			</fieldset>
		</form>
	</PopupComponent>
	<PopupComponent event-name="show-popup-create-pod">
		<form class="pure-form pure-form-aligned">
			<fieldset>
				<legend><h1>Create Pod</h1></legend>

				<div class="pure-control-group">
					<label for="name">Name</label>
					<input type="text" v-model="podFormData.name" required />
				</div>

				<div class="pure-control-group">
					<label for="plugin-id">Plugin ID</label>
					<select
						name="pluginId"
						id="plugin-id"
						v-model="podFormData.pluginId"
						required
					>
						<option
							v-for="item in podPluginOptions"
							:key="item.value"
							:value="item.value"
						>
							{{ item.label }}
						</option>
					</select>
				</div>

				<div class="pure-controls">
					<input
						type="submit"
						class="pure-button"
						value="Create"
						@click.prevent="createPod"
					/>
				</div>
			</fieldset>
		</form>
	</PopupComponent>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'

import PopupComponent from '@/components/PopupComponent.vue'
import { emitter } from '@/util/emitter'
import type * as t from '@common/types'
import { api } from '@/util/api'

export default defineComponent({
	setup() {
		let collections = ref<t.Collection_t[]>([])
		let collectionsObj = reactive<Record<string, t.Pod_t[]>>({})

		const collectionPluginOptions = ref<{ label: string; value: string }[]>([])
		const collectionFormData = reactive({ name: '', pluginId: '' })

		const podPluginOptions = ref<{ label: string; value: string }[]>([])
		const podFormData = reactive({
			name: '',
			collectionUuid: '',
			pluginId: '',
		})

		onMounted(async () => {
			await updateCollections()

			const plugins = await api.pluginList.query()
			collectionPluginOptions.value = plugins.plugins
				.filter((item) => item.kind === 'collection')
				.map((item) => ({
					label: item.id,
					value: item.id,
				}))
			podPluginOptions.value = plugins.plugins
				.filter((item) => item.kind === 'pod')
				.map((item) => ({
					label: item.id,
					value: item.id,
				}))
		})

		async function updateCollections() {
			collections.value = (await api.collectionList.query()).collections

			const pods = (await api.podList.query()).pods
			for (const collectionUuid of Array.from(
				new Set(pods.map((item) => item.collectionUuid)),
			)) {
				const arr = pods.filter(
					(item) => item.collectionUuid === collectionUuid,
				)
				collectionsObj[collectionUuid] = arr
			}
		}

		return {
			collections,
			collectionsObj,
			collectionPluginOptions,
			collectionFormData,
			podPluginOptions,
			podFormData,
			showPopupCreateCollection() {
				emitter.emit('show-popup-create-collection')
			},
			showPopupCreatePod(uuid: string) {
				podFormData.collectionUuid = uuid
				emitter.emit('show-popup-create-pod')
			},
			async getCollectionPods(collectionUuid: string) {
				const result = await api.podList.query()
				const pods = result.pods.filter((item) => {
					return (item.collectionUuid = collectionUuid)
				})

				return pods
			},
			async createCollection() {
				await api.collectionAdd.mutate(collectionFormData)
				await updateCollections()
			},
			async deleteCollection(uuid: string) {
				if (globalThis.confirm('Are you sure?')) {
					await api.collectionRemove.mutate({ uuid })
					await updateCollections()
				}
			},
			async createPod() {
				await api.podAdd.mutate(podFormData)
				await updateCollections()
			},
		}
	},
	components: { PopupComponent },
})
</script>
