<template>
	<div ref="cytoscapeEl" style="height: 100%"></div>
	<div style="position: absolute; top: 0; right: 0">
		<span class="button" style="margin: 5px">
			{{
				currentMode === 'default'
					? 'Node Move'
					: currentMode === 'shift'
					? 'Draw Connection'
					: currentMode === 'control'
					? 'Node Add/Remove'
					: 'Node Move'
			}}
		</span>

		<div class="dropdown is-right is-hoverable" style="margin: 5px">
			<div class="dropdown-trigger">
				<button
					class="button"
					aria-haspopup="true"
					aria-controls="dropdown-menu"
				>
					<span>Options</span>
					<span class="icon is-small">
						<i class="fas fa-angle-down" aria-hidden="true"></i>
					</span>
				</button>
			</div>
			<div class="dropdown-menu" id="dropdown-menu" role="menu">
				<div class="dropdown-content">
					<a class="dropdown-item" @click="popup.showNoData('null', GuidePopup)"
						>Show Guide</a
					>
				</div>
				<div class="dropdown-content">
					<router-link to="/plugins">
						<a class="dropdown-item">Plugins</a>
					</router-link>
				</div>
				<div class="dropdown-content">
					<div class="dropdown-item">
						<div class="select">
							<select v-model="currentLayout">
								<option value="automatic">Automatic Layout</option>
								<option value="manual">Manual Layout</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
</script>
