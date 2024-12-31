<template>
  <div class="home-page">
    <div class="pg-header">裁决及效果模拟软件</div>
    <div class="pg-content">
      <HeadPanel />
      <MiddlePanel
          :isShow="isShowMiddlePanel"
          :responseData="taskResponseData"
          @close="handleCloseMiddlePanel"
      />
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
      <TaskDialog
          :isShow="isShowTaskDialog"
          @update:isShow="isShowTaskDialog = $event"
          @taskExecuted="handleTaskExecuted"/>
      <ModelDialog :isShow="isShowModelDialog" @update:isShow="isShowModelDialog = $event"/>
      <RuleDialog
          :isShow="isShowRuleDialog"
          @update:isShow="isShowRuleDialog = $event"
          @openNewRuleDialog="openNewRuleDialog"
          @openNewRuleDialog1WithId="openNewRuleDialog1WithId"
          :ruleData="ruleData"
          @taskCompleted="handleTaskCompleted"

      />
      <EffectDialog :isShow="isShowEffectDialog" @update:isShow="isShowEffectDialog = $event"/>
      <NewRuleDialog
          :isShow="isShowNewRuleDialog"
          @update:isShow="isShowNewRuleDialog = $event"
          @saveRuleData="saveRuleData"
          :isEditMode="isEditMode"
          :currentTaskData="currentTaskData"
      />
      <NewRuleDialog1
          :isShow="isShowNewRuleDialog1"
          @update:isShow="isShowNewRuleDialog1 = $event"
          @saveRuleData1="saveRuleData1"
      />
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
import NewRuleDialog from "./Dialog/NewRuleDialog.vue"
import NewRuleDialog1 from "./Dialog/NewRuleDialog1.vue"
import HeadPanel from './HeadPanel/HeadPanel.vue'
import MiddlePanel from './MiddlePanel/MiddlePanel.vue';

// 弹窗控制
const isShowTaskDialog = ref(false);
const isShowModelDialog = ref(false);
const isShowRuleDialog = ref(false);
const isShowEffectDialog = ref(false);
const isShowNewRuleDialog = ref(false);
const isShowNewRuleDialog1 = ref(false);
const isShowMiddlePanel = ref(false);
const ruleData = ref(null);
const isEditMode = ref(false);
const currentTaskData = ref(null);
const ruleId = ref(null);
const taskResponseData = ref(null);

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

const showNewRuleDialog = () => {
  isShowNewRuleDialog.value = true;
}

const showNewRuleDialog1 = () => {
  isShowNewRuleDialog1.value = true;
}

// 处理 taskExecuted 事件
const handleTaskExecuted = ({ responseData }) => {
  taskResponseData.value = responseData;  // 保存 responseData
  isShowMiddlePanel.value = true;  // 显示 MiddlePanel 弹窗
};

// 关闭 MiddlePanel 的方法
const handleCloseMiddlePanel = () => {
  isShowMiddlePanel.value = false;  // 隐藏 MiddlePanel 弹窗
};

// 子组件发送事件给父组件时，父组件会调用 handleTaskExecuted
const handleTaskExecution = async () => {
  // 进行任务执行，获取 responseData（假设从 API 获取）
  const responseData = await executeTask();

  // 触发事件，将 responseData 传递给父组件
  handleTaskExecuted({ responseData });
};

const openNewRuleDialog = () => {
  isShowRuleDialog.value = false;  // 关闭 RuleDialog
  isShowNewRuleDialog.value = true;  // 打开 NewRuleDialog
  console.log(99999999999999999999999999999)
  console.log(isShowRuleDialog.value,isShowNewRuleDialog.value)
  // console.log("mode",mode)
  console.log("type",type)
  // console.log('Received actionType:', actionType);  // 打印 'editTask' 或 'addTask'
  // console.log('Received task:', task);  // 打印任务数据
  // console.log('Received type:', type);  // 打印 'edit' 或 'add'
  isEditMode.value = type === 'editTask';
  currentTaskData.value = task || null;
  // isEditMode.value = !!task;  // 如果传递了 task 则为编辑模式
  // currentTaskData.value = task ? { ...task } : null;  // 编辑时填充数据
};

const openNewRuleDialog1WithId = (id) => {
  isShowRuleDialog.value = false;  // 关闭 RuleDialog
  isShowNewRuleDialog1.value = true;  // 打开 NewRuleDialog
  console.log(88888888888888888888888)
  console.log(isShowRuleDialog.value,isShowNewRuleDialog.value)
  // console.log("mode",mode)
  console.log("type",type)
  // console.log('Received actionType:', actionType);  // 打印 'editTask' 或 'addTask'
  // console.log('Received task:', task);  // 打印任务数据
  // console.log('Received type:', type);  // 打印 'edit' 或 'add'
  isEditMode.value = type === 'editTask';
  currentTaskData.value = task || null;
  ruleId.value = id;
  console.log("ruleId.value", ruleId.value)
  // isEditMode.value = !!task;  // 如果传递了 task 则为编辑模式
  // currentTaskData.value = task ? { ...task } : null;  // 编辑时填充数据
};

const saveRuleData = (newData) => {
  ruleData.value = newData;  // 保存数据
  isShowNewRuleDialog.value = false;  // 关闭 NewRuleDialog
  isShowNewRuleDialog1.value = false;
  isShowRuleDialog.value = true;  // 打开 RuleDialog
};

const saveRuleData1 = (newData) => {
  ruleData.value = newData;  // 保存数据
  isShowNewRuleDialog1.value = false;  // 关闭 NewRuleDialog
  isShowRuleDialog.value = true;  // 打开 RuleDialog
};


const handleTaskCompleted = () => {
  isShowRuleDialog.value = false;
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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
  }

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
</style>