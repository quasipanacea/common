<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<form class="pure-form pure-form-aligned">
			<fieldset>
				<legend><h2>Rename Group</h2></legend>
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
					<input id="new-name" type="text" v-model="form.newName" required />
				</div>

				<div class="pure-controls">
					<input type="submit" class="pure-button" @click.prevent="doSubmit" />
				</div>
			</fieldset>
		</form>
	</PopupComponent>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

import { apiObj as api } from '@quasipanacea/common/trpcClient.ts'

import type * as t from '@quasipanacea/common/types.js'
import PopupComponent from '../PopupComponent.vue'

const emit = defineEmits(['cancel', 'submit'])
const props = defineProps<{
	show: boolean
	data: {
		oldName: string
		groupUuid: string
	}
}>()

const form = reactive<{
	newName: string
}>({
	newName: '',
})

async function doSubmit() {
	await api.core.groupRename.mutate({
		uuid: props.data.groupUuid,
		newName: form.newName,
	})
	emit('submit')
}
</script>
