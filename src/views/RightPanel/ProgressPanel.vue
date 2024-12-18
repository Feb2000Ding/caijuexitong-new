<template>
  <div class="progress-panel">
    <div class="panel-header">
      <div class="icon"></div>
      <div class="title">裁决过程监控</div>
      <div class="clear"></div>
    </div>
    <div class="panel-content">
      <ProcessLineChart></ProcessLineChart>
    </div>
  </div>
</template>

<script setup>
import ProcessLineChart from '@/components/charts/ProcessLineChart.vue'
</script>

<style lang="scss" scoped>
.progress-panel {
  height: 280px;
  display: flex;
  flex-direction: column;

  .panel-content {
    flex: 1;
    padding: 10px 10px 0 30px;
  }
}
</style>