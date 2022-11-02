<script setup lang="ts">
// import { FullScreen, Close, Minus } from '@element-plus/icons';
// import { sendMessageToNode } from '@/RendererProcess/utilities/index';


</script>
<template>

    <div class="customTitleBar bg1">

        <div class="leftSide">
            <p>侦察姬</p>
        </div>

        <div class="rightSide">

            <div class="user-wrap">

                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" size="small">
                </el-avatar>

            </div>

            <div class="ctrlBtn-wrap">

                <el-button-group>
                    <el-button class="ctrlBtn" size="mini" :icon="Minus" @click="sendMessageToNode('minimize')">
                    </el-button>
                    <el-button class="ctrlBtn" size="mini" :icon="FullScreen" @click="sendMessageToNode('maximize')">
                    </el-button>
                    <el-button class="ctrlBtn" size="mini" :icon="Close" @click="sendMessageToNode('closeWindow')">
                    </el-button>
                </el-button-group>

            </div>

        </div>

    </div>

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

</style>