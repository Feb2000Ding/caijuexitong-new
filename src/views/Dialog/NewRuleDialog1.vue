<template>
  <div v-if="isShow" class="task-modal-overlay">
    <div class="task-modal">
      <!-- 头部 -->
      <div class="task-modal-header">
        <div class="task-modal-title">
          <img src="@/assets/images/icon-title.png" alt="Icon" class="task-modal-icon" />
          修改裁决规则
        </div>
        <button @click="closeDialog" class="close-button">X</button>
      </div>

      <!-- 主体 -->
      <div class="task-modal-body">
        <div class="form-container">

          <!-- 规则名称、裁决模型、添加时间 -->
          <div class="form-row">
            <div class="form-column">
              <label for="ruleName">规则名称</label>
              <input type="text" id="ruleName" v-model="formData.ruleName" style="height:32px; width: 237px"/>
            </div>
            <!--            <div class="icon-container">-->
            <!--              <img src="@/assets/images/tip1.svg" alt="背景图" class="image-167" style="margin-left: 250px;"/>-->
            <!--              <div class="tooltip">规则名不能重复</div>-->
            <!--              &lt;!&ndash;                <img src="@/assets/images/u168.svg" alt="前景图" class="image-168" />&ndash;&gt;-->
            <!--            </div>-->
            <div class="form-column">
              <label for="model">裁决模型</label>
              <select id="model" class="select-box" v-model="formData.model" style="margin-left: -3px;">
                <option value="" selected disabled>请选择裁决模型</option>
                <option v-for="model in modelOptions" :key="model.modelId" :value="model.modelId">{{ model.modelName }}</option>
              </select>
            </div>
            <div class="form-column">
              <label for="addTime">添加时间</label>
              <input type="text" id="addTime" v-model="formData.addTime" style="height:32px; width: 237px"/>
            </div>
          </div>

          <!-- 毁伤等级 -->
          <div v-for="(damageLevel, index) in damageLevels" :key="index" class="form-row">
            <div class="form-column">
              <label :for="'damageLevelName' + index">毁伤等级定义</label>
              <div class="input-with-button">
                <!--                <div class="dropdown-input" @click.outside="closeDropdown">-->
                <!--                  &lt;!&ndash; 输入框 &ndash;&gt;-->
                <!--                  <input-->
                <!--                      :id="'damageLevelName' + index"-->
                <!--                      v-model="inputValue"-->
                <!--                      class="input-field"-->
                <!--                      placeholder="请选择毁伤等级"-->
                <!--                      @focus="openDropdown"-->
                <!--                      @input="filterOptions"-->
                <!--                  />-->

                <!--                  &lt;!&ndash; 下拉框 &ndash;&gt;-->
                <!--                  <ul v-if="showDropdown" class="dropdown-menu">-->
                <!--                    <li-->
                <!--                        v-for="(option, i) in filteredOptions"-->
                <!--                        :key="i"-->
                <!--                        @click="selectOption(option)"-->
                <!--                    >-->
                <!--                      {{ option }}-->
                <!--                    </li>-->
                <!--                    <li v-if="filteredOptions.length === 0" class="no-option">无匹配项</li>-->
                <!--                  </ul>-->
                <!--                </div>-->
                <select :id="'damageLevelName' + index" v-model="damageLevel.name" class="select-box">
                  <option value="" disabled selected>请选择毁伤等级</option>
                  <option value="轻微">轻微</option>
                  <option value="损伤">损伤</option>
                  <option value="损毁">损毁</option>
                  <option value="摧毁">摧毁</option>
                </select>
                <!-- 添加毁伤等级按钮 -->
                <button
                    v-if="index === damageLevels.length - 1"
                    @click="addDamageLevel"
                    class="add-button"
                >
                  添加毁伤等级
                </button>
                <!-- 删除毁伤等级按钮 -->
                <button
                    v-if="damageLevels.length > 1 && index === damageLevels.length - 1"
                    @click="removeDamageLevel"
                    class="delete-button1"
                    :style="{ top: deleteButtonTop + 'px' }"
                >
                  删除毁伤等级
                </button>
              </div>
            </div>
          </div>

          <!-- 目标类型定义 -->
          <div class="target-type-definition">
            裁决目标类型定义
            <button class="example-button" @click="openExamplePanel">查看示例方案</button>
          </div>

          <!-- 目标类型容器 -->
          <div v-for="(targetType, index) in formData.targetTypes" :key="index" class="target-container">
            <!--            <div class="input-container">-->
            <!--&lt;!&ndash;              <label>目标类型</label>&ndash;&gt;-->
            <!--              <input type="text" class="input-field" placeholder="目标类型" v-model="targetType.type" />-->
            <!--            </div>-->
            <div class="input-container">
              <select class="input-field" id="targetType" v-model="targetType.type">
                <option value="" disabled selected>请选择裁决目标类型</option>
                <option value="主体结构">主体结构</option>
                <option value="太阳能板">太阳能板</option>
                <option value="光学器件">光学器件</option>
                <option value="表面涂层">表面涂层</option>
              </select>
              <div class="icon-container" style="position: relative;">
                <img src="@/assets/images/tip1.svg" alt="背景图" class="image-167" />
                <div class="tooltip">请选择目标类型</div>
              </div>
            </div>

            <div class="target-type-definition1">条件组定义</div>

            <!-- 条件组和指标 -->
            <div v-for="(condition, conditionIndex) in targetType.conditions" :key="conditionIndex" class="condition-container">
              <div class="input-container">
                <!--                <input type="text" class="input-field" placeholder="条件组" v-model="condition.group" />-->
                <select class="input-field" v-model="condition.group">
                  <option value="请选择条件组" disabled selected>请选择条件组</option>
                  <option value="条件组1" selected>主体结构指标组</option>
                  <option value="条件组2">太阳能板指标组</option>
                  <option value="条件组3">光学器件指标组</option>
                  <option value="条件组4">表面涂层指标组</option>
                </select>

                <!-- 图标组 -->
                <div class="icon-container">
                  <img src="@/assets/images/tip1.svg" alt="背景图" class="image-167" />
                  <div class="tooltip">请选择条件组</div>
                </div>

                <select class="select-box" v-model="condition.logic">
                  <option value="" selected>AND</option>
                  <option value="OR">OR</option>
                </select>
                <button class="delete-button" @click="removeCondition(index, conditionIndex)">删除条件组</button>
              </div>

              <div style="display: flex; align-items: center; margin-top: 20px;">
                <div class="target-type-definition1" style="margin-right: 5px;">指标组定义</div>
                <!--                <div class="icon-container" style=" width: 26px; height: 26px; cursor: pointer; margin-left: -135px;">-->
                <!--                  <img src="@/assets/images/tip1.svg" alt="背景图" class="image-167" style="width: 10px; height: 10px;" />-->
                <!--                  <div class="tooltip" style="position: absolute; top: -40px; left: 50%; transform: translateX(-50%); background-color: #062A51; color: #ffffff; padding: 5px 10px; font-size: 12px; border-radius: 4px; white-space: nowrap; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; z-index: 10;">-->
                <!--                    范围示例：100-1000-->
                <!--                  </div>-->
                <!--                </div>-->
              </div>
              <div class="indicater-container" v-for="(indicator, indicatorIndex) in condition.indicators" :key="indicatorIndex">
                <!-- 第一行：指标名称和最大值 -->
                <div class="form-row1">
                  <div class="form-column1">
                    <label for="minValue1">指标名称</label>
                    <select v-model="indicator.minValue" @change="updateRange" class="select-box" style="margin-left:-6px; width:237px; height:32px;">
                      <option value="出光时长">出光时长</option>
                      <option value="倒靶功率密度">倒靶功率密度</option>
                    </select>
                  </div>
                  <div class="form-column1">
                    <label for="maxValue1"></label>
                    <select v-model="indicator.maxValue" class="select-box" style="margin-left:-52px;">
                      <option value="numeric" selected>数值型</option>
                      <option value="probability">概率型</option>
                    </select>
                  </div>
                </div>

                <button class="delete-button2" @click="removeIndicator(index, conditionIndex, indicatorIndex)">删除指标</button>

                <!-- 第二行：范围数据 -->
                <div v-for="(range, rangeIndex) in indicator.ranges || []" :key="rangeIndex" class="form-row1" >
                  <div class="form-column1" style="margin-left:9px;">
                    <label for="minValue1" style="white-space: nowrap;">最小值</label>
                    <input id="minValue1" type="text" v-model="range.minValue" @input="syncMinValueToIndexes" style="width:237px; height:32px;" />
                  </div>
                  <div class="form-column1" style="margin-left:47px">
                    <label for="maxValue1" style="white-space: nowrap; width:45px;">最大值</label>
                    <input id="maxValue1" type="text" v-model="range.maxValue" style="width:237px; height:32px;" />
                  </div>
                  <div class="form-column1" style="margin-left: 32px">
                    <label for="impactFactor" style="white-space: nowrap; width:65px;">影响系数</label>
                    <input id="impactFactor" type="text" v-model="range.impactFactor" style="width:237px; height:32px;" />
                  </div>
                  <div class="form-column1" style="margin-left:9px;">
                    <label for="stop" style="white-space: nowrap;">终止判断</label>
                    <input type="checkbox" id="stop" v-model="range.stop" :value="true" style="height:15px; width:15px;" />
                  </div>

                  <div class="form-row1">
                    <button
                        class="add-button4"
                        @click="addRange1(index, conditionIndex, indicatorIndex)"
                        :style="{ left: '20px', marginBottom: '10px', marginTop: buttonOffset + 'px' }"
                    >
                      添加范围
                    </button>
                  </div>

                  <!-- 删除按钮逻辑 -->
                  <button v-if="range.deleteButton"
                          class="delete-button3"
                          @click="removeRange1(index, conditionIndex, indicatorIndex, rangeIndex)"
                          :style="{ marginTop: range.marginTop + 'px' }">
                    删除范围
                  </button>
                </div>

              </div>

              <!-- 每个 condition 组下的 "添加指标" 按钮 -->
              <button class="add-button2" @click="addIndex(index, conditionIndex)">添加指标组</button>
            </div>

            <!-- 添加条件组按钮 -->
            <button class="add-button3" @click="addCondition(index)">添加条件组</button>

            <div class="target-type-definition1">最终指标定义</div>
            <!-- 最终指标 -->
            <div v-for="(indexItem, indexItemIndex) in targetType.indexes" :key="indexItemIndex" class="index-container">
              <div class="input-container">
                <!-- 指标名称选择下拉框 -->
                <select class="input-field" v-model="indexItem.indexName" style="height:32px; width:237px;">
                  <option value="" disabled selected>请选择最终指标</option>
                  <option v-for="item in selectedOptions" :key="item" :value="item">{{ item }}</option>
                </select>

                <!-- 数值范围选择下拉框 -->
                <select class="select-box" v-model="indexItem.valueRange">
                  <option value="" selected>数值范围</option>
                  <option value="index2">概率模型</option>
                </select>
              </div>

              <!-- 删除范围按钮 -->
              <div v-for="(button, buttonIndex) in indexItem.deleteButtons" :key="buttonIndex" v-if="indexItem.valueRange !== 'index2'">
                <button
                    class="delete-button4"
                    @click="removeRange(index, indexItemIndex, buttonIndex)"
                    :style="{ marginTop: button.marginTop + 'px' }">
                  删除范围
                </button>
              </div>

              <!-- 范围容器 -->
              <div v-if="indexItem.valueRange === ''">
                <!-- 数值范围显示 -->
                <div v-for="(range, rangeIndex) in indexItem.ranges" :key="rangeIndex" class="form-row1" style="margin-top:20px;">
                  <div class="form-column1">
                    <label for="minValue">最小值</label>
                    <input type="text" id="minValue" v-model="range.minValue" style="height:32px; width:237px;"/>
                  </div>

                  <div class="form-column1" style="margin-left:-70px;">
                    <label for="maxValue">最大值</label>
                    <select id="maxValue" v-model="range.maxValue" class="select-box" style="height:32px; width:237px; margin-left:-2px;">
                      <option value="10">10</option>
                    </select>
                  </div>

                  <div class="form-column1" style="margin-left:-115px;">
                    <label for="destroyLevel">毁伤等级</label>
                    <select id="destroyLevel" v-model="range.destroyLevel" class="select-box" style="height:32px; width:237px; margin-left:-2px;">
                      <option v-for="(damageLevel, index) in damageLevels" :key="index" :value="damageLevel.name">
                        {{ damageLevel.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div v-if="indexItem.valueRange === 'index2'">
                <!-- 概率模型显示 -->
                <div class="form-row1" style="margin-top:20px;">
                  <div class="form-column1">
                    <label for="probabilityValue">轻微的概率阈值</label>
                    <input type="text" id="probabilityValue" v-model="indexItem.probabilityValue" style="height:32px; width:237px;"/>
                  </div>
                </div>
              </div>

              <!-- 添加范围按钮 -->
              <div class="form-row1" v-if="indexItem.valueRange !== 'index2'">
                <button class="add-button5" @click="addRange(index, indexItemIndex)" :style="{ marginTop: indexItem.addButton ? indexItem.addButton.marginTop + 'px' : '0px' }">
                  添加范围
                </button>
              </div>
            </div>
          </div>

          <!-- 添加目标类型按钮 -->
          <button class="add-button3" @click="addTargetType" style="position: relative; left: 52px; top: 0">添加目标类型</button>
        </div>
      </div>

      <!-- 底部 -->
      <div class="dialog-footer">
<!--        <button class="button" @click="openExamplePanel">查看示例</button>-->
        <button class="button" @click="saveRuleData">保存规则</button>
      </div>
      <RuleExamplePanel v-if="isShowRuleExamplePanel" @close="isShowRuleExamplePanel = false" />
    </div>
  </div>
</template>

<script setup>
import {ref, defineProps, defineEmits, onMounted, watch} from 'vue';
import axios from 'axios';
import { useTaskStore } from '@/stores/counter.js';
import RuleExamplePanel from './RuleExamplePanel.vue';

// 控制显示 RuleExamplePanel 的状态
const isShowRuleExamplePanel = ref(false);

// 点击 "查看示例" 按钮时，打开 RuleExamplePanel
const openExamplePanel = () => {
  console.log("11111111111111")
  console.log("查看实例isShowRuleExamplePanel.value", isShowRuleExamplePanel.value)
  isShowRuleExamplePanel.value = true;
  console.log("查看实例isShowRuleExamplePanel.value", isShowRuleExamplePanel.value)
};

const taskStore = useTaskStore()
const taskForm = taskStore.getTaskForm

const options = ref(['选项1', '选项2', '选项3', '选项4']);

const props = defineProps({
  isShow: Boolean,
  isEditMode: Boolean,
  currentTaskData: Object,
});
console.log("isEditMode", props.isEditMode, props.currentTaskData);

watch(() => props.isEditMode, (newVal) => {
  console.log("是否编辑模式:", newVal);
});

watch(() => props.currentTaskData, (newVal) => {
  console.log("接收到的任务数据:", newVal);
});

const defaultFormData = {
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
          logic: '',
          indicators: [
            {
              minValue: '',
              maxValue: 'numeric',
              ranges: [
                {
                  minValue: '',
                  maxValue: '',
                  impactFactor: '',
                  stop: false,
                  deleteButton:''
                },
              ],
            },
          ],
        },
      ],
      indexes: [
        {
          indexName: '',
          valueRange: '',
          ranges: [
            {
              minValue: '',
              maxValue: '',
              destroyLevel: '',
            },
          ],
        },
      ],
    },
  ],
  damageLevels: [
    { name: '' },
  ],
};

