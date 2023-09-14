<template>
	<div>
		<template v-if="currentCard === null">
			<p>Create a card</p>
		</template>
		<template v-else>
			<h3>{{ currentCard + 1 + ' of ' + cards.length }}</h3>
			<div class="is-flex">
				<div
					class="icon-outer"
					style="
						width: 50px;
						display: flex;
						align-items: center;
						justify-content: center;
					"
					:class="{ 'have-show': leftArrowActive }"
				>
					<ion-icon
						name="chevron-back-outline"
						size="large"
						@click="goLeft"
						class="ion-icon"
						:style="[
							leftArrowActive ? {} : { cursor: 'not-allowed', opacity: 0.2 },
						]"
					></ion-icon>
				</div>
				<Flashcard style="width: 300px">
					<template #front>
						<h1 class="title">{{ cards[currentCard].frontText }}</h1>
					</template>
					<template #back>
						<h1 class="title">{{ cards[currentCard].backText }}</h1>
					</template>
				</Flashcard>
				<div
					class="icon-outer"
					style="
						width: 50px;
						display: flex;
						align-items: center;
						justify-content: center;
					"
					:class="{ 'have-show': rightArrowActive }"
				>
					<ion-icon
						name="chevron-forward-outline"
						size="large"
						@click="goRight"
						class="ion-icon"
						:style="[
							rightArrowActive ? {} : { cursor: 'not-allowed', opacity: 0.2 },
						]"
					></ion-icon>
				</div>
			</div>
			<h3 class="title is-5 mb-0 mt-2">Edit Flashcard</h3>
			<div class="control">
				<label class="label" for="edit-front-text">Front Text</label>
				<div class="field">
					<input class="input" type="text" v-model="formEdit.frontText" />
				</div>
			</div>
			<div class="control">
				<label class="label" for="edit-back-text">Back Text</label>
				<div class="field">
					<input class="input" type="text" v-model="formEdit.backText" />
				</div>
			</div>
			<button
				type="submit"
				class="button is-primary mt-1"
				@click="submitEditFlashcard"
			>
				Edit Text
			</button>
		</template>
	</div>
	<div>
		<h3 class="title is-5 mb-0 mt-2">New Flashcard</h3>
		<div class="control">
			<label class="label" for="front-text">Front Text</label>
			<div class="field">
				<input
					type="text"
					id="front-text"
					class="input"
					v-model="formNew.frontText"
				/>
			</div>
		</div>
		<div class="control">
			<label class="label" for="back-text">Back Text</label>
			<div class="field">
				<input
					type="text"
					id="back-text"
					class="input"
					v-model="formNew.backText"
				/>
			</div>
		</div>
		<button class="button is-primary mt-1" @click="submitNewFlashcard">
			New Flashcard
		</button>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { trpcClient } from '@quasipanacea/common/client/index.js'
import type { PluginAppRouter } from '@quasipanacea/plugin.pod.flashcard.controller/shared/s.ts'

import Flashcard from './util/Flashcard.vue'

const api = trpcClient.yieldClient<PluginAppRouter>()

const route = useRoute()
function getUuid(): string {
	const uuid = route.params.podUuid
	if (!uuid) throw new Error('uuid must be defined')
	if (Array.isArray(uuid)) throw new Error('uuid must not be an array')
	return uuid
}
const uuid = getUuid()

type Flashcard_t = { frontText: string; backText: string }

const leftArrowActive = ref(false)
const rightArrowActive = ref(false)
const currentCard = ref<number | null>(null)
const cards = ref<Flashcard_t[]>([])

watch([cards, currentCard], ([cardsValue, currentCardValue]) => {
	leftArrowActive.value = false
	rightArrowActive.value = false

	if (currentCardValue !== null) {
		if (currentCardValue > 0) {
			leftArrowActive.value = true
		}
		if (currentCardValue < cardsValue.length - 1) {
			rightArrowActive.value = true
		}
	}
})

function goLeft() {
	if (leftArrowActive.value === true) {
		if (currentCard.value !== null) {
			currentCard.value -= 1
		}
	}
}

function goRight() {
	if (rightArrowActive.value === true) {
		if (currentCard.value !== null) {
			currentCard.value += 1
		}
	}
}

const formEdit = reactive({
	frontText: '',
	backText: '',
})
watch([cards, currentCard], ([cardsValue, currentCardValue]) => {
	if (currentCardValue === null) {
		return
	}

	const item = cardsValue[currentCardValue]
	formEdit.backText = item.backText
	formEdit.frontText = item.frontText
})
async function submitEditFlashcard() {
	await api.plugins.pod.flashcard.editFlashcard.mutate({
		uuid,
		index: currentCard.value || 0,
		frontText: formEdit.frontText,
		backText: formEdit.backText,
	})
	await updateData()
}

const formNew = reactive({
	frontText: '',
	backText: '',
})
async function submitNewFlashcard() {
	await api.plugins.pod.flashcard.addFlashcard.mutate({
		uuid,
		frontText: formNew.frontText,
		backText: formNew.backText,
	})
	await updateData()
}

onMounted(async () => {
	await updateData()
})

async function updateData() {
	const flashcards = await api.plugins.pod.flashcard.readFlashcards.query({
		uuid,
	})
	cards.value = flashcards

	if (currentCard.value === null && cards.value.length > 0) {
		currentCard.value = 0
	}
}
</script>

<style>
.ion-icon {
	cursor: pointer;
}

.icon-outer:not(.have-show) .ion-icon:hover {
	scale: 1.1;
}

.icon-outer:not(.have-show) .ion-icon:active {
	scale: 1.2;
}
</style>
