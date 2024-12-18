<template>
  <div class="info-panel">
    <div class="panel-header">
      <div class="icon"></div>
      <div class="title">裁决信息综合显示</div>
      <div class="clear"></div>
    </div>
    <div class="panel-content">
      <div class="scroll-wrap">
        <div class="scroll-content">
          <vue3-seamless-scroll class="scroll-list" :list="list" :hover="true" :step="0.4" :wheel="true"
                                :isWatch="true">
            <ul class="scroll-ul" v-for="(item, index) in list" :key="index">
              <li class="scroll-li">
                <div class="dot"></div>
                <div class="line"></div>
                <div class="time">{{ item.time }}</div>
                <div class="name">
                  <span class="text">{{ item.name }}</span>
                  <span class="label red" v-if="item.status == 1">未执行</span>
                  <span class="label yellow" v-else-if="item.status == 2">裁决中</span>
                  <span class="label green" v-else-if="item.status == 3">已完成</span>
                </div>
                <div class="content">{{ item.content }}</div>
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

const list = ref([
  {
    time: '2023-10-19 17:10:23',
    name: 'xxx任务裁决结果',
    status: 1,
    content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  },
  {
    time: '2023-10-19 17:10:23',
    name: 'xxx任务裁决结果',
    status: 2,
    content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  },
  {
    time: '2023-10-19 17:10:23',
    name: 'xxx任务裁决结果',
    status: 3,
    content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  },
  {
    time: '2023-10-19 17:10:23',
    name: 'xxx任务裁决结果',
    status: 1,
    content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  },
  {
    time: '2023-10-19 17:10:23',
    name: 'xxx任务裁决结果',
    status: 2,
    content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  },
  {
    time: '2023-10-19 17:10:23',
    name: 'xxx任务裁决结果',
    status: 3,
    content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  },
  {
    time: '2023-10-19 17:10:23',
    name: 'xxx任务裁决结果',
    status: 1,
    content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  },
  {
    time: '2023-10-19 17:10:23',
    name: 'xxx任务裁决结果',
    status: 2,
    content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  },
  {
    time: '2023-10-19 17:10:23',
    name: 'xxx任务裁决结果',
    status: 3,
    content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  },
]);
</script>

<style lang="scss" scoped>
.info-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .panel-content {
    flex: 1;
    padding: 10px 10px 0 50px;
  }

  .scroll-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

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
    position: relative;
    padding-left: 30px;
  }

  .dot {
    position: absolute;
    top: 10px;
    left: 0;
    width: 10px;
    height: 10px;
    border: 2px solid rgba(88, 162, 204, 1);
    border-radius: 50%;
    background-color: rgba(7, 15, 25, 1);
  }

  .line {
    position: absolute;
    top: 0;
    left: 5px;
    bottom: 0;
    width: 0;
    border-left: 1px solid rgba(255, 255, 255, 0.3);
  }

  .time {
    font-size: 13px;
    color: #7BD4F3;
    height: 30px;
    line-height: 30px;
  }

  .name {
    font-size: 13px;
    font-weight: bold;
    color: #FFFFFF;
    height: 35px;
    background: url('@/assets/images/bg-item-name.svg') no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;

    .label {
      width: 40px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      font-size: 12px;
      color: #fff;
      border-radius: 3px;
    }

    .label.red {
      background-color: rgba(245, 108, 108, 1);
    }

    .label.yellow {
      background-color: rgba(255, 195, 40, 1);
    }

    .label.green {
      background-color: rgba(81, 197, 162, 1);
    }
  }

  .content {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    padding: 10px 0;
  }
}
</style>