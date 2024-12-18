<template>
  <div class="model-panel">
    <div class="panel-header">
      <div class="icon"></div>
      <div class="title">裁决模型管理</div>
      <div class="more" @click="showModal">更多</div>
      <div class="clear"></div>
    </div>
    <div class="panel-content">
      <div class="model-item">
        <div class="icon tongxinganrao"></div>
        <div class="title">通信干扰</div>
      </div>
      <div class="model-item">
        <div class="icon dianziganrao"></div>
        <div class="title">电子干扰</div>
      </div>
      <div class="model-item">
        <div class="icon guangxueganrao"></div>
        <div class="title">光学干扰</div>
      </div>
      <div class="model-item">
        <div class="icon guangxueduikang"></div>
        <div class="title">光学对抗</div>
      </div>
      <div class="clear"></div>
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
.model-panel {
  height: 280px;

  .panel-content {
    padding: 0 10px 0 30px;
  }

  .model-item {
    float: left;
    width: 50%;
    margin-top: 20px;

    .icon {
      float: left;
      width: 70px;
      height: 86px;
    }

    .icon.tongxinganrao {
      background: url('@/assets/images/icon-tongxinganrao.png') no-repeat center center;
      background-size: 100% 100%;
    }

    .icon.dianziganrao {
      background: url('@/assets/images/icon-dianziganrao.png') no-repeat center center;
      background-size: 100% 100%;
    }

    .icon.guangxueganrao {
      background: url('@/assets/images/icon-guangxueganrao.png') no-repeat center center;
      background-size: 100% 100%;
    }

    .icon.guangxueduikang {
      background: url('@/assets/images/icon-guangxueduikang.png') no-repeat center center;
      background-size: 100% 100%;
    }

    .title {
      margin-left: 80px;
      line-height: 86px;
      font-size: 24px;
      color: #fff;
    }
  }
}
</style>