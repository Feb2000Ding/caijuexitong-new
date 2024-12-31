<template>
  <div class="headpanel-wrapper">
    <!-- 图片容器 -->
    <div class="scroll-images">
      <img src="@/assets/images/u167.svg" alt="背景图" class="image-167" />
      <img src="@/assets/images/u168.svg" alt="前景图" class="image-168" />
    </div>

    <el-scrollbar class="headpanel-scrollbar" style="width: 450px; height: 50px;">
      <div class="scrollbar-content">
        <div class="scrolling-text" :style="{ animationPlayState: isPaused ? 'paused' : 'running' }" @animationiteration="onAnimationIteration">
          <div v-for="(item, index) in items" :key="index" class="scroll-item" :class="{'flash': item.isNew}">
            <img src="@/assets/images/u171.png" alt="图标" class="scroll-icon" />
            {{ item.text }}
          </div>
          <!-- 复制一份消息内容，实现无缝滚动 -->
          <div v-for="(item, index) in items" :key="'copy' + index" class="scroll-item" :class="{'flash': item.isNew}">
            <img src="@/assets/images/u171.png" alt="图标" class="scroll-icon" />
            {{ item.text }}
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useTaskStore } from '@/stores/counter.js'; // 导入 Pinia store

export default {
  name: "HeadPanel",
  data() {
    return {
      staticItems: [
        { text: "收到{from}裁决请求...", isNew: false },
      ], // 初始化为空数组，动态添加消息，包含标记是否为新消息
      isPaused: false, // 控制动画暂停状态
    };
  },
  computed: {
    // 使用 Pinia store 中的 from 来动态替换
    items() {
      const taskStore = useTaskStore();
      return this.staticItems.map(item => ({
        ...item,
        text: item.text.replace(/{from}/g, taskStore.from) // 动态替换
      }));
    }
  },
  watch: {
    // 监听 Pinia store 中 from 的变化
    "taskStore.from": function (newValue, oldValue) {
      if (newValue !== oldValue) {
        // 如果 from 的值发生变化，更新滚动消息
        this.addNewMessage(newValue);
      }
    }
  },
  methods: {
    addNewMessage(fromValue) {
      // 动态添加一条消息，并标记为新消息
      this.staticItems.push({ text: `收到${fromValue}裁决请求...`, isNew: true });

      // 设置2秒后移除闪烁标记
      setTimeout(() => {
        this.staticItems[this.staticItems.length - 1].isNew = false;
      }, 2000);
    },
    onAnimationIteration() {
      // 每次动画完成时触发，暂停滚动2秒
      this.isPaused = true;
      setTimeout(() => {
        // 2秒后恢复滚动
        this.isPaused = false;
      }, 2000);
    }
  },
  created() {
    // 获取 Pinia store
    this.taskStore = useTaskStore();
  }
};
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
  position: relative; /* 确保子元素可以绝对定位 */
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
  width: 8px; /* 调整宽度以适应居中效果 */
  height: 20px; /* 调整高度以适应居中效果 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 居中对齐 */
}

.headpanel-scrollbar {
  background-color: rgba(57, 125, 202, 0.75);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  position: relative;
}

.scrollbar-content {
  display: flex;
  width: 450px;
  height: 50px;
}

.scrolling-text {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-left: 45px; /* 为滚动文本留出图片空间 */
  animation: scroll 60s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
  transition: animation-play-state 0.5s; /* 添加过渡效果 */
}

.scroll-item {
  font-size: 20px;
  color: #FFF;
  white-space: nowrap;
  margin-right: 30px;
  width: 600px;
  display: flex;
  align-items: center;
}

.scroll-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

/* 添加闪烁效果 */
.flash {
  color: orange;
  animation: flash 1s infinite;
}

@keyframes flash {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes scroll {
  0% {
    transform: translateX(100%); /* 从右侧开始 */
  }
  100% {
    transform: translateX(-100%); /* 滚动至完全离开屏幕左侧 */
  }
}
</style>
