<template>
  <div class="rule-panel">
    <div class="panel-header">
      <div class="icon"></div>
      <div class="title">裁决规则管理</div>
      <div class="more" @click="showModal">更多</div>
      <div class="clear"></div>
    </div>
    <div class="panel-content">
      <div class="scroll-wrap">
        <div class="scroll-header">
          <ul class="scroll-ul">
            <li class="scroll-li">
              <span class="number">序号</span>
              <span class="name">名称</span>
              <span class="model">裁决模型</span>
              <span class="data">数据</span>
            </li>
          </ul>
        </div>
        <div class="scroll-content">
          <vue3-seamless-scroll class="scroll-list" :list="list" :hover="true" :step="0.4" :wheel="true"
            :isWatch="true">
            <ul class="scroll-ul" v-for="(item, index) in list" :key="index">
              <li class="scroll-li">
                <span class="number">{{ item.number }}</span>
                <span class="name">{{ item.name }}</span>
                <span class="model">{{ item.model }}</span>
                <span class="data">{{ item.data }}</span>
              </li>
            </ul>
          </vue3-seamless-scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Vue3SeamlessScroll } from "vue3-seamless-scroll"
import { ref } from 'vue'

import { defineEmits } from 'vue';

const emit = defineEmits(['showModal']);

const showModal = () => {
  emit('showModal');
};

const list = ref([
  {
    number: '01',
    name: '电子干扰1',
    model: '电子干扰xx',
    data: 31
  },
  {
    number: '02',
    name: '电子干扰2',
    model: '电子干扰xx',
    data: 43
  },
  {
    number: '03',
    name: '电子干扰3',
    model: '电子干扰xx',
    data: 56
  },
  {
    number: '04',
    name: '光学干扰1',
    model: '光学干扰xx',
    data: 76
  },
  {
    number: '05',
    name: '光学干扰2',
    model: '光学干扰xx',
    data: 88
  },
  {
    number: '06',
    name: '光学干扰3',
    model: '光学干扰xx',
    data: 45
  },
  {
    number: '07',
    name: '电子干扰5',
    model: '电子干扰xx',
    data: 10
  },
  {
    number: '08',
    name: '电子干扰4',
    model: '电子干扰xx',
    data: 36
  },
  {
    number: '09',
    name: '电子干扰6',
    model: '电子干扰xx',
    data: 21
  },
]);
</script>

<style lang="scss" scoped>
.rule-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .panel-content {
    flex: 1;
    padding: 0 10px 0 30px;
  }

  .scroll-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .scroll-header,
  .scroll-content {
    width: 100%;
    display: flex;
  }

  .scroll-list {
    width: 100%;
    overflow: hidden;
  }

  .scroll-ul {
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .scroll-li {
    width: 100%;
    display: flex;
    line-height: 35px;
  }

  .scroll-li>span {
    display: flex;
    height: 35px;
    line-height: 35px;
    padding-left: 5px;
    overflow: hidden;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
  }

  .scroll-header .scroll-li {
    background: url('@/assets/images/bg-table-header.png') no-repeat;
    background-size: 100% 100%;
  }

  .scroll-header .scroll-li>span {
    font-size: 13px;
    color: #fff;
  }

  .number {
    width: 10%;
  }

  .name {
    width: 20%;
  }

  .model {
    flex: 1;
  }

  .data {
    width: 10%;
  }
}
</style>