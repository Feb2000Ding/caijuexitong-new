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
          <vue3-seamless-scroll class="scroll-list" :list="list" :hover="true" :step="0.4" :wheel="true"
            :isWatch="true">
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
import { Vue3SeamlessScroll } from "vue3-seamless-scroll"
import { ref, onMounted } from "vue";
import axios from "axios";

const list = ref([
  {
    taskName: '202100300001',
    judgeType: 'xxx',
    requestTime: '2021-12-15 16:20:30',
    side: '红方',
    judgeMethod: '自动裁决',
    result: 1,
    judgeTime: '2021-12-15 16:22:30'
  },
  {
    taskName: '202100300002',
    judgeType: 'xxx',
    requestTime: '2021-12-15 16:20:30',
    side: '红方',
    judgeMethod: '自动裁决',
    result: 2,
    judgeTime: '2021-12-15 16:22:30'
  },
  {
    taskName: '202100300003',
    judgeType: 'xxx',
    requestTime: '2021-12-15 16:20:30',
    side: '蓝方',
    judgeMethod: '自动裁决',
    result: 3,
    judgeTime: '2021-12-15 16:22:30'
  },
  {
    taskName: '202100300004',
    judgeType: 'xxx',
    requestTime: '2021-12-15 16:20:30',
    side: '红方',
    judgeMethod: '自动裁决',
    result: 1,
    judgeTime: '2021-12-15 16:22:30'
  },
  {
    taskName: '202100300005',
    judgeType: 'xxx',
    requestTime: '2021-12-15 16:20:30',
    side: '蓝方',
    judgeMethod: '手动裁决',
    result: 2,
    judgeTime: '2021-12-15 16:22:30'
  },
  {
    taskName: '202100300006',
    judgeType: 'xxx',
    requestTime: '2021-12-15 16:20:30',
    side: '红方',
    judgeMethod: '手动裁决',
    result: 1,
    judgeTime: '2021-12-15 16:22:30'
  },
  {
    taskName: '202100300007',
    judgeType: 'xxx',
    requestTime: '2021-12-15 16:20:30',
    side: '蓝方',
    judgeMethod: '自动裁决',
    result: 2,
    judgeTime: '2021-12-15 16:22:30'
  },
  {
    taskName: '202100300008',
    judgeType: 'xxx',
    requestTime: '2021-12-15 16:20:30',
    side: '红方',
    judgeMethod: '手动裁决',
    result: 1,
    judgeTime: '2021-12-15 16:22:30'
  },
  {
    taskName: '202100300009',
    judgeType: 'xxx',
    requestTime: '2021-12-15 16:20:30',
    side: '蓝方',
    judgeMethod: '手动裁决',
    result: 2,
    judgeTime: '2021-12-15 16:22:30'
  },
]);

// 请求数据
const fetchData = async () => {
  try {
    // 发起 HTTP 请求
    const response = await axios.post("http://192.168.1.200:3001/api/judgeRequest/pageList", {
      current: 1,
      pageSize: 10,
      sortField: "",
      sortOrder: "",
    });

    // 从响应中提取数据并格式化
    const records = response.data?.data?.records || [];
    list.value = records.map((record) => ({
      taskName: record.taskName || "202100300008",
      judgeType: record.judgeType || "xxx",
      requestTime: record.requestTime || "2021-12-15 16:20:30",
      side: record.side || "红方",
      judgeMethod: record.judgeMethod || "手动裁决",
      result: record.result || 1,
      judgeTime: record.judgeTime || "2021-12-15 16:22:30",
    }));
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style lang="scss" scoped>
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