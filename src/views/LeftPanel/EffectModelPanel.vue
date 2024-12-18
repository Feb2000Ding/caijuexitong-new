<template>
  <div class="effect-model-panel">
    <div class="panel-header">
      <div class="icon"></div>
      <div class="title">效果模型管理</div>
      <div class="more" @click="showModal">更多</div>
      <div class="clear"></div>
    </div>
    <div class="panel-content">
      <div class="wrap">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 229" version="1.1">
          <image xlink:href="@/assets/images/bg-effect-tongxinganrao.png" x="0" y="20" width="100%" height="100%" />
          <text x="185" y="120" font-size="16" style="fill: #fff;">通信</text>
          <text x="185" y="140" font-size="16" style="fill: #fff;">干扰</text>
          <text x="20" y="20" font-size="16" style="fill: #fff;">碎片演化</text>
          <text x="20" y="40" font-size="16" style="fill: #fff;">xx个</text>
          <text x="320" y="100" font-size="16" style="fill: #fff;">干扰区域</text>
          <text x="320" y="120" font-size="16" style="fill: #fff;">xx个</text>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['showModal']);

const showModal = () => {
  emit('showModal');
};
</script>

<style lang="scss" scoped>
.effect-model-panel {
  height: 280px;
  display: flex;
  flex-direction: column;

  .panel-content {
    flex: 1;
    padding: 0 10px 0 30px;
  }

  .wrap {
    width: 100%;
    height: 100%;
  }
}
</style>