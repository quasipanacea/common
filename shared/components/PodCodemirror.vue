<template>
	<div class="container">
		<codemirror
			v-model="documentText"
			:extensions="mirrorExtensions"
			@ready="mirrorReady"
			@keydown="saveOnCtrlS"
		/>
	</div>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, shallowRef, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { debounce } from "lodash";
import { markdown as mirrorMarkdown } from "@codemirror/lang-markdown";
import { Codemirror } from "vue-codemirror";

export default defineComponent({
	props: {
		onRead: {
			type: Function,
			required: true,
		},
		onWrite: {
			type: Function,
			required: true,
		},
		onOpen: {
			type: Function,
			required: true,
		},
	},
	components: {
		Codemirror,
	},
	setup({ onRead, onWrite, onOpen }) {
		const route = useRoute();

		console.log("router", router, route);

		const documentText = ref("");

		const saveOnType = debounce(async () => {
			await onWrite(documentText.value);
		}, 300);

		async function saveOnCtrlS(ev: KeyboardEvent) {
			if (ev.ctrlKey && ev.code === "KeyS") {
				ev.preventDefault();
				await onWrite(documentText.value);
			} else if (ev.ctrlKey && ev.code === "KeyO") {
				ev.preventDefault();
				await onOpen();
			}
		}

		onMounted(async () => {
			document.addEventListener("keydown", saveOnType);
			const uuid = route.params.uuid;
			if (!uuid) throw new Error("podUuid is undefined");

			const obj = await onRead();
			documentText.value = obj;
		});
		onUnmounted(() => {
			document.removeEventListener("keydown", saveOnType);
		});

		// CodeMirror
		const mirrorExtensions = [mirrorMarkdown() as any];
		const view = shallowRef();
		const mirrorReady = (payload: any) => {
			view.value = payload.view;
		};

		return {
			documentText,
			saveOnCtrlS,
			mirrorExtensions,
			mirrorReady,
		};
	},
});
</script>
