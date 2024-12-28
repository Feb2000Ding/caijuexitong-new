<template>
  <el-scrollbar class="headpanel-scrollbar" style="width: 450px; height: 50px;">
    <div class="scrollbar-content">
      <div class="scrolling-text">
        <div v-for="(item, index) in items" :key="index" class="scroll-item">{{ item }}</div>
        <!-- 复制一份消息内容，实现无缝滚动 -->
        <div v-for="(item, index) in items" :key="'copy' + index" class="scroll-item">{{ item }}</div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { ref, watch } from 'vue';
import { useTaskStore } from '@/stores/counter.js';  // 导入 Pinia store

export default {
  name: "HeadPanel",
  data() {
    return {
      staticItems: [
        "收到{from}裁决请求...",
        // "收到{from}裁决请求...",
        // "收到{from}裁决请求...",
        // "收到{from}裁决请求...",
        // "收到{from}裁决请求..."
      ],  // 初始化为空数组，动态添加消息
    };
  },
  computed: {
    // 使用 Pinia store 中的 `from` 来动态替换
    items() {
      const taskStore = useTaskStore();
      return this.staticItems.map(item => item.replace(/{from}/g, taskStore.from));  // 动态替换
    }
  },
  watch: {
    // 监听 Pinia store 中 `from` 的变化
    'taskStore.from': function(newValue, oldValue) {
      if (newValue !== oldValue) {
        // 如果 `from` 的值发生变化，更新滚动消息
        this.addNewMessage(newValue);
      }
    }
  },
  methods: {
    addNewMessage(fromValue) {
      // 动态添加一条消息
      this.staticItems.push(`收到${fromValue}裁决请求...`);
    }
  },
  created() {
    // 获取 Pinia store
    this.taskStore = useTaskStore();
  }
}
</script>

<style scoped>
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
  width: 450px;
  height: 50px;
}

.scrolling-text {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  animation: scroll 60s cubic-bezier(0.25, 0.8, 0.25, 1) infinite; /* 使用自定义的速度曲线 */
}

.scroll-item {
  font-size: 16px;
  color: #FFF;
  white-space: nowrap;
  margin-right: 30px;
  width: 600px;
}

@keyframes scroll {
  0% {
    transform: translateX(0); /* 初始位置 */
  }
  100% {
    transform: translateX(-100%); /* 向左滚动 */
  }
}
</style>
