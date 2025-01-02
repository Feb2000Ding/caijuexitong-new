<template>
  <div class="headpanel-wrapper">
    <!-- 图片容器 -->
    <div class="scroll-images">
      <img src="@/assets/images/u167.svg" alt="背景图" class="image-167" />
      <img src="@/assets/images/u168.svg" alt="前景图" class="image-168" />
    </div>

    <!-- 根据 isContentVisible 控制滚动内容的显示 -->
    <el-scrollbar  class="headpanel-scrollbar" style="width: 450px; height: 50px;">
      <div class="scrollbar-content">
        <div
            class="scrolling-text"
            :key="scrollKey"
            :style="{ animationPlayState: isPaused || isCentering ? 'paused' : 'running' }"
        >
          <div
              v-for="(item, index) in items"
              :key="index"
              class="scroll-item"
              :class="{ flash: item.isNew }"
          >
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
        { text: "[2025/1/2]收到{from}裁决请求...", isNew: false },
      ], // 初始化为空数组，动态添加消息，包含标记是否为新消息
      isPaused: false, // 控制动画暂停状态
      animationKey: 0, // 用于重置动画
      isCentering: false,
      scrollKey: 0,
      isContentVisible: false, // 控制滚动内容的显示
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
    taskStore: {
      handler(newValue, oldValue) {
        console.log("11111111111111111111111")
        const newFrom = newValue.from;
        const oldFrom = oldValue.from;
        if (newFrom !== oldFrom) {
          console.log("newMessage", newFrom);
          this.addNewMessage(newFrom);
          this.isContentVisible = true; // 显示滚动内容
          console.log(" this.isContentVisible", this.isContentVisible)
        } else {
          this.isContentVisible = false; // 隐藏滚动内容
        }
      },
      deep: true // 确保监听整个 store 的变化
    }
  },
  methods: {
    resetAnimation() {
      this.animationKey++; // 增加 key 值以触发 DOM 重渲染
    },
    addNewMessage(fromValue) {
      // 插入新消息到第一项
      this.staticItems.unshift({ text: `收到${fromValue}裁决请求...`, isNew: true });

      // 设置居中显示
      this.isCentering = true;

      // 停止滚动动画
      this.isPaused = true;

      // 延迟几秒后恢复滚动
      setTimeout(() => {
        this.isCentering = false;
        this.isPaused = false;

        // 移除闪烁标记
        this.staticItems[0].isNew = false;
      }, 3000); // 停留 3 秒

      this.scrollKey++;
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
  width: 100px;
  height: 50px;
}

.scrolling-text {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-left: 45px;
  animation: scroll 20s cubic-bezier(0.25, 0.8, 0.25, 1) infinite; /* 调整了这里的时间 */
}

.scroll-item {
  font-size: 20px;
  color: #FFF;
  white-space: nowrap;
  margin-right: 30px;
  width: 100px;
  display: flex;
  align-items: center;
}

.scroll-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

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
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>