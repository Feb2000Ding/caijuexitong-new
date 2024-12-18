<template>
  <div class="task-panel">
    <div class="panel-header">
      <div class="icon"></div>
      <div class="title">裁决任务管理</div>
      <div class="more" @click="showModal">更多</div>
      <div class="clear"></div>
    </div>
    <div class="panel-content">
      <div class="btn-new-task" >新建裁决任务</div>
      <div class="chart-container">
        <TaskPieChart></TaskPieChart>
      </div>
    </div>
  </div>
</template>

<script setup>
import TaskPieChart from '@/components/charts/TaskPieChart.vue'
import { defineEmits } from 'vue';

const emit = defineEmits(['showModal']);

const showModal = () => {
  emit('showModal');
};
</script>

<style lang="scss" scoped>
.task-panel {
  height: 280px;
  display: flex;
  flex-direction: column;

  .panel-content {
    flex: 1;
    padding: 0 10px 0 30px;
    display: flex;
    flex-direction: column;
  }

  .btn-new-task {
    width: 100%;
    height: 104px;
    line-height: 104px;
    background: url('@/assets/images/btn-new-task.png') no-repeat center center;
    background-size: 100% 100%;
    cursor: pointer;
    font-size: 20px;
    color: #fff;
    text-align: center;
  }

  .btn-new-task:hover {
    color: #02FDFF;
  }

  .chart-container {
    flex: 1;
  }
}
</style>
