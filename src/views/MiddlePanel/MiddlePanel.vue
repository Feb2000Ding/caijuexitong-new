

<!--<template>-->
<!--  <div class="middle-panel">-->
<!--    <div class="popup-container">-->
<!--      <div class="popup-content">-->
<!--        &lt;!&ndash; 在这里放置弹窗内容 &ndash;&gt;-->
<!--        <p>这是弹窗内容</p>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name: "MiddlePanel",-->
<!--};-->
<!--</script>-->

<!--<style scoped lang="scss">-->
<!--.middle-panel {-->
<!--  position: relative;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--}-->

<!--.popup-container {-->
<!--  width: 300px;-->
<!--  height: 350px;-->
<!--  background-color: rgba(28,117,186,0.9);-->
<!--  border: 3px solid rgba(28, 117, 186, 1);-->
<!--  //border-radius: 10px;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  //box-shadow: 0 4px 10px rgba(28, 117, 186, 0.2);-->
<!--}-->

<!--.popup-content {-->
<!--  color: #fff;-->
<!--  font-size: 16px;-->
<!--  text-align: center;-->
<!--  line-height: 1.5;-->
<!--}-->
<!--</style>-->

<template>
  <div class="modal-overlay" v-if="isShow">
    <div class="modal-content">
      <h3 class="modal-title">裁决成功！</h3>

      <div class="modal-message">
        <!-- 显示主要字段 -->
        <div v-if="responseData.data">
          <p><strong>裁决类型:</strong> {{ responseData.data.judgeModelType }}</p>
          <p><strong>裁决任务:</strong> {{ responseData.data.taskName }}</p>
          <p><strong>裁决模式:</strong> {{ responseData.data.judgeMode }}</p>
          <p><strong>裁决时间:</strong> {{ responseData.data.judgeTime }}</p>
          <p><strong>申请方:</strong> {{ responseData.data.from }}</p>
        </div>

        <!-- 如果有 judgeCalResult，逐层显示 -->
        <div v-if="responseData.data.judgeCalResult && responseData.data.judgeCalResult.targetResults.length">
          <h4>裁决结果详情:</h4>
          <div v-for="(target, index) in responseData.data.judgeCalResult.targetResults" :key="index">
            <p><strong>目标类型:</strong> {{ target.targetType || '无' }}</p>
            <p><strong>损害等级:</strong> {{ target.damageLevel }}</p>
            <p><strong>得分:</strong> {{ target.score }}</p>
            <div v-if="target.groupResults && target.groupResults.length">
              <h5>分组结果:</h5>
              <ul>
                <li v-for="(group, idx) in target.groupResults" :key="idx">{{ group }}</li>
              </ul>
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
    isShow: {  // 父组件控制弹窗显示的状态
      type: Boolean,
      required: true,
    },
    responseData: {  // 父组件传递的裁决结果
      type: Object,
      required: true,
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');  // 向父组件发送关闭事件
    },
  },
};
</script>

<style scoped>
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
  background: rgba(6,42,81,0.75); /* Dark background for modal */
  color: white;
  border: 2px solid #00bfff; /* Light blue border */
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
  background-color: #00bfff; /* Light blue button */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}
.modal-close:hover {
  background-color: #007acc; /* Darker blue on hover */
}
</style>