watch(
    () => props.isShow,
    (newVal) => {
      if (newVal) {
        resetFormData();
      }
    }
);

const resetFormData = () => {
  formData.value = JSON.parse(JSON.stringify(defaultFormData)); // 深拷贝默认值
  formData.value.addTime = getCurrentTime();
};

// 自定义的下拉框
// 数据和状态
// const inputValue = ref(""); // 输入框的值
// const showDropdown = ref(false); // 是否显示下拉框
// const filteredOptions = ref([]); // 筛选后的选项
//
// // 初始值设置
// watch(
//     () => damageLevel.name,
//     (newValue) => {
//       inputValue.value = newValue || "";
//     },
//     { immediate: true }
// );
//
// // 方法
// const openDropdown = () => {
//   showDropdown.value = true;
// };
//
// const closeDropdown = () => {
//   showDropdown.value = false;
// };
//
// const filterOptions = () => {
//   const input = inputValue.value.toLowerCase();
//   filteredOptions.value = options.filter((option) =>
//       option.toLowerCase().includes(input)
//   );
// };
//
// const selectOption = (option) => {
//   inputValue.value = option;
//   damageLevel.name = option; // 更新绑定值
//   closeDropdown();
// };
//
// // 初始化筛选项
// filteredOptions.value = [...options];

