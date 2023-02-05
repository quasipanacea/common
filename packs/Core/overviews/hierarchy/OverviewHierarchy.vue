<template>
	<div>
		<div style="display: flex; align-items: center; gap: 3px">
			<h1>Areas</h1>
			<FormKit type="button" @click="loadAreas">Refresh</FormKit>
		</div>
		<ul v-for="area in areaList" :key="area">
			<div
				style="
					display: flex;
					justify-content: space-between;
					max-width: 300px;
					border-block-end: 1px solid gray;
				"
			>
				<li @click="areaClick(area)">
					{{ area }}
				</li>
				<FormKit type="submit" @click="removeArea(area)">Delete</FormKit>
			</div>
		</ul>
		<div style="display: flex">
			<FormKit type="text" v-model="areaNewName" /><FormKit
				type="button"
				@click="addArea"
				>New</FormKit
			>
		</div>

		<h1>Topics of {{ areaCurrent }}</h1>
		<ul v-for="topic in topicList" :key="topic">
			<div
				style="
					display: flex;
					justify-content: space-between;
					max-width: 300px;
					border-block-end: 1px solid gray;
				"
			>
				<li @click="topicClick(topic)">{{ topic }}</li>
				<FormKit type="submit" @click="removeTopic(topic)">Delete</FormKit>
			</div>
		</ul>
		<div style="display: flex">
			<FormKit type="text" v-model="topicNewName" /><FormKit
				type="button"
				@click="addTopic"
				>New</FormKit
			>
		</div>

		<h1>Notes of {{ topicCurrent }}</h1>
		<ul v-for="note in noteList" :key="note">
			<div
				style="
					display: flex;
					justify-content: space-between;
					max-width: 300px;
					border-block-end: 1px solid gray;
				"
			>
				<li>
					<router-link
						:to="`/note-old?area=${areaCurrent}&topic=${topicCurrent}&note=${note}`"
						>{{ note }}</router-link
					>
				</li>
				<FormKit type="submit" @click="removeNote(note)">Delete</FormKit>
			</div>
		</ul>
		<div style="display: flex">
			<FormKit type="group" v-model="noteForm">
				<FormKit type="text" name="newName" validation="required" />
				<FormKit
					type="select"
					name="newType"
					:options="noteTypeOptions"
					default="markdown"
					validation="required"
					@click="addNote"
				></FormKit>
				<FormKit type="button" @click="addNote">New</FormKit>
			</FormKit>
		</div>
	</div>
</template>

<script lang="ts">
import { FormKit } from '@formkit/vue'
import { defineComponent, ref, watch, reactive } from 'vue'
import * as api from '@/util/apiv2'

export default defineComponent({
	components: {
		FormKit,
	},
	setup() {
		const areaCurrent = ref('')
		const areaList = ref<string[]>([])
		const areaNewName = ref('')

		async function loadAreas() {
			const result = await api.areaList({})
			if (!result) return

			areaList.value = result.areas
		}
		async function addArea() {
			const result = await api.areaAdd({
				name: areaNewName.value,
			})
			if (!result) return

			await loadAreas()
			areaNewName.value = ''
		}
		async function removeArea(areaName: string) {
			if (!confirm(`Delete ${areaName}?`)) {
				return
			}

			const result = await api.areaRemove({
				name: areaName,
			})
			if (!result) return

			await loadAreas()
		}
		async function areaClick(newCurrent: string) {
			areaCurrent.value = newCurrent
			await loadTopics(areaCurrent.value)
		}
		watch(areaList, (newAreaList) => {
			if (!newAreaList.includes(areaCurrent.value)) {
				areaCurrent.value = newAreaList[0] || ''
			}
		})
		watch(areaCurrent, async (newAreaCurrent, oldAreaCurrent) => {
			if (newAreaCurrent !== oldAreaCurrent) {
				await loadTopics(newAreaCurrent)
			}
		})

		// topics
		const topicCurrent = ref('')
		const topicList = ref<string[]>([])
		const topicNewName = ref('')
		async function loadTopics(areaName: string) {
			if (!areaName) {
				areaList.value = []
			}

			const result = await api.topicList({
				area: areaName,
			})
			if (!result) return

			topicList.value = result.topics
		}
		async function topicClick(newTopic: string) {
			topicCurrent.value = newTopic
			await loadNotes(areaCurrent.value, topicCurrent.value)
		}
		async function addTopic() {
			const result = await api.topicAdd({
				area: areaCurrent.value,
				name: topicNewName.value,
			})
			if (!result) return

			await loadTopics(areaCurrent.value)
			topicNewName.value = ''
		}
		async function removeTopic(topicName: string) {
			if (!confirm(`Delete ${topicName}?`)) {
				return
			}

			const result = await api.topicRemove({
				area: areaCurrent.value,
				name: topicName,
			})
			if (!result) return

			await loadTopics(areaCurrent.value)
			await loadNotes(areaCurrent.value, topicCurrent.value)
		}
		watch(topicList, (newTopicList) => {
			topicCurrent.value = newTopicList[0] || ''
		})
		watch(topicCurrent, async (newTopicCurrent, oldTopicCurrent) => {
			if (newTopicCurrent !== oldTopicCurrent) {
				await loadNotes(areaCurrent.value, newTopicCurrent)
			}
		})

		// notes
		const noteList = ref<string[]>([])
		const noteForm = reactive<{
			newName: string
			newType: string
		}>({ newName: '', newType: '' })
		const noteTypeOptions = ['markdown']
		async function loadNotes(areaName: string, topicName: string) {
			if (!areaName || !topicName) {
				if (!areaName) topicList.value = []
				if (!topicName) noteList.value = []
				return
			}

			const result = await api.noteList({
				area: areaName,
				topic: topicName,
			})
			if (!result) return

			noteList.value = result.notes
		}
		async function addNote() {
			if (!noteForm.newName) return

			const result = await api.noteAdd({
				area: areaCurrent.value,
				topic: topicCurrent.value,
				name: noteForm.newName,
			})
			if (!result) return

			await loadNotes(areaCurrent.value, topicCurrent.value)
			noteForm.newName = ''
		}
		async function removeNote(noteName: string) {
			if (!confirm(`Delete ${noteName}?`)) {
				return
			}

			const result = await api.noteRemove({
				area: areaCurrent.value,
				topic: topicCurrent.value,
				name: noteName,
			})
			if (!result) return

			await loadNotes(areaCurrent.value, topicCurrent.value)
		}

		;(async () => {
			await loadAreas()
		})()

		return {
			areaList,
			areaCurrent,
			areaNewName,
			loadAreas,
			addArea,
			removeArea,
			areaClick,

			topicList,
			topicCurrent,
			topicNewName,
			loadTopics,
			addTopic,
			removeTopic,
			topicClick,

			noteList,
			noteTypeOptions,
			noteForm,
			addNote,
			removeNote,
		}
	},
})
</script>
