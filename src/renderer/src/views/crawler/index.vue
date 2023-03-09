<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
	<section class="Crawler">
		<router-view v-slot="{ Component }">
			<keep-alive v-if="route.meta.keepAlive">
				<component :is="Component" />
			</keep-alive>

			<template v-if="!route.meta.keepAlive">
				<component :is="Component" v-if="!route.meta.keepAlive" />
			</template>
		</router-view>
	</section>
</template>

<style scoped>
.Crawler {
	position: absolute;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	width: 100%;
	overflow: hidden;
}
</style>
