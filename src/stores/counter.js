import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});

export const useTaskStore = defineStore('task', {
  state: () => ({
    from: '',    // 裁决发起方
    judgeResult: null,    // 裁决结果
    taskForm: {    // 配置规则的表单
      id: 0,
      ruleName: '',
      model: '',
      addTime: '',
      destroyLevel: '',
      targetType: '',
      finalLevel: '进行中',
      actions: '编辑',
      damageLevels: [{ name: '', definition: 'level1' }],
      conditions: [{ group: '', logic: 'AND', indicators: [{ minValue: '', maxValue: 'numeric', ranges: [] }] }],
      ranges: [{ minValue: '', maxValue: '', destroyLevel: '' }],
    },
    ruleId: null,
    successCount: 0,
    failureCount: 0,
    taskName: '',
  }),
  actions: {
    setTaskName(taskName) {
      this.taskName = taskName;
      console.log("Updated taskName:", this.taskName);
    },
    setFrom(value) {
      if (!Array.isArray(this.from)) {
        this.from = [];
      }

      if (!this.from.includes(value)) {
        this.from.push(value);
      }

      console.log("this.from", this.from);
    },
    setJudgeResult(data) {
      this.judgeResult = data;
      console.log("Updated judgeResult:", this.judgeResult);
    },
    updateJudgeResult(message) {
      // 将接收到的消息更新到 judgeResult 中
      this.judgeResult = message;
      console.log("Updated judgeResult:", this.judgeResult);
    },
    setTaskForm(taskData) {
      this.taskForm = { ...taskData };
      console.log("Updated taskForm:", this.taskForm);
    },
    setRuleId(ruleId) {
      this.ruleId = ruleId;
      console.log("this.ruleId", this.ruleId);
    },
    incrementSuccess() {
      this.successCount++;
      console.log("Success count:", this.successCount);
    },
    incrementFailure() {
      this.failureCount++;
      console.log("Failure count:", this.failureCount);
    },
  },
  getters: {
    getTaskName: (state) => state.taskName,
    getJudgeResult: (state) => state.judgeResult,
    getTaskForm: (state) => state.taskForm,
    getRuleId: (state) => state.ruleId,
    getSuccessCount: (state) => state.successCount,
    getFailureCount: (state) => state.failureCount,
  }
});

export const useRuleStore = defineStore('rule', () => {
  const ruleId = ref(null);

  // 设置 ruleId
  const setRuleId = (id) => {
    ruleId.value = id;
    console.log("this.ruleId", this.ruleId);
  };

  return {
    ruleId,
    setRuleId,
  };
});