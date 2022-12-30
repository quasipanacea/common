<template>
	<div class="container">
		<PodCodemirror :onRead="onRead" :onWrite="onWrite" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PodCodemirror from "../../../../util/PodCodemirror.vue";

export default defineComponent({
	setup() {
		return {
			async onRead(): Promise<string> {
				const text = await fetch("/api/v2/pod/plugin/markdown/read", {
					method: "POST",
					body: JSON.stringify({}, null, "\t"),
				});
				const json = await text.text();
				console.log(json);
				return json;
			},
			async onWrite(text: string): Promise<void> {
				await fetch("/api/v2/plugins/markdown/write", {
					method: "POST",
					body: JSON.stringify(
						{
							content: text,
						},
						null,
						"\t"
					),
				});
			},
		};
	},
	components: {
		PodCodemirror,
	},
});
</script>
