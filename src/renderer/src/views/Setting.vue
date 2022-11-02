<script setup lang="ts">
import { ref } from 'vue';

let drawer = ref(false);

function openSetting() {
    console.log('ok')
    drawer.value = true;
}

defineExpose({
    openSetting
})

</script>

<template>

    <section class="container">
        <el-drawer custom-class="Setting blurred_bg blur40 bg2" modal-class="Setting-model" v-model="drawer"
            title="I am the title" direction="btt" size="auto">
            <span>Hi, there!</span>
        </el-drawer>
    </section>

</template>

<script lang="ts">
export default {
    data() {
        return {
        };
    }
}
</script>

<style scoped>
.container {
    padding: 10px;
}

.container:deep(.el-drawer) {
    background-color: unset;
}

.container:deep(.Setting) {
    top: 10px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    height: auto;
    width: auto;
    border: 1px solid rgba(255, 255, 255, 0.315);
    border-radius: 20px;
}

.container:deep(.Setting-model) {
    top: 40px;
    height: auto;
}
</style>