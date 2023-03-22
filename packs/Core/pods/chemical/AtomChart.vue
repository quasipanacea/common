<template>
	<h1>ChartJS</h1>
	<canvas
		ref="chartEl"
		width="400"
		height="100"
		aria-label="Hello ARIA World"
		role="img"
	></canvas>
</template>

<script setup lang="ts">
import Chart from 'chart.js/auto'
import { onMounted, ref } from 'vue'

const chartEl = ref<HTMLElement>()
onMounted(() => {
	const data = [
		{ year: 2010, count: 10 },
		{ year: 2011, count: 20 },
		{ year: 2012, count: 15 },
		{ year: 2013, count: 25 },
		{ year: 2014, count: 22 },
		{ year: 2015, count: 30 },
		{ year: 2016, count: 28 },
	]

	new Chart(chartEl.value, {
		type: 'bar',
		data: {
			labels: data.map((row) => row.year),
			datasets: [
				{
					label: 'Acquisitions by year',
					data: data.map((row) => row.count),
				},
			],
		},
	})
})
</script>