// 点击外部关闭下拉框
// useOutsideClick(document.querySelector(".dropdown-input"), closeDropdown);

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
};

const emit = defineEmits(['update:isShow', 'saveRuleData']);

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
          logic: '',
          indicators: [
            {
              minValue: '',
              maxValue: 'numeric',
              ranges: [
                {
                  minValue: '',
                  maxValue: '',
                  impactFactor: '',
                  stop: false,
                  deleteButton:'',
                  marginTop:''
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
    { name: '轻微' },
    { name: '中等' },
    { name: '严重' },
  ]
});

const selectedOptions = ref([]);

// 更新 selectedOptions
const updateRange = () => {
  // 遍历所有 targetTypes，查找被选中的 minValue
  const selectedMinValues = [];

  formData.value.targetTypes.forEach(targetType => {
    targetType.conditions.forEach(condition => {
      condition.indicators.forEach(indicator => {
        if (indicator.minValue) {
          selectedMinValues.push(indicator.minValue);
        }
      });
    });
  });

  // 去重并更新 selectedOptions
  selectedOptions.value = [...new Set(selectedMinValues)];
};

// 1. 从 localStorage 获取数据
const loadFromLocalStorage = () => {
  const savedData = localStorage.getItem('formData');
  if (savedData) {
    formData.value = JSON.parse(savedData);
  }
};

// 2. 保存数据到 localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('formData', JSON.stringify(formData.value));
};

