<template>
  <div class="table-panel">
    <div class="panel-content">
      <div class="scroll-wrap">
        <div class="scroll-header">
          <ul class="scroll-ul">
            <li class="scroll-li">
              <span class="taskName">任务名称</span>
              <span class="judgeType">裁决类型</span>
              <span class="requestTime">请求时间</span>
              <span class="side">申请方</span>
              <span class="judgeMethod">裁决方式</span>
              <span class="result">裁决结果</span>
              <span class="judgeTime">处理时间</span>
            </li>
          </ul>
        </div>
        <div class="scroll-content">
          <vue3-seamless-scroll class="scroll-list" :list="list" :hover="true" :step="0.4" :wheel="true" :isWatch="true">
            <ul class="scroll-ul" v-for="(item, index) in list" :key="index">
              <li class="scroll-li">
                <span class="taskName">{{ item.taskName }}</span>
                <span class="judgeType">{{ item.judgeType }}</span>
                <span class="requestTime">{{ item.requestTime }}</span>
                <span class="side">{{ item.side }}</span>
                <span class="judgeMethod">{{ item.judgeMethod }}</span>
                <span class="result">
                  <div class="res-item" v-if="item.result == 1">
                    <div class="icon red"></div>
                    <div class="text">毁伤</div>
                  </div>
                  <div class="res-item" v-else-if="item.result == 2">
                    <div class="icon yellow"></div>
                    <div class="text">致盲</div>
                  </div>
                  <div class="res-item" v-else-if="item.result == 3">
                    <div class="icon green"></div>
                    <div class="text">未毁伤</div>
                  </div>
                </span>
                <span class="judgeTime">{{ item.judgeTime }}</span>
              </li>
            </ul>
          </vue3-seamless-scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import {ref, onMounted, watch} from "vue";
import { useTaskStore } from "@/stores/counter.js";

// 引入 Pinia store
const taskStore = useTaskStore();
console.log(taskStore.responseData)

// 定义 list 变量，用于存储裁决结果列表
const list = ref([
  {
    taskName: "任务1",
    judgeType: "裁决类型1",
    requestTime: "2024-12-27 10:00:00",
    side: "红方",
    judgeMethod: "手动裁决",
    result: 1, // 1 表示毁伤
    judgeTime: "2024-12-27 10:05:00",
  }
]);

// 裁决方式映射
const judgeModeMapping = {
  manual: "手动裁决",
  Aotu: "自动裁决",
  // 你可以根据需要增加其他类型的映射
  default: "未知裁决方式"
};

// 监听 taskStore.responseData 变化
watch(
    () => taskStore.responseData,

    (newResponseData) => {
      const responseData = newResponseData?.data;
      console.log("responseData", responseData);

      // 判断 responseData 是否是一个对象，并将其转换为数组
      if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
        console.log("Wrapping responseData into an array", responseData);

        // 根据裁决方式映射
        const newItem = {
          taskName: responseData.taskName || "未定义任务",  // 任务名称
          judgeType: responseData.judgeModelType || "未知类型",  // 裁决类型
          requestTime: responseData.requestTime || "2021-12-15 16:20:30",  // 请求时间
          side: responseData.from || "红方",  // 申请方
          judgeMethod: judgeModeMapping[responseData.judgeMode] || judgeModeMapping.default,  // 裁决方式
          result: responseData.judgeResult ? responseData.judgeResult.targetResults[0] : 1,  // 裁决结果
          judgeTime: responseData.judgeTime || "2021-12-15 16:22:30",  // 处理时间
        };

        // 将新的任务添加到 list 中
        list.value.push(newItem);
        console.log("list.value", list.value);

      } else if (Array.isArray(responseData)) {
        // 如果 responseData 本身就是数组，遍历并追加每一项
        responseData.forEach((item) => {
          // 根据裁决方式映射
          const newItem = {
            taskName: item.taskName || "未定义任务",  // 任务名称
            judgeType: item.judgeModelType || "未知类型",  // 裁决类型
            requestTime: item.requestTime || "2021-12-15 16:20:30",  // 请求时间
            side: item.from || "红方",  // 申请方
            judgeMethod: judgeModeMapping[item.judgeMode] || judgeModeMapping.default,  // 裁决方式
            result: item.judgeResult ? item.judgeResult.targetResults[0] : 1,  // 裁决结果
            judgeTime: item.judgeTime || "2021-12-15 16:22:30",  // 处理时间
          };

          // 将每个新的任务添加到 list 中
          list.value.push(newItem);
        });
        console.log("list.value", list.value);
      }
    },
    { immediate: true }  // 让它在组件加载时也立即执行一次
);
</script>

<style lang="scss" scoped>
/* 样式保持不变 */
.table-panel {
  height: 100%;
  overflow: hidden;

  .panel-content {
    height: 100%;
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

  .scroll-li>span {
    width: 12%;
  }

  .scroll-li>span.requestTime, .scroll-li>span.judgeTime {
    width: 20%;
  }

  .res-item {
    display: flex;
    flex-direction: row;
    align-items: center;

    .icon {
      width: 10px;
      height: 15px;
    }

    .icon.red {
      border: 2px solid rgb(232, 100, 82);
    }

    .icon.yellow {
      border: 2px solid rgb(246, 189, 22);
    }

    .icon.green {
      border: 2px solid rgb(90, 216, 166);
    }

    .text {
      padding-left: 5px;
    }
  }
}
</style>
