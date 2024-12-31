import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useTaskStore = defineStore('task', {
  state: () => ({
    from: '',    //裁决发起方
    responseData: null,    //裁决结果
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
  }),
  actions: {
    setFrom(value) {
      this.from = value;
      console.log("this.from", this.from);
    },
    setResponseData(data) {
      this.responseData = data;
      console.log("this.responseData", this.responseData);
    },

    setTaskForm(taskData) {
      this.taskForm = { ...taskData };
      console.log("Updated taskForm:", this.taskForm);
    },
    setRuleId(ruleId) {
      this.ruleId = ruleId;
      console.log("this.ruleId", this.ruleId);
    }
  },
  getters: {
    getResponseData: (state) => state.responseData,
    getTaskForm: (state) => state.taskForm,
    getRuleId: (state) => state.ruleId,
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