// 3. 清空表单数据并清除 localStorage
const clearFormData = () => {
  formData.value = {
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
            logic: '',
            indicators: [
              {
                minValue: '',
                maxValue: 'numeric',
                ranges: [
                  {
                    minValue: '',
                    maxValue: '',
                    impactFactor: '',
                    stop: false,
                  },
                ],
              },
            ],
          },
        ],
        indexes: [
          {
            indexName: '',
            valueRange: '',
            ranges: [
              {
                minValue: '',
                maxValue: '',
                destroyLevel: '',
              },
            ],
          },
        ],
      },
    ],
    damageLevels: [
      { name: '轻微' },
      { name: '中等' },
      { name: '严重' },
    ],
  };
  localStorage.removeItem('formData');
};

// 4. 监听 formData 的变化，实时保存
watch(formData, (newFormData) => {
  localStorage.setItem('formData', JSON.stringify(newFormData));
}, { deep: true });

// 同步minValue
const syncMinValueToIndexes = () => {
  const formMinValue = formData.value.targetTypes[0].conditions[0].indicators[0].ranges[0].minValue;

  // 使用 Vue.set 方法确保响应式更新
  formData.value.targetTypes[0].indexes.forEach((index) => {
    index.ranges.forEach((range) => {
      range.minValue = formMinValue;
    });
  });
};

