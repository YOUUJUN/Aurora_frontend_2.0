<script setup lang="ts"></script>

<template>
	<article class="Home">
		<router-view></router-view>
	</article>
</template>

<script lang="ts">
export default {
	data() {
		return {}
	},
}
</script>

<style scoped>
.Home {
	position: absolute;
	top: 0;
	bottom: 0;
	width: 100%;
	overflow: hidden;
}
</style>
