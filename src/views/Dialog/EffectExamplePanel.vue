<template>
  <div class="rule-example-panel" style="background-color: white;">
    <div class="panel-content">
      <h3>效果示例</h3>
      <p>这里展示效果的示例内容...</p>
      <button @click="closePanel">关闭示例</button>
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