// 监听条件组中的 minValue 变化并同步
// watch(
//     () => formData.value.targetTypes[0].conditions[0].indicators[0].ranges[0].minValue,
//     (newValue) => {
//       // 遍历 formData.targetTypes[0].indexes[0].ranges，设置其 minValue
//       formData.value.targetTypes[0].indexes[0].ranges.forEach((range) => {
//         range.minValue = newValue;
//       });
//     }
// );

watch(
    () => formData.value.targetTypes[0].indexes[0].indexName, // 监听 indexName 变化
    (newIndexName) => {
      console.log("newIndexName", newIndexName)
      // 找到对应的指标范围数据并更新 ranges
      syncRanges(newIndexName);
    }
);

// 当 indicator 的值变化时，自动同步
const syncRanges = (newIndexName) => {
  // 1. 查找目标 index
  const correspondingIndex = formData.value.targetTypes[0].indexes.find(index => index.indexName === newIndexName);
  console.log("correspondingIndex", correspondingIndex);

  if (correspondingIndex) {
    // 2. 查找对应的 indicator
    // 在这里假设 indicator 的 minValue 或 maxValue 的名称是和 indexName 对应的
    const correspondingIndicator = formData.value.targetTypes[0].conditions[0].indicators.find(indicator => indicator.minValue === newIndexName);

    console.log("correspondingIndicator", correspondingIndicator);

    if (correspondingIndicator) {
      // 3. 将 indicator 的 minValue 和 maxValue 同步到 index 的 ranges 中
      console.log("correspondingIndex.ranges", correspondingIndex.ranges);
      correspondingIndex.ranges = correspondingIndicator.ranges.map(range => ({
        minValue: range.minValue,
        maxValue: range.maxValue,
      }));
      console.log("updated correspondingIndex.ranges", correspondingIndex.ranges);
    }
  }
};

