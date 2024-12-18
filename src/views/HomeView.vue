<template>
  <div class="home-page">
    <div class="pg-header">裁决及效果模拟软件</div>
    <div class="pg-content">
      <div class="left-border"></div>
      <div class="right-border"></div>
      <div class="bottom-border"></div>
      <div class="left-panel">
        <ModelPanel @showModal="showModelDialog"/>
        <EffectModelPanel @showModal="showEffectDialog"/>
        <RulePanel @showModal="showRuleDialog"/>
      </div>
      <div class="right-panel">
        <TaskPanel @showModal="showTaskDialog"/>
        <ProgressPanel />
        <InfoPanel />
      </div>
      <div class="bottom-panel">
        <TablePanel />
      </div>
      <TaskDialog :isShow="isShowTaskDialog" @update:isShow="isShowTaskDialog = $event" />
      <ModelDialog :isShow="isShowModelDialog" @update:isShow="isShowModelDialog = $event"/>
      <RuleDialog :isShow="isShowRuleDialog" @update:isShow="isShowRuleDialog = $event"/>
      <EffectDialog :isShow="isShowEffectDialog" @update:isShow="isShowEffectDialog = $event"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import ModelPanel from './LeftPanel/ModelPanel.vue'
import EffectModelPanel from './LeftPanel/EffectModelPanel.vue'
import RulePanel from './LeftPanel/RulePanel.vue'
import TaskPanel from './RightPanel/TaskPanel.vue'
import ProgressPanel from './RightPanel/ProgressPanel.vue'
import InfoPanel from './RightPanel/InfoPanel.vue'
import TablePanel from './BottomPanel/TablePanel.vue'
import TaskDialog from './Dialog/TaskDialog.vue'
import RuleDialog from "./Dialog/RuleDialog.vue"
import ModelDialog from "./Dialog/ModelDialog.vue"
import EffectDialog from "./Dialog/EffectDialog.vue"

// 弹窗控制
const isShowTaskDialog = ref(false);
const isShowModelDialog = ref(false);
const isShowRuleDialog = ref(false);
const isShowEffectDialog = ref(false);

const showTaskDialog = () => {
  isShowTaskDialog.value = true;
};
const showModelDialog = () => {
  isShowModelDialog.value = true;
};
const showRuleDialog = () => {
  isShowRuleDialog.value = true;
};
const showEffectDialog = () => {
  isShowEffectDialog.value = true;
};
</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: url('@/assets/images/bg-home.gif') no-repeat center center;
  background-size: 100% 100%;

  .pg-header {
    height: 129px;
    background: url('@/assets/images/bg-header.png') no-repeat center center;
    background-size: 100% 100%;
    font-size: 32px;
    font-weight: bold;
    color: #F2F3FA;
    text-align: center;
    line-height: 100px;
  }

  .pg-content {
    flex: 1;
    position: relative;

    .left-border {
      position: absolute;
      left: 0;
      top: calc(50% - 322.5px);
      width: 42px;
      height: 645px;
      background: url('@/assets/images/bg-border-left.png') no-repeat center center;
      background-size: 100% 100%;
    }

    .right-border {
      position: absolute;
      right: 0;
      top: calc(50% - 322.5px);
      width: 42px;
      height: 645px;
      background: url('@/assets/images/bg-border-right.png') no-repeat center center;
      background-size: 100% 100%;
    }

    .bottom-border {
      position: absolute;
      bottom: 0;
      left: calc(50% - 930px);
      width: 1860px;
      height: 32px;
      background: url('@/assets/images/bg-border-bottom.png') no-repeat center center;
      background-size: 100% 100%;
    }

    .left-panel {
      position: absolute;
      left: 42px;
      top: -30px;
      bottom: 32px;
      width: 460px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      background-color: rgba(0, 0, 0, 0.2);
    }

    .right-panel {
      position: absolute;
      right: 42px;
      top: -30px;
      bottom: 32px;
      width: 460px;
      padding: 10px;
      background-color: rgba(0, 0, 0, 0.2);
    }

    .bottom-panel {
      position: absolute;
      left: 510px;
      right: 510px;
      bottom: 32px;
      height: 200px;
    }
  }
}
</style>