<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<form class="pure-form pure-form-aligned">
			<fieldset>
				<legend><h2>Rename Collection</h2></legend>
				<div class="pure-control-group">
					<label for="old-name">Old Name</label>
					<input
						id="old-name"
						type="text"
						v-model="props.data.oldName"
						disabled
					/>
				</div>

				<div class="pure-control-group">
					<label for="new-name">New Name</label>
					<input
						id="new-name"
						type="text"
						v-model="formData.newName"
						required
					/>
				</div>

				<div class="pure-controls">
					<input type="submit" class="pure-button" @click.prevent="doSubmit" />
				</div>
			</fieldset>
		</form>
	</PopupComponent>
</template>

<script setup lang="ts">
import { api } from '@/util/api'
import { reactive, watch } from 'vue'

import type * as t from '@common/types'
import PopupComponent from '@/components/PopupComponent.vue'

const emit = defineEmits(['cancel', 'submit'])
const props = defineProps<{
	show: boolean
	data: {
		oldName: string
		collectionUuid: string
	}
}>()

const formData = reactive<{
	newName: string
}>({
	newName: '',
})

async function doSubmit() {
	await api.collectionRename.mutate({
		uuid: props.data.collectionUuid,
		newName: formData.newName,
	})
	emit('submit')
}
</script>
