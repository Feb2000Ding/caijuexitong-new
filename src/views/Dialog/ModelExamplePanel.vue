<template>
  <div class="rule-example-panel" >
<!--    <div class="panel-head">-->
<!--      <h3 class="head-text">模型案例示意</h3>-->
<!--      <div class="close-button" @click="closePanel">×</div>-->
<!--    </div>-->
    <div class="panel-content">
      <div class="content-text">
        <li> 模型名称：光能模型1</li>
        <li> 模型类型：模型类型1</li>
<!--        <li> 模型案例示意内容</li>-->
<!--        <li> 模型案例示意内容</li>-->
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits();

const closePanel = () => {
  emit('close');
};
</script>

<style scoped>
.rule-example-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid #ccc;
  padding: 20px;
  z-index: 9999999;
}

.panel-content {
  text-align: center;
}
</style>
