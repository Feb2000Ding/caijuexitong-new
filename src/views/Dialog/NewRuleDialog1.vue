<template>
  <div v-if="isShow" class="task-modal-overlay">
    <div class="task-modal">
      <!-- Modal Header -->
      <div class="task-modal-header">
        <div class="task-modal-title">
          <img src="@/assets/images/icon-title.png" alt="Icon" class="task-modal-icon" />
          编辑裁决规则
        </div>
        <button @click="closeDialog" class="close-button">X</button>
      </div>

      <!-- Modal Body -->
      <div class="task-modal-body">
        <div class="form-container">

          <!-- 规则名称、裁决模型、添加时间 -->
          <div class="form-row">
            <div class="form-column">
              <label for="ruleName">规则名称</label>
              <input type="text" id="ruleName" v-model="formData.ruleName" />
            </div>
            <div class="form-column">
              <label for="model">裁决模型</label>
              <select id="model" class="select-box" v-model="formData.model" style="margin-left: -3px;">
                <option value="" disabled selected>选择裁决模型</option>
                <option v-for="model in modelOptions" :key="model.modelId" :value="model.modelId">{{ model.modelName }}</option>
              </select>
            </div>
            <div class="form-column">
              <label for="addTime">添加时间</label>
              <input type="text" id="addTime" v-model="formData.addTime" />
            </div>
          </div>

          <!-- 毁伤等级 -->
          <div v-for="(damageLevel, index) in formData.damageLevels" :key="index" class="form-row">
            <div class="form-column">
              <label :for="'damageLevelName' + index">毁伤等级定义</label>
              <div class="input-with-button">
                <input
                    :id="'damageLevelName' + index"
                    type="text"
                    v-model="damageLevel.name"
                />
                <!-- 添加毁伤等级按钮 -->
                <button v-if="index === damageLevels.length - 1" @click="addDamageLevel" class="add-damage-level-button">
                  添加毁伤等级
                </button>
                <!-- 删除毁伤等级按钮 -->
                <button v-if="damageLevels.length > 1 && index === damageLevels.length - 1" @click="removeDamageLevel" class="remove-damage-level-button">
                  删除毁伤等级
                </button>
              </div>
            </div>
          </div>

          <!-- 目标类型定义 -->
          <div class="target-type-definition">目标类型定义</div>

          <!-- 目标类型容器 -->
          <div v-for="(targetType, index) in formData.targetTypes" :key="index" class="target-container">
            <div class="input-container">
              <input type="text" class="input-field" placeholder="默认目标类型" v-model="targetType.targetType" />
            </div>

            <!-- 条件组 -->
            <div v-for="(condition, conditionIndex) in targetType.conditions" :key="conditionIndex" class="condition-container">
              <div class="input-container">
                <input type="text" class="input-field" placeholder="条件组" v-model="condition.group" />
                <select class="select-box" v-model="condition.logic">
                  <option value="" selected>AND</option>
                  <option value="OR">OR</option>
                </select>
                <button class="remove-condition-button" @click="removeCondition(index, conditionIndex)">删除条件组</button>
              </div>
              <div class="indicater-container" v-for="(indicator, indicatorIndex) in condition.indicators" :key="indicatorIndex">
                <div class="form-row1">
                  <div class="form-column1">
                    <label for="minValue1">指标名称</label>
                    <input type="text" v-model="indicator.minValue" style="margin-left:-6px;" />
                  </div>
                  <div class="form-column1">
                    <label for="maxValue1"></label>
                    <select v-model="indicator.maxValue" class="select-box" style="margin-left:-2px;">
                      <option value="numeric" selected>数值型</option>
                      <option value="probability">概率型</option>
                    </select>
                  </div>
                  <button class="add-range-button" @click="addRange1(index, conditionIndex, indicatorIndex)">添加范围</button>
                  <button class="remove-indicator-button" @click="removeIndicator(index, conditionIndex, indicatorIndex)">删除指标</button>
                </div>

                <div v-for="(range, rangeIndex) in indicator.ranges || []" :key="rangeIndex" class="form-row1">
                  <div class="form-column1">
                    <label for="minValue1">最小值</label>
                    <input id="minValue1" type="text" v-model="range.minValue" />
                  </div>
                  <div class="form-column1">
                    <label for="maxValue1">最大值</label>
                    <input id="maxValue1" type="text" v-model="range.maxValue" />
                  </div>
                  <div class="form-column1">
                    <label for="impactFactor">影响系数</label>
                    <input id="impactFactor" type="text" v-model="range.impactFactor" />
                  </div>
                  <div class="form-column1">
                    <label for="stop">终止判断</label>
                    <input type="radio" id="stop" v-model="range.stop" :value="true" style="height:15px; width:15px;" />
                  </div>
                  <button class="remove-range-button" @click="removeRange1(index, conditionIndex, indicatorIndex, rangeIndex)">删除范围</button>
                </div>
              </div>
              <button class="add-indicator-button" @click="addIndex(index, conditionIndex)">添加指标</button>
            </div>

            <button class="add-condition-button" @click="addCondition(index)">添加条件组</button>

            <div v-for="(index, indexIndex) in targetType.indexes" :key="indexIndex" class="index-container">
              <div class="input-container">
                <input type="text" class="input-field" placeholder="指标名称" v-model="index.indexName" />
                <select class="select-box" v-model="index.valueRange">
                  <option value="" disabled selected>数值范围</option>
                  <option value="index2">概率模型</option>
                </select>
                <button class="add-range-button1" @click="addRange(index, indexIndex)">添加范围</button>
                <button class="remove-range-button1" @click="removeRange(index, indexIndex)">删除范围</button>
              </div>

              <div v-for="(range, rangeIndex) in index.ranges" :key="rangeIndex" class="form-row1">
                <div class="form-column1">
                  <label for="minValue">最小值</label>
                  <input type="text" id="minValue" v-model="range.minValue" />
                </div>
                <div class="form-column1">
                  <label for="maxValue">最大值</label>
                  <input type="text" id="maxValue" v-model="range.maxValue" />
                </div>
                <div class="form-column1">
                  <label for="destroyLevel">毁伤等级</label>
                  <select id="destroyLevel" v-model="range.destroyLevel" class="select-box">
                    <option v-for="(damageLevel, index) in damageLevels" :key="index" :value="damageLevel.name">
                      {{ damageLevel.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button class="add-target-type-button" @click="addTargetType" style="position: relative; left: 30px; top:20px">添加目标类型</button>
        </div>
      </div>

      <!-- Dialog Footer -->
      <div class="dialog-footer">
        <button class="button" @click="saveRuleData">保存规则</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, defineProps, defineEmits, onMounted, watch,} from 'vue';
import axios from 'axios';
import { useTaskStore } from '@/stores/counter.js';
// import { useRuleStore } from '@/stores/counter.js';

// 获取 store
const taskStore = useTaskStore()
const taskForm = taskStore.getTaskForm
console.log("taskForm", taskForm)
const ruleId = ref(taskStore.ruleId);
console.log("taskStore.ruleId", taskStore.ruleId)

// 表单数据
const formData = ref({
  ruleName: '',
  model: '',
  addTime: '',
  targetTypes: [
    {
      targetType: '',
      indexName: '',
      select: '',
      conditions: [
        {
          group: '',
          logic: 'AND',
          indicators: [
            {
              minValue: '',
              maxValue: 'numeric',
              ranges: [
                {
                  minValue: '',
                  maxValue: '',
                  impactFactor: '',
                  stop: false
                }
              ]
            }
          ]
        }
      ],
      indexes: [
        {
          indexName: '',   // 指标名称
          valueRange:'',
          ranges: [        // 每个 index 下的范围数据
            {
              minValue: '',        // 最小值
              maxValue: '',        // 最大值
              destroyLevel: ''     // 毁伤等级
            }
          ]
        }
      ],
      // finalIndicator: {
      //   indicatorName: '综合毁伤指标',
      //   dataType: 'DECIMAL',
      //   ranges: [
      //     { minValue: 0, maxValue: 1.1, damageLevel: '轻微' },
      //     { minValue: 1.1, maxValue: 1.2, damageLevel: '中等' },
      //     { minValue: 1.2, maxValue: 999999, damageLevel: '严重' }
      //   ]
      // }
    }
  ],
  damageLevels: [
    { name: '' },
  ]
});

// const ruleStore = useRuleStore()
// console.log("ruleStoreinnewDialog",ruleStore)
// const ruleId = taskStore.ruleId;
watch(
    () => taskStore.ruleId,
    async (newVal) => {
      console.log('Rule ID 更新为:', newVal);
      ruleId.value = newVal;

      if (newVal) {
        try {
          const response = await fetch(`http://192.168.43.234:3001/api/calRule/view/${newVal}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Rule Details:", data);

          const ruleData = data.data.rule;

          // 更新规则名称和创建时间
          formData.value.ruleName = ruleData.ruleName || "";
          formData.value.addTime = ruleData.createTime || "";

          // 更新损伤等级
          formData.value.damageLevels = ruleData.damageLevels.map(damageLevel => ({
            name: damageLevel.name || ""
          }));

          // 更新目标类型及其条件
          formData.value.targetTypes = ruleData.targetTypes.map(target => ({
            targetType: target.targetType || "",
            conditions: target.groups
                ? target.groups.map(group => ({
                  group: group.groupName || "",
                  logic: group.operator || "AND",
                  indicators: group.indicators
                      ? group.indicators.map(indicator => ({
                        minValue: indicator.indicatorName || "",
                        maxValue: indicator.dataType || "numeric",
                        ranges: indicator.ranges
                            ? indicator.ranges.map(range => ({
                              minValue: range.minValue || null,
                              maxValue: range.maxValue || null,
                              impactFactor: range.weight || null
                            }))
                            : []
                      }))
                      : []
                }))
                : [],
            indexs: target.finalIndicator
                ? {
                  indexName: target.finalIndicator.indicatorName || "",
                  valueRange: target.finalIndicator.dataType || "",
                  ranges: target.finalIndicator.ranges
                      ? target.finalIndicator.ranges.map(range => ({
                        minValue: range.minValue || null,
                        maxValue: range.maxValue || null,
                        destroyLevel: range.damageLevel || ""
                      }))
                      : []
                }
                : {
                  indicatorName: "",
                  dataType: "",
                  ranges: []
                }
          }));

          console.log("formData.value.targetTypes", formData.value.targetTypes);
        } catch (error) {
          console.error("Error fetching rule data:", error);
        }
      }
    }
);

// 暴露 ruleId 供模板使用
// const { ruleId } = taskStore;
console.log("111111111111111111111111111111111111ruleId",ruleId)

const props = defineProps({
  isShow: Boolean,
  isEditMode: Boolean,
  currentTaskData: Object
});
console.log("isEditMode", props.isEditMode, props.currentTaskData);

watch(() => props.isEditMode, (newVal) => {
  console.log("是否编辑模式:", newVal);  // 打印是否是编辑模式
});

watch(() => props.currentTaskData, (newVal) => {
  console.log("接收到的任务数据:", newVal);  // 打印接收到的任务数据
});

const emit = defineEmits(['update:isShow', 'saveRuleData']);

// 裁决模型的下拉框数据
const modelOptions = ref([]);

// 获取裁决模型的列表
const getModels = async () => {
  try {
    const response = await axios.post('http://192.168.43.234:3001/api/judgeModel/pageList', {
      current: 0,
      pageSize: 100,
      sortField: "",
      sortOrder: "",
      modelName: "",
      modelType: ""
    });

    if (response.data.code === 0) {

      modelOptions.value = response.data.data.records || [];
    } else {
      console.error('获取裁决模型失败:', response.data.message);
    }
  } catch (error) {
    console.error('获取裁决模型请求失败:', error);
  }
};


const damageLevels = ref([
  { name: '' }
]);

const buttonTop = ref(0);

// 添加一个新的毁伤等级定义
const addDamageLevel = () => {
  formData.value.damageLevels.push({
    name: ''
  });
  buttonTop.value += 30;
};

// 删除指定的毁伤等级定义（从下方开始删除）
const removeDamageLevel = () => {
  if (formData.value.damageLevels.length > 1) {
    formData.value.damageLevels.pop();
  }
};

// 条件组
const conditions = ref([
  {
    group: '',
    logic: '',
    indicators: []
  }
]);

// 添加一个新的条件组
const addCondition = (targetTypeIndex) => {
  // 向指定目标类型的 conditions 数组添加新的条件组
  formData.value.targetTypes[targetTypeIndex].conditions.push({
    group: '',            // 条件组的名称
    logic: '',            // 逻辑操作符
    indicators: [         // 初始情况下，指示器数组为空
      {
        minValue: '',      // 指标名称（可以是数值或其他标识）
        maxValue: 'numeric', // 默认值为数值型
        ranges: [           // 每个指示器下的范围数据
          {
            minValue: '',   // 范围的最小值
            maxValue: '',   // 范围的最大值
            impactFactor: '', // 影响系数
            stop: false      // 是否终止判断，默认为 false
          }
        ]
      }
    ]
  });
};

// 删除指定目标类型下的指定条件组
const removeCondition = (index, conditionIndex) => {
  // 确保条件组数组至少有一个元素时才能删除
  if (formData.value.targetTypes[index].conditions.length > 1) {
    // 删除指定索引的条件组
    formData.value.targetTypes[index].conditions.splice(conditionIndex, 1);
  }
};

// 添加一个新的指标到指定目标类型的 conditions 数组
const addIndex = (index, conditionIndex) => {
  const targetType = formData.value.targetTypes[index];
  const condition = targetType.conditions[conditionIndex];

  // 只添加指标，如果没有 indicators 则初始化为空数组
  if (!condition.indicators) {
    condition.indicators = [];
  }

  // 向 indicators 数组中添加一个新的指标对象
  condition.indicators.push({
    minValue: '',             // 指标的最小值
    maxValue: 'numeric',      // 指标的最大值（默认设置为 'numeric'）
    ranges: [
      {
        minValue: '',        // 范围的最小值
        maxValue: '',        // 范围的最大值
        impactFactor: '',    // 影响系数
        stop: false          // 终止判断
      }
    ]
  });
};

// 删除指定条件下的指标
const removeIndicator = (index, conditionIndex, indicatorIndex) => {
  const targetType = formData.value.targetTypes[index];
  const condition = targetType.conditions[conditionIndex];

  console.log('indicatorIndex:', indicatorIndex);
  console.log('indicators:', condition.indicators);

  if (condition.indicators && condition.indicators.length > 0) {
    condition.indicators.splice(indicatorIndex, 1);
  }
  formData.value = { ...formData.value };
};

// 范围
const ranges = ref([
  { minValue: '', maxValue: '', destroyLevel: '' }
]);

// 添加范围
const addRange = (index, indexItemIndex) => {
  const targetType = formData.value.targetTypes[index];
  console.log("formData.value.targetTypes[index]",formData.value.targetTypes[index])
  console.log("targetType",targetType)
  const indexItem = targetType.indexes[indexItemIndex];

  // 确保每个 index 的 ranges 数组存在
  if (!indexItem.ranges) {
    indexItem.ranges = [];
  }

  // 向指定指标的 ranges 数组添加一个新的范围对象
  indexItem.ranges.push({
    minValue: '',        // 最小值
    maxValue: '',        // 最大值
    destroyLevel: ''     // 毁伤等级
  });
};

// 删除最后一组范围
const removeRange = (index, indexItemIndex, rangeIndex = null) => {
  const targetType = formData.value.targetTypes[index];
  const indexItem = targetType.indexes[indexItemIndex];

  // 确保 ranges 数组存在且不为空
  if (indexItem.ranges && indexItem.ranges.length > 0) {
    if (rangeIndex === null) {
      // 删除最后一个范围
      indexItem.ranges.pop();
    } else {
      // 删除指定索引的范围
      indexItem.ranges.splice(rangeIndex, 1);
    }
  }
};

// 初始化一个数组来保存每组数据
const indicators = ref([]);

// 添加一组数据
const addRange1 = (index, conditionIndex, indicatorIndex) => {
  const targetType = formData.value.targetTypes[index];
  console.log("targetType",targetType)
  const condition = targetType.conditions[conditionIndex];
  console.log("condition", condition)
  const indicator = condition.indicators[indicatorIndex];
  console.log("indicator", indicator)

  // 确保每个 indicator 的 ranges 数组存在
  if (!indicator.ranges) {
    indicator.ranges = [];
  }

  // 向指定 indicator 的 ranges 数组添加一个新的范围对象
  indicator.ranges.push({
    minValue: '',         // 最小值
    maxValue: '',         // 最大值
    impactFactor: '',     // 影响系数
    stop: false ,          // 是否终止
    deleteButton: true
  });

  // 确保 Vue 的响应式更新
  // formData.value = { ...formData.value };
};

// 删除指定范围
const removeRange1 = (index, conditionIndex, indicatorIndex, rangeIndex) => {
  const targetType = formData.value.targetTypes[index];
  const condition = targetType.conditions[conditionIndex];
  const indicator = condition.indicators[indicatorIndex];

  // 确保 ranges 数组存在且不为空
  if (indicator.ranges && indicator.ranges.length > 0) {
    // 删除指定索引的范围
    indicator.ranges.splice(rangeIndex, 1);

    // 确保 Vue 的响应式更新
    // formData.value = { ...formData.value };
  }
};

// 添加目标类型
const addTargetType = () => {
  // 向 targetTypes 数组中添加一个新的目标类型对象
  formData.value.targetTypes.push({
    targetType: '',  // 新目标类型
    indexName: '',
    select: '',
    conditions: [
      {
        group: '',
        logic: '',
        indicators: [
          {
            minValue: '',  // 指标名称
            maxValue: 'numeric',  // 默认值为数值型
            ranges: [
              {
                minValue: '',        // 最小值
                maxValue: '',        // 最大值
                impactFactor: '',    // 影响系数
                stop: false          // 终止判断
              }
            ]
          }
        ]
      }
    ],
    indexes: [
      {
        indexName: '',   // 指标名称
        valueRange: '',
        ranges: [        // 每个 index 下的范围数据
          {
            minValue: '',        // 最小值
            maxValue: '',        // 最大值
            destroyLevel: ''     // 毁伤等级
          }
        ]
      }
    ]
  });
};

// 删除目标类型
const removeTargetType = (index) => {
  if (formData.value.targetTypes.length > 1) {
    formData.value.targetTypes.splice(index, 1);
  }
};

// 保存规则数据
const saveRuleData = async () => {
  const payload = {
    rule: {
      ruleId: ruleId.value,
      ruleName: formData.value.ruleName,
      modelId: 1,
      damageLevels: formData.value.damageLevels.map(level => ({
        name: level.name
      })),
      targetTypes: formData.value.targetTypes.map(targetType => ({
        targetType: targetType.targetType,
        groups: targetType.conditions.map(condition => ({
          groupName: condition.group,
          operator: condition.logic,
          indicators: condition.indicators.map(indicator => ({
            indicatorName: indicator.minValue,
            dataType: indicator.maxValue,
            ranges: indicator.ranges ? indicator.ranges.map(range => ({
              minValue: range.minValue,
              maxValue: range.maxValue,
              weight: range.impactFactor,
              isTerminal: range.stop,
              damageLevel: range.impactFactor
            })) : []
          }))
        })),
        finalIndicator: {
          indicatorName: targetType.indexName,
          dataType: targetType.select,
          ranges: (targetType.indexes || []).flatMap(index =>
              (index.ranges || []).map(range => ({
                minValue: range.minValue,
                maxValue: range.maxValue,
                damageLevel: range.destroyLevel
              }))
          )
        }
      }))
    }
  };

  try {
    // 调用保存接口
    const response = await axios.post('http://192.168.43.234:3001/api/calRule/update', payload);
    console.log('Response:', response.data);

    // 根据后端返回的数据处理逻辑
    if (response.data.code === 0) {
      emit('saveRuleData', response.data);
      emit('update:isShow', false); // 关闭对话框
    } else {
      console.error('保存失败:', response.data.message);
    }
  } catch (error) {
    console.error('Error saving rule:', error);
  }
};

// const ruleStore = useRuleStore();
// console.log("ruleStore",ruleStore)

const fetchRuleData = async (ruleId) => {
  try {
    console.log(111111111111111111)
    const response = await fetch(`http://192.168.43.234:3001/api/calRule/view/${ruleId}`);
    const data = await response.json();
    console.log("ruledata",data)
    if (data.code === 0) {
      taskForm.value = data.data;  // 更新 taskForm 数据
    }
  } catch (error) {
    console.error('Error fetching rule data:', error);
  }
};

// 关闭对话框
const closeDialog = () => {
  emit('update:isShow', false);
};

onMounted(() => {
  getModels();
  // const ruleStore = useRuleStore()
  // console.log("ruleStoreinnewDialog",ruleStore)
  // const ruleId = ruleStore.ruleId;
  // console.log("ruleId",ruleId)
  const taskStore = useTaskStore()
  const taskForm = taskStore.getTaskForm
  console.log("taskForm", taskForm)

// const ruleStore = useRuleStore()
// console.log("ruleStoreinnewDialog",ruleStore)
  const ruleId = taskStore.ruleId;
  console.log("mounted111111111111111111111111111111111111ruleId",ruleId)
  if (ruleId) {
    fetchRuleData(ruleId);
  }
});
</script>

<style scoped>
.task-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.task-modal {
  width: 70vw;
  height: 80vh;
  max-height: 80vh;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: linear-gradient(0deg, rgba(0, 126, 255, 0.30) 0%, rgba(0, 248, 255, 0.00) 100%),
  linear-gradient(180deg, rgba(0, 126, 255, 0.30) 0%, rgba(5, 55, 112, 0.00) 22.79%),
  rgba(0, 0, 0, 0.75);
  box-shadow: 0px -3px 9.8px -2px #0084f4 inset;
}

.task-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 45px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.task-modal-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.task-modal-icon {
  width: 23px;
  height: 23px;
  margin-right: 10px;
}

.close-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 900;
  color: #01E3FF;
}

.task-modal-body {
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.task-modal-body::-webkit-scrollbar {
  width: 0px;  /* 隐藏滚动条 */
}

.task-modal-body::-webkit-scrollbar-thumb {
  background: transparent; /* 隐藏滑块 */
}

.task-modal-body::-webkit-scrollbar-track {
  background: transparent; /* 隐藏轨道 */
}

.form-container {
  width: 100%;
}

.form-row {
  display: flex;
  gap: 50px;
  margin-bottom: 20px;
}

.form-row1 {
  display: flex;
  gap: 0;
  margin-left: 23px;
}

.form-row1:first-child {
  margin-top: 80px;
}

.form-row1:not(:first-child) {
  margin-top: 20px;
}

.form-column {
  width: 500px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.form-column1 {
  width: 450px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.form-column label, .form-column1 label {
  font-size: 16px;
  color: #F6F9FE;
  text-shadow: 0px 2px 8px rgba(5, 28, 55, 0.42), 0px 0px 7px rgba(75, 180, 229, 0.25);
  font-family: "Alibaba PuHuiTi";
  font-weight: 400;
  margin-right: 10px;
}

.form-column input, .form-column1 input{
  width: 260px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 4px;
  border: 1px solid #00E0FF;
  background: #062A51;
  color: white;
  padding-left: 10px;
}

.form-row:first-child .form-column:first-child {
  margin-left: 30px;
}
.form-row:first-child .form-column:nth-child(2) {
  margin-left: 43px;
}

.input-with-button {
  display: flex;
  align-items: center;
  gap: 10px;
}

.add-damage-level-button,
.add-indicator-button,
.add-condition-button,
.add-range-button,
.add-range-button1,
.add-target-type-button {
  width: 120px;
  height: 30px;
  flex-shrink: 0;
  background-color: #062A51;
  color: #BDEEFF;
  text-align: center;
  font-family: "Source Han Sans CN";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border: 1px solid #00E0FF;
  border-radius: 4px;
  cursor: pointer;
}

.add-indicator-button {
  position: absolute;
  left: 1190px;
  top: 14px;
}

.add-range-button1 {
  top: 15px;
  left: 400px;
}

.add-condition-button {
  position: absolute;
  left: 300px;
  margin-top: 15px;
}

.target-type-definition {
  width: 138px;
  height: 29px;
  margin-left: 45px;
  flex-shrink: 0;
  color: #F6F9FE;
  text-shadow: 0px 2px 8px rgba(5, 28, 55, 0.42), 0px 0px 7px rgba(75, 180, 229, 0.25);
  font-family: "Alibaba PuHuiTi";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-top: 20px;
}

.target-container {
  width: calc(100% - 40px);
  /*height: 465px;*/
  margin: 20px auto 0;
  border-radius: 4px;
  border: 1px solid #ADB5FF;
  background: rgba(6, 42, 81, 0.10);
  flex-shrink: 0;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  gap: 20px;
}

.input-container {
  width: 100%;
  height: 58px;
  flex-shrink: 0;
  border-radius: 4px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: 1px solid #ADB5FF;
  background: rgba(173, 181, 255, 0.30);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /*margin-top: 13px; !* 距离父容器上边距 13px *!*/
  /*margin-left: 28px; !* 距离父容器左边距 28px *!*/
}

.input-field {
  width: 237px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 4px;
  border: 1px solid #00E0FF;
  background: #062A51;
  color: white;
  padding-left: 10px;
  position: absolute;
  top: 13px;
  left: 28px;
}

.input-field::placeholder {
  color: #F6F9FE;
  text-shadow: 0px 2px 8px rgba(5, 28, 55, 0.42), 0px 0px 7px rgba(75, 180, 229, 0.25);
  font-family: "Alibaba PuHuiTi", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.select-box {
  width: 237px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 4px;
  border: 1px solid #00E0FF;
  background: #062A51;
  color: #F6F9FE;
  padding: 0 10px;
  font-size: 16px;
  font-family: "Source Han Sans CN";
  font-weight: 400;
  line-height: normal;
  box-sizing: border-box;
  z-index: 100;
  display: block;
  margin: 0 auto;
}

.condition-container {
  width: calc(100% - 40px);
  /*height: 118px;*/
  flex-shrink: 0;
  border-radius: 4px;
  border: 1px solid #4CA8F7;
  background: rgba(6, 42, 81, 0.10);
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  padding-bottom: 20px;
  position: relative;
  min-height: 120px;
}

.condition-container .input-container {
  width: 100%;
  border-bottom: 1px solid #4CA8F7;
  background: rgba(76, 168, 247, 0.30);
}

.indicater-container {
  border: 1px solid #ccc;
  border-radius: 10px;
  margin: 20px;
  padding-bottom:20px;
}

.index-container {
  width: calc(100% - 40px);
  /*height: 173px;*/
  flex-shrink: 0;
  border-radius: 4px;
  border: 1px solid #1FFFD7;
  background: rgba(6, 42, 81, 0.10);
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  padding-bottom: 20px;
  position: relative;
}

.index-container .input-container {
  width: 100%;
  border-bottom: 1px solid #1FFFD7;
  background: rgba(31, 255, 215, 0.30);
}

.remove-damage-level-button,
.remove-condition-button,
.remove-indicator-button,
.remove-range-button,
.remove-range-button1
{
  width: 121px;
  height: 32px;
  flex-shrink: 0;
  background-color: rgba(255, 0, 0, 0.69);
  color: white;
  border: 1px solid #F56C6C;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  line-height: 32px;
  cursor: pointer;
  position: absolute;
}

.remove-damage-level-button{
  left: 500px;
  top: 500px;
}

.remove-condition-button {
  right: 20px;
  top: 13px;
}

.remove-indicator-button {
  left: 800px;
  top: 160px;
}

.remove-range-button {
  left: 1200px;
  top: 210px;
}

.remove-range-button1 {
  left: 1315px;
  top: 15px;
}

/*.remove-range-button {*/
/*  left: 800px;*/
/*}*/

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 10px;
  background-color: transparent;
}

.button {
  width: 100px;
  height: 32px;
  background-color: #1FC6FF;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 400;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  line-height: 32px;
  transition: background-color 0.3s;
  margin-right: 20px;
  margin-left: auto;
}

.button:hover {
  background-color: #2391FF;
  color: white;
}
</style>