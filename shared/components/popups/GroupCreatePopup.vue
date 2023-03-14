<template>
	<PopupComponent :show="show" @cancel="$emit('cancel')">
		<form class="pure-form pure-form-aligned">
			<fieldset>
				<legend><h2>Create Group</h2></legend>

				<div class="pure-control-group">
					<label for="name">Name</label>
					<input type="text" id="name" required v-model="formData.name" />
				</div>

				<div class="pure-control-group">
					<label for="plugin-id">Plugin ID</label>
					<select
						name="pluginId"
						id="plugin-id"
						v-model="formData.pluginId"
						required
					>
						<option
							v-for="(plugin, i) in groupPluginOptions"
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
						@click.prevent="doSubmit"
					/>
				</div>
			</fieldset>
		</form>
	</PopupComponent>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";

import { apiObj as api } from "@/util/api";

import type * as t from "@common/types";
import PopupComponent from "@/components/PopupComponent.vue";

defineProps<{
	show: boolean;
	data: {};
}>();
const emit = defineEmits(["cancel", "submit"]);

const groupPluginOptions = ref<{ label: string; value: string }[]>([]);
onMounted(async () => {
	groupPluginOptions.value = (await api.core.pluginList.query()).plugins
		.filter((item) => item.kind === "group")
		.map((item) => ({
			label: item.id,
			value: item.id,
		}));
});

const formData = reactive<{
	name: string;
	pluginId: string;
	groupUuid: string;
}>({
	name: "",
	pluginId: "",
	groupUuid: "",
});

async function doSubmit() {
	await api.core.groupAdd.mutate(formData);
	emit("submit");
}
</script>
