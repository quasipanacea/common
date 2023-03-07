<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<form class="pure-form pure-form-aligned">
			<fieldset>
				<legend><h2>Rename Pod</h2></legend>
				<div class="pure-control-group">
					<label for="old-name">Old Name</label>
					<input id="old-name" type="text" v-model="props.oldName" disabled />
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
					<input type="submit" class="pure-button" @click.disabled="doSubmit" />
				</div>
			</fieldset>
		</form>
	</PopupComponent>
</template>

<script setup lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'

import { apiObj as api } from '@/util/api'

import type * as t from '@common/types'
import PopupComponent from '@/components/PopupComponent.vue'

const emit = defineEmits(['cancel', 'submit'])
const props = defineProps<{
	show: boolean
	oldName: string
	podUuid: string
}>()

const formData = reactive<{
	newName: string
}>({
	newName: '',
})

async function doSubmit() {
	await api.core.podRename.mutate({
		uuid: props.podUuid,
		newName: formData.newName,
	})
	emit('submit')
}
</script>