// 裁决模型的下拉框数据
const modelOptions = ref([]);

// 获取裁决模型的列表
const getModels = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/judgeModel/pageList', {
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

const deleteButtonTop = ref(137);

// 添加毁伤等级
const addDamageLevel = () => {
  damageLevels.value.push({ name: '' });
  deleteButtonTop.value += 53;
};

// 删除毁伤等级
const removeDamageLevel = () => {
  if (damageLevels.value.length > 1) {
    damageLevels.value.pop();
    deleteButtonTop.value -= 53;
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
const removeCondition = (targetIndex, conditionIndex) => {
  // 确保条件组数组至少有一个元素时才能删除
  if (formData.value.targetTypes[targetIndex].conditions.length > 1) {
    // 删除指定索引的条件组
    formData.value.targetTypes[targetIndex].conditions.splice(conditionIndex, 1);
  }
};

// 添加一个新的指标到指定目标类型的 conditions 数组
const addIndex = (targetIndex, conditionIndex) => {
  const targetType = formData.value.targetTypes[targetIndex];
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

  // 检查条件是否存在，并且包含 indicators 数组
  if (condition && Array.isArray(condition.indicators)) {
    // 确保索引有效
    if (indicatorIndex >= 0 && indicatorIndex < condition.indicators.length) {
      // 删除指定的指标，并将后续元素前移
      condition.indicators.splice(indicatorIndex, 1);
    }
  }
};

// 范围
const ranges = ref([
  { minValue: '', maxValue: '', destroyLevel: '' }
]);

// 添加范围
const addRange = (targetIndex, indexItemIndex) => {
  const targetType = formData.value.targetTypes[targetIndex];
  console.log("targetType", targetType)
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

  // 动态添加对应的删除按钮
  if (!indexItem.deleteButtons) {
    indexItem.deleteButtons = [];
  }
  indexItem.deleteButtons.push({ marginTop: 53 * (indexItem.ranges.length - 1) });

  if (!indexItem.addButton) {
    indexItem.addButton = { marginTop: 0 }; // 初始化按钮的位置
  }
  indexItem.addButton.marginTop = 53 * (indexItem.ranges.length - 1);
};

// 删除最后一组范围
const removeRange = (targetIndex, indexItemIndex, rangeIndex = null) => {
  const targetType = formData.value.targetTypes[targetIndex];
  const indexItem = targetType.indexes[indexItemIndex];

  // 确保 ranges 数组存在且不为空
  if (indexItem.ranges && indexItem.ranges.length > 0) {
    if (rangeIndex === null) {
      // 删除最后一个范围
      indexItem.ranges.pop();
      indexItem.deleteButtons.pop();
    } else {
      // 删除指定索引的范围
      indexItem.ranges.splice(rangeIndex, 1);
      indexItem.deleteButtons.splice(rangeIndex, 1);
    }

    // 更新删除范围之后的按钮位置，保持删除之前的按钮不变
    for (let i = rangeIndex || 0; i < indexItem.deleteButtons.length; i++) {
      indexItem.deleteButtons[i].marginTop = 53 * (i+1); // 重新计算marginTop
    }

    if (indexItem.addButton) {
      indexItem.addButton.marginTop = 53 * (indexItem.ranges.length - 1); // 每次删除后，上移 53px
    }
  }
};


// 初始化一个数组来保存每组数据
const indicators = ref([]);

// 按钮位置的偏移量
const buttonOffset = ref(52);

// 添加范围组
const addRange1 = (index, conditionIndex, indicatorIndex) => {
  console.log("formData.value",formData.value)
  console.log("targetIndex",index)
  const targetType = formData.value.targetTypes[index];
  console.log("targetType",targetType)
  const condition = targetType.conditions[conditionIndex];
  console.log("condition",condition)
  const indicator = condition.indicators[indicatorIndex];
  console.log("indicator",indicator)

  // 确保每个 indicator 的 ranges 数组存在
  if (!indicator.ranges) {
    indicator.ranges = [];
  }

  const newRangeMarginTop = - 53 + indicator.ranges.length * 53;

  // 向指定 indicator 的 ranges 数组添加一个新的范围对象
  indicator.ranges.push({
    minValue: '',         // 最小值
    maxValue: '',         // 最大值
    impactFactor: '',     // 影响系数
    stop: false,           // 是否终止
    deleteButton: true,   // 标志是否显示删除按钮
    marginTop: newRangeMarginTop
  });

  // // 获取按钮 DOM 元素
  // const button = document.querySelector('.add-button4');
  //
  // // 获取当前的 margin-top 值并更新
  // let currentTop = parseInt(window.getComputedStyle(button).marginTop) || 0;
  // button.style.marginTop = (currentTop + 53) + 'px'; // 每次下移 20px

  buttonOffset.value += 53;

  // 确保 Vue 的响应式更新
  // formData.value = { ...formData.value };
};

// 删除指定范围
const removeRange1 = (index, conditionIndex, indicatorIndex, rangeIndex) => {
  const targetType = formData.value.targetTypes[index];
  const condition = targetType.conditions[conditionIndex];
  const indicator = condition.indicators[indicatorIndex];

  // 确保 ranges 数组存在且不为空
  if (indicator && Array.isArray(indicator.ranges)) {
    // 检查索引有效性
    if (rangeIndex >= 0 && rangeIndex < indicator.ranges.length) {
      // 删除指定索引的范围
      indicator.ranges.splice(rangeIndex, 1);

      // 更新所有后续范围的 marginTop
      for (let i = rangeIndex; i < indicator.ranges.length; i++) {
        // 更新后续元素的 marginTop，向上移动 53px
        indicator.ranges[i].marginTop -= 53;
      }

      // 更新删除按钮的 marginTop
      buttonOffset.value -= 53;
    }
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

const ruleId = ref(taskStore.ruleId);

// 监听 store 里的 ruleId 变化
watch(() => taskStore.ruleId, (newRuleId) => {
  ruleId.value = newRuleId; // 更新本地 ruleId
  console.log("监听到 ruleId 变化:", newRuleId);
});

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
    const response = await axios.post('http://localhost:3001/api/calRule/update', payload);
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
    console.log("fetchRuleData111111111111111111")
    const response = await fetch(`http://localhost:3001/api/calRule/view/${ruleId}`);
    const data = await response.json();
    console.log("ruledata",data)
    if (data.code === 0) {
      taskForm.value = data.data;  // 更新 taskForm 数据
      console.log("taskForm.value",taskForm.value)
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
  ruleId.value = taskStore.ruleId;
  console.log("mounted111111111111111111111111111111111111ruleId",ruleId.value)
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
  padding: 10px;
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
  align-items: center;
  gap: 50px;
  margin-bottom: 20px;
}

.form-row1 {
  display: flex;
  /*flex-direction: column;*/
  gap: 10px;
  margin-left: 23px;
  /*margin-top: 10px;*/
  margin-bottom: 10px;
}

.form-row1:first-child {
  margin-top:20px;
}

.form-row1:last-child {
  /*margin-top: 20px;*/
  margin-bottom: 40px;
}

/*.form-row1:first-child {*/
/*  margin-top: 80px;*/
/*}*/

/*.form-row1:not(:first-child) {*/
/*  margin-top: 20px;*/
/*}*/

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

.add-button, .add-button2, .add-button3, .add-button4, .add-button5, .example-button {
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

.add-button1 {
  width: 120px;
  height: 30px;
  margin-left: 20px;
  margin-top: 20px;
  border-radius: 4px;
  border: 1px solid #00E0FF;
  background-color: #062A51;
  color: #BDEEFF;
  text-align: center;
  font-family: "Source Han Sans CN";
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
}

.add-button2 {
  position: absolute;
  left: 180px;
  top: 80px;
}

.add-button3 {
  position: absolute;
  left: 180px;
  top: 60px;
  margin-top: 15px;
  /*bottom: 20px;*/
  /*top: calc(83% + 20px);*/
  /*margin-top: 20px;*/
}

.add-button4 {
  position: absolute;
  left: 790px;
  top: 80px;
  margin-top: 50px;
  margin-bottom: 20px;
}

.add-button5 {
  position: absolute;
  left: 25px;
  top: 130px;
}

.example-button {
  position: absolute;
  margin-left: 20px;
}

.target-type-definition {
  width: 168px;
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

.target-type-definition1 {
  width: 128px;
  height: 29px;
  margin-left: 32px;
  flex-shrink: 0;
  color: #F6F9FE;
  text-shadow: 0px 2px 8px rgba(5, 28, 55, 0.42), 0px 0px 7px rgba(75, 180, 229, 0.25);
  font-family: "Alibaba PuHuiTi";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
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
  left: 32px;
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

/* 图标容器 */
.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  /*position: absolute;*/
  position:relative;
  /*bottom: 15px;*/
  left: 273px;
}

/* 背景图 */
.image-167 {
  position: absolute;
  width: 10px;
  height: 10px;
}

.tooltip {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  color: black;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease-in-out;
}

.icon-container:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

/*自定义的输入框（下拉框）*/
.dropdown-menu {
  position: absolute;
  top: 50px;
  left: 28px;
  width: 237px;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 4px;
  border: 1px solid #00E0FF;
  background: #062A51;
  color: #F6F9FE;
  z-index: 1000;
  padding: 0;
  margin: 0;
  list-style: none;
}

.dropdown-menu li {
  padding: 8px 10px;
  cursor: pointer;
  font-size: 16px;
  font-family: "Source Han Sans CN";
  font-weight: 400;
  line-height: normal;
}

.dropdown-menu li:hover {
  background-color: rgba(0, 224, 255, 0.2);
}

.no-option {
  padding: 8px 10px;
  color: #f6f9fe;
  font-size: 14px;
  font-style: italic;
  text-align: center;
}

::v-deep .el-select {
  width: 237px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 4px;
  border: 1px solid #00e0ff;
  background: #062a51;
  color: #f6f9fe;
  padding: 0 10px;
  font-size: 16px;
  font-family: "Source Han Sans CN", sans-serif;
  font-weight: 400;
  line-height: normal;
  box-sizing: border-box;
  display: block;
}

::v-deep .el-select .el-input__inner {
  height: 32px;
  background: #062a51;
  color: #f6f9fe;
  padding: 0 10px;
  font-size: 16px;
  font-family: "Source Han Sans CN", sans-serif;
  font-weight: 400;
}

::v-deep .el-select-dropdown {
  background-color: #062a51;
  border: 1px solid #00e0ff;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}

::v-deep .el-select .el-option {
  color: #f6f9fe;
  background-color: #062a51;
}

::v-deep .el-select .el-option:hover {
  background-color: #00e0ff;
}

.condition-container {
  width: calc(100% - 64px);
  /*height: 118px;*/
  flex-shrink: 0;
  border-radius: 4px;
  border: 1px solid #4CA8F7;
  background: rgba(6, 42, 81, 0.10);
  margin-top:0px;
  margin-left: 32px;
  margin-right: 32px;
  /*margin-top: 20px;*/
  padding-bottom: 20px;
  position: relative;
  min-height: 120px;
}

.condition-container:last-child {
  margin-bottom: 80px;
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
  margin-left: 32px;
  margin-right: 32px;
  padding-bottom:20px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
}

.indicator-container:last-child {
  margin-bottom: 80px;
}

.range-button-container {
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
}

.index-container {
  width: calc(100% - 64px);
  /*height: 173px;*/
  flex-shrink: 0;
  border-radius: 4px;
  border: 1px solid #1FFFD7;
  background: rgba(6, 42, 81, 0.10);
  margin-left: 32px;
  margin-right: 32px;
  /*margin-top: 20px;*/
  padding-bottom: 20px;
  position: relative;
}

.index-container .input-container {
  width: 100%;
  border-bottom: 1px solid #1FFFD7;
  background: rgba(31, 255, 215, 0.30);
}

.delete-button, .delete-button1, .delete-button2, .delete-button3, .delete-button4 {
  width: 120px;
  height: 30px;
  flex-shrink: 0;
  background-color: rgba(255, 0, 0, 0.69);
  color: white;
  border: 1px solid #F56C6C;
  border-radius: 4px;
  font-family: "Source Han Sans CN";
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  line-height: normal;
  line-height: 32px;
  cursor: pointer;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete-button {
  position: absolute;
  right: 20px;
  top: 13px;
}

.delete-button1 {
  position: absulute;
  left: 505px;
  top: 187px;
}

.delete-button2 {
  position: absulute;
  left: 720px;
  top: 20px;
}

.delete-button3 {
  position: absulute;
  left: 1180px;
  top: 130px;
}

.delete-button4 {
  position: absulute;
  left: 1110px;
  top: 77px;
}

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

.dialog-footer .button:first-child {
  margin-left: 1300px;
}

.button:hover {
  background-color: #2391FF;
  color: white;
}
</style>