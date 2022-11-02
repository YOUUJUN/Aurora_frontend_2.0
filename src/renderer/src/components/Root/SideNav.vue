<script setup lang="ts">


</script>

<template>
    <section class="sideNav bg2">

        <div class="header">
            <h3 style="padding:0 30px">功能菜单</h3>
        </div>


        <div class="body">

            <Menu />

        </div>

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
.sideNav {
    position: absolute;
    top: 0;
    bottom: 0;
    flex: 1;
    width: 100%;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.header {
    flex: 0;
    margin: 8px 0;
}

.header h3 {
    margin: 10px 0 4px 0;
}

.body {
    position: relative;
    flex: 1;
}


@media (max-width: 900px) {
    .sideNav {}
}
</style>