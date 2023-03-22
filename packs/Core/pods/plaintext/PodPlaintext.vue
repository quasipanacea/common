<template>
	<div style="width: 100%; height: 100%">
		<textarea
			class="textarea"
			placeholder="Loading..."
			v-model="content"
			@keyup="handleKeyup"
		></textarea>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

import CodeMirror from "@common/shared/components/CodeMirror.vue";
import { apiObj } from "@/util/api";
import { useApi } from "@common/shared/util/c";

import type { InferenceOnlyApi } from "./c";
import { onMounted, ref } from "vue";

const api = useApi<InferenceOnlyApi>(apiObj);

const route = useRoute();
function getUuid(): string {
	const uuid = route.params.uuid;
	if (!uuid) throw new Error("uuid must be defined");
	if (Array.isArray(uuid)) throw new Error("uuid must not be an array");
	return uuid;
}
const uuid = getUuid();

const content = ref("");
onMounted(async () => {
	const result = await api.plugins.pods.plaintext.read.query({ uuid });
	content.value = result.content;
});
async function handleKeyup(): Promise<void> {
	await api.plugins.pods.plaintext.write.mutate({
		uuid,
		content: content.value,
	});
}
</script>
