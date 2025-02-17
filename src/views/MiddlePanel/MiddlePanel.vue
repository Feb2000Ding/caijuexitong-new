<template>
<!--  裁决结果弹窗-->
  <div class="modal-overlay" v-if="isShow">

    <div class="modal-content">
      <h3 class="modal-title">裁决成功！</h3>

      <div class="modal-message">
        <!-- Show scrolling text -->
        <div class="headpanel-scrollbar">
          <div class="scrollbar-content">
            <div
                class="scrolling-text"
                :style="{
                animationPlayState: isPaused || isCentering ? 'paused' : 'running'
              }"
            >
              <div
                  v-for="(item, index) in messages"
                  :key="index"
                  class="scroll-item"
                  :style="{
                  animationDelay: item.delay + 's',
                  animationDuration: item.duration + 's'
                }"
              >
                <img src="@/assets/images/u171.png" alt="Icon" class="scroll-icon" />
                {{ item.text }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button class="modal-close" @click="closeModal">已读</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      required: true,
    },
    responseData: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      messages: [],
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    generateRandomMessages() {
      const randomTexts = [
        '任务执行完成！',
        '裁决任务成功！',
        '请确认您的操作。',
        '系统已更新，请重试。',
        '处理完成，检查结果。',
        '正在进行任务...',
        '请等待片刻...',
        '即将开始裁决...',
        '处理时间：2025年...',
        '任务状态更新！'
      ];

      this.messages = randomTexts.map(text => ({
        text,
        delay: Math.random() * 5,
        duration: Math.random() * 15 + 10,
      }));
    }
  },
  mounted() {
    this.generateRandomMessages();
  },
};
</script>

<style scoped>
.headpanel-scrollbar {
  background-color: rgba(57, 125, 202, 0.75);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  width: 100%;
  position: relative;
}

.scrollbar-content {
  display: flex;
  flex-direction: column;
  height: 50px;
}

.scrolling-text {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  position: absolute;
  width: 100%;
  white-space: nowrap;
}

.scroll-item {
  font-size: 20px;
  color: #FFF;
  margin-right: 30px;
  display: flex;
  align-items: center;
  opacity: 1;
  animation: scroll 15s linear infinite;
}

.scroll-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

@keyframes scroll {
  0% {
    transform: translateX(100%);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 1;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: rgba(6, 42, 81, 0.75);
  color: white;
  border: 2px solid #00bfff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  width: 300px;
  text-align: center;
}

.modal-title {
  font-size: 20px;
  margin-bottom: 10px;
}

.modal-message {
  font-size: 16px;
  margin-bottom: 20px;
}

.modal-close {
  background-color: #00bfff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}
.modal-close:hover {
  background-color: #007acc;
}
</style>