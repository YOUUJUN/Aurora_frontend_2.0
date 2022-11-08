<script setup lang="ts">
import Dialog from './Dialog.vue';

const url = "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";

</script>

<template>

    <section class="container bg2">

        <header class="header bg1">

            <div class="left">

                <el-avatar shape="square" :size="160" fit="fill" :src="url"></el-avatar>

            </div>


            <div class="right">

                <h2 class="name">YOUJUN</h2>
                <P class="describe">Hello world</P>
                <Dialog />


            </div>

        </header>


        <main class="main">

            <el-tabs class="tabs">
                <el-tab-pane label="User" name="first">User</el-tab-pane>
                <el-tab-pane label="Config" name="second">Config</el-tab-pane>
                <el-tab-pane label="Role" name="third">Role</el-tab-pane>
                <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
            </el-tabs>


        </main>

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
.main :deep(.el-tabs__nav-wrap::after) {
    background-color: inherit;
}

.container {
    display: flex;
    flex-direction: column;
    border-radius: 20px;
}

.header {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex: 0;
    padding: 25px 15px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}

.header .left {
    margin-right: 20px;
}

.header .right {
    display: flex;
    flex-direction: column;
}


.main {
    flex: 1;
    width: 100%;
}

.name {
    margin: 5px 0;
}

.describe {
    padding: 0;
    margin: 6px 0;
}


/*--main--*/

.tabs {
    padding: 10px 20px;
}
</style>
