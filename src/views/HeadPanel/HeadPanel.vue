<template>
  <div class="headpanel-wrapper">
    <!-- 图片容器 -->
    <div class="scroll-images">
      <img src="@/assets/images/u167.svg" alt="背景图" class="image-167" />
      <img src="@/assets/images/u168.svg" alt="前景图" class="image-168" />
    </div>
    <!-- 根据 isContentVisible 控制滚动内容的显示 -->
    <el-scrollbar class="headpanel-scrollbar" style="width: 450px; height: 50px;">
      <div class="scrollbar-content">
        <div
            class="scrolling-text"
            :key="scrollKey"
            :style="{ animationPlayState: isPaused || isCentering ? 'paused' : 'running' }"
            @mouseenter="pauseScroll"
            @mouseleave="resumeScroll"
        >
        <div
            v-for="(item, index) in items"
            :key="index"
            class="scroll-item"
        >
          <img src="@/assets/images/u171.png" alt="图标" class="scroll-icon" />
          {{ item.text }}
        </div>
      </div>
  </div>
  </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useTaskStore } from '@/stores/counter.js';

const taskStore = useTaskStore();

const staticItems = ref([ { text: getCurrentMessage() + '收到请求...', isNew: false } ]);
const isPaused = ref(false);
const isCentering = ref(false);
const scrollKey = ref(0);
const isContentVisible = ref(false);
const isScrolling = ref(false);

const items = computed(() => {
  return staticItems.value.map(item => ({
    ...item,
    text: item.text.replace(/{from}/g, taskStore.from)
  }));
});

// 监听 taskStore 中的 from
watch(
    () => taskStore.from,
    (newFrom, oldFrom) => {
      if (newFrom !== oldFrom) {
        console.log("newFrom", newFrom);

        // 如果 newFrom 是一个数组，则依次添加每条消息
        if (Array.isArray(newFrom)) {
          newFrom.forEach(fromItem => {
            getCurrentMessage(fromItem);
            console.log("getCurrentMessage(fromItem)", getCurrentMessage(fromItem));
            console.log("fromItem", fromItem);
            addNewMessage(fromItem);  // 为每一项生成并添加新消息
          });
        } else {
          getCurrentMessage(newFrom);
          console.log("getCurrentMessage(newFrom)", getCurrentMessage(newFrom));
          console.log("newFrom", newFrom);
          addNewMessage(newFrom);  // 如果 newFrom 不是数组，按常规方式处理
        }

        isContentVisible.value = true; // 显示滚动内容
      } else {
        isContentVisible.value = false; // 隐藏滚动内容
      }
    }
);


// 获取当前时间
function getCurrentTime() {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// 生成当前消息
function getCurrentMessage(from = '') {
  console.log("任务期间消息提示：{from}申请裁决 ${getCurrentTime()}")
  return `任务期间消息提示：${from}申请裁决 ${getCurrentTime()}`;
}

// 添加新消息
function addNewMessage(fromValue) {
  const currentMessage = getCurrentMessage(fromValue);  // 使用传入的 from 生成消息

  // 插入新消息到最后一项
  staticItems.value.push({
    text: currentMessage,
    isNew: true
  });
  console.log("staticItems", staticItems.value);

  // 等待上一条消息滚动完毕
  if (isScrolling.value) {
    return;
  }

  isScrolling.value = true; // 开始滚动新消息

  // 延迟几秒后开始滚动
  setTimeout(() => {
    // 设置滚动条居中
    isCentering.value = true;

    // 延迟5秒后恢复动画并移除居中效果
    setTimeout(() => {
      isCentering.value = false;
      isPaused.value = false; // 恢复动画
      staticItems.value[staticItems.value.length - 1].isNew = false; // 移除新消息标记
      isScrolling.value = false; // 允许下一条消息滚动
    }, 500); // 确保居中效果完成

  }, 500); // 暂停一会儿，确保上一条消息滚动完

  // 更新 scrollKey 以触发重新渲染
  scrollKey.value++;
}

// 暂停滚动
function pauseScroll() {
  isPaused.value = true;
}

// 恢复滚动
function resumeScroll() {
  isPaused.value = false;
}
</script>

<style scoped>
.headpanel-wrapper {
  display: flex;
  align-items: center;
}

.scroll-images {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  position: relative;
  width: 35px;
  height: 35px;
}

.image-167 {
  position: absolute;
  width: 35px;
  height: 35px;
}

.image-168 {
  position: absolute;
  width: 8px;
  height: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.headpanel-scrollbar {
  background-color: rgba(57, 125, 202, 0.75);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
}

.scrollbar-content {
  display: flex;
  width: 100%;
  height: 50px;
}

.scrolling-text {
  display: flex;
  flex-wrap: nowrap;
  animation: scroll 5s linear infinite;
}

.scroll-item {
  font-size: 20px;
  color: #FFF;
  white-space: nowrap;
  margin-right: 30px;
  width: auto;
  display: flex;
  align-items: center;
}

.scroll-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

@keyframes scroll {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>