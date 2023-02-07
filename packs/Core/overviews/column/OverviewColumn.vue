<template>
	<div style="display: flex; flex-direction: row; height: 100%">
		<template v-for="collection of collections" :key="collection">
			<div style="width: 200px; margin: 5px">{{ collection }}</div>
			<div style="border: 1px solid var(--oc-gray-3)"></div>
		</template>
		<div style="min-width: 200px; text-align: center; margin-top: 180px">
			<button class="pure-button pure-button-primary" @click="newCollection">
				New Collection
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { tc } from '@/util/trpc'
import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from 'common/routes'

export default defineComponent({
	setup() {
		let collections = ref<
			inferRouterOutputs<AppRouter>['collectionList']['collections']
		>([])
		onMounted(async () => {
			await updateCollections()
		})

		async function newCollection() {
			await tc.collectionAdd.mutate({
				name: 'string',
				owningPlugin: 'see',
			})
			await updateCollections()
		}

		async function updateCollections() {
			collections.value = (await tc.collectionList.query()).collections
		}
		return {
			collections,
			newCollection,
		}
	},
})
</script>
