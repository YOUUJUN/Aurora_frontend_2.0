<script setup lang="ts">
import { sendMessageToNode } from '@renderer/utils/ipc'
import { FullScreen, Close, Minus } from '@element-plus/icons-vue'
</script>
<template>
	<div class="customTitleBar">
		<div class="leftSide">
			<p>侦察姬</p>
		</div>

		<div class="rightSide">
			<!-- <div class="user-wrap">

                <el-avatar src="@renderer/assets/images/template/rainbow.png" size="small">
                </el-avatar>

            </div>

            <div class="ctrlBtn-wrap">

                <el-button-group>
                    <el-button class="ctrlBtn" size="small" :icon="Minus" @click="sendMessageToNode('minimize')">
                    </el-button>
                    <el-button class="ctrlBtn" size="small" :icon="FullScreen" @click="sendMessageToNode('maximize')">
                    </el-button>
                    <el-button class="ctrlBtn" size="small" :icon="Close" @click="sendMessageToNode('closeWindow')">
                    </el-button>
                </el-button-group>

            </div> -->
		</div>
	</div>
</template>
<script lang="ts">
export default {
	data() {
		return {}
	},
}
</script>

<style scoped>
.customTitleBar {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 5px 10px 5px 20px;
	width: 100%;
	height: 100%;
	-webkit-app-region: drag;
}

.leftSide {
	display: flex;
	flex-direction: row;
}

.leftSide p {
	font-size: 0.9em;
	margin: 0;
	padding: 0;
}

.rightSide {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
}

/*-用户-*/

.user-wrap {
	display: flex;
	margin-right: 10px;
}

/*-窗体按钮-*/
.ctrlBtn-wrap {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.ctrlBtn-wrap .ctrlBtn {
	padding: 5px 10px;
}
</style>
