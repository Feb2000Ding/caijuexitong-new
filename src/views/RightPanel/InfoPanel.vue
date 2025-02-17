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
<!--                  <span class="label red" v-if="item.status == 1">未执行</span>-->
                  <span class="label yellow" v-if="item.status == 0">裁决中</span>
                  <span class="label green" v-else="item.status == 1">已完成</span>
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
import { ref, watch } from 'vue'
import { useTaskStore } from '@/stores/counter.js';

// 假设这是从外部获取到的裁决数据格式
const newJudgeResult = {
  "requestTime": "2025-02-11 05:14:57",
  "messageWrapper": {
    "messageType": 1,
    "requestId": "sjdnafjlsdkgj",
    "modelType": 1,
    "effectModelType": null,
    "side": "红方",
    "targetType": "主体结构",
    "indicators": {
      "出光时长": 30,
      "倒靶功率密度": 80
    },
    "weaponId": null,
    "rules": null,
    "inputData": null,
    "outputData": null,
    "damageLevel": "层裂",
    "success": null,
    "message": null,
    "TargetId": null,
    "Bias": 58.0
  },
  "type": 1
};

const list = ref([
  {
    time: '2023-10-19 17:10:23',
    name: 'xxx任务裁决结果',
    status: 1,
    content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  },
  // {
  //   time: '2023-10-19 17:10:23',
  //   name: 'xxx任务裁决结果',
  //   status: 0,
  //   content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  // },
  // {
  //   time: '2023-10-19 17:10:23',
  //   name: 'xxx任务裁决结果',
  //   status: 0,
  //   content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  // },
  // {
  //   time: '2023-10-19 17:10:23',
  //   name: 'xxx任务裁决结果',
  //   status: 1,
  //   content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  // },
  // {
  //   time: '2023-10-19 17:10:23',
  //   name: 'xxx任务裁决结果',
  //   status: 0,
  //   content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  // },
  // {
  //   time: '2023-10-19 17:10:23',
  //   name: 'xxx任务裁决结果',
  //   status: 0,
  //   content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  // },
  // {
  //   time: '2023-10-19 17:10:23',
  //   name: 'xxx任务裁决结果',
  //   status: 0,
  //   content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  // },
  // {
  //   time: '2023-10-19 17:10:23',
  //   name: 'xxx任务裁决结果',
  //   status: 0,
  //   content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  // },
  // {
  //   time: '2023-10-19 17:10:23',
  //   name: 'xxx任务裁决结果',
  //   status: 0,
  //   content: '红方*装备对蓝方*目标发起jg打击，到靶功率密度数据为1瓦每平方厘米,结果判定为实现饱和干扰。'
  // },
]);

const taskStore = useTaskStore();

// 监听 store 中的 judgeResult
watch(
    () => taskStore.judgeResult,  // 监听 taskStore 中的 judgeResult
    (newResult) => {
      if (newResult ) {
        console.log("newResult", newResult);
        console.log("newResult.messageWrapper", newResult.messageWrapper);

        const message = newResult;

        // 格式化新的数据项
        const formattedItem = {
          time: message.requestTime, // 请求时间
          name: `test_1`, // 假设的任务名称
          status: message.messageType, // 对应的 status 值
          content: generateContent(message) // 生成 content
        };

        // 将新项插入到 list 的最前面
        list.value.unshift(formattedItem);

        // 打印 formattedItem 调试
        console.log("formattedItem", formattedItem);
      } else {
        console.log("newResult is undefined");
      }

      // 打印更新后的 list
      console.log("list.value", list.value);
    },
    { immediate: true } // 确保组件加载时也会立即执行一次
);

// 格式化 content 的函数
function generateContent(message) {
  let content = `${message.messageWrapper.side}*装备对${message.messageWrapper.targetType}*目标发起jg打击，`;

  // 遍历 indicators，根据每一项生成相应的内容
  for (const key in message.messageWrapper.indicators) {
    if (message.messageWrapper.indicators[key] !== undefined) {
      content += `到靶功率密度数据为${message.messageWrapper.indicators[key]}瓦每平方厘米,`;
    }
  }

  // 添加结果判定
  if (message.messageWrapper.damageLevel) {
    content += `结果判定为实现${message.messageWrapper.damageLevel}。`;
  }
  console.log("content", content)

  return content;
}
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