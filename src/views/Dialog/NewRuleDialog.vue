<template>
  <div v-if="isShow" class="task-modal-overlay">
    <div class="task-modal">
      <!-- Modal Header -->
      <div class="task-modal-header">
        <div class="task-modal-title">
          <img src="@/assets/images/icon-title.png" alt="Icon" class="task-modal-icon" />
          添加裁决规则
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
                <option value="model1">裁决模型 1</option>
                <option value="model2">裁决模型 2</option>
                <option value="model3">裁决模型 3</option>
              </select>
            </div>
            <div class="form-column">
              <label for="addTime">添加时间</label>
              <input type="text" id="addTime" v-model="formData.addTime" />
            </div>
          </div>

          <!-- 毁伤等级 -->
          <div v-for="(damageLevel, index) in damageLevels" :key="index" class="form-row">
            <div class="form-column">
              <label :for="'damageLevelName' + index">毁伤等级名称</label>
              <input type="text" :id="'damageLevelName' + index" v-model="damageLevel.name" />
            </div>
            <div class="form-column">
              <label :for="'damageLevelDef' + index">毁伤等级定义</label>
              <div class="input-with-button">
                <select :id="'damageLevelDef' + index" class="select-box" v-model="damageLevel.definition">
                  <option value="" disabled selected>轻微</option>
                  <option value="level1">未毁伤</option>
                  <option value="level2">严重毁伤</option>
                </select>
                <button v-if="index === damageLevels.length - 1" @click="addDamageLevel" class="add-button">添加毁伤等级</button>
                <button v-if="damageLevels.length > 1 && index === damageLevels.length - 1" @click="removeDamageLevel(index)" class="delete-button1">删除毁伤等级</button>
              </div>
            </div>
          </div>

          <!-- 目标类型定义 -->
          <div class="target-type-definition">目标类型定义</div>

          <!-- 目标类型容器 -->
          <div class="target-container">
            <div class="input-container">
              <input type="text" class="input-field" placeholder="默认目标类型"/>
            </div>

            <!-- 条件组和指标 -->
            <div v-for="(condition, index) in conditions" :key="index" class="condition-container">
              <div class="input-container">
                <input type="text" class="input-field" placeholder="条件组" v-model="condition.group" />
                <select class="select-box" v-model="condition.logic">
                  <option value="" disabled selected>AND</option>
                  <option value="condition1">OR</option>
                </select>
                <button class="delete-button" @click="removeCondition(index)">删除条件组</button>
              </div>
              <button class="add-button2" @click="addIndex(index)">添加指标</button>

              <div class="indicater-container" v-for="(indicator, indicatorIndex) in condition.indicators" :key="indicatorIndex">
                <!-- 第一行：指标名称和最大值 -->
                <div class="form-row1">
                  <div class="form-column1">
                    <label for="minValue1">指标名称</label>
                    <input type="text" v-model="indicator.minValue" style="margin-left:-6px;" />
                  </div>
                  <div class="form-column1">
                    <label for="maxValue1">最大值</label>
                    <select v-model="indicator.maxValue" class="select-box" style="margin-left:-2px;">
                      <option value="numeric" selected>数值型</option>
                      <option value="probability">概率型</option>
                    </select>
                  </div>
                  <button class="add-button4" @click="addRange1(index, indicatorIndex)">添加范围</button>
                  <button class="delete-button2" @click="removeIndicator(index, indicatorIndex)">删除指标</button>
                </div>

                <!-- 第二行：范围数据 -->
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
                    <div class="form-column1" style="width:100px;">
                      <label for="stop">终止判断</label>
                      <input type="radio" id="stop" v-model="range.stop" :value="true" style="height:15px; width:15px;" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- 添加条件组按钮 -->
            <button class="add-button3" @click="addCondition">添加条件组</button>
          </div>

          <!-- 范围 -->
          <div class="index-container">
            <div class="input-container">
              <input type="text" class="input-field" placeholder="指标名称" />
              <select class="select-box">
                <option value="" disabled selected>数值范围</option>
                <option value="index2">概率模型</option>
              </select>
            </div>

            <!-- 添加和删除范围 -->
            <button class="add-button2" @click="addRange">添加范围</button>
            <button class="delete-button" @click="removeRange">删除范围</button>

            <!-- 范围表单 -->
            <div v-for="(range, index) in ranges" :key="index" class="form-row1">
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
                <input type="text" id="destroyLevel" v-model="range.destroyLevel" />
              </div>
            </div>
          </div>
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
import { ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps({
  isShow: Boolean
});

const emit = defineEmits(['update:isShow', 'saveRuleData']);

// 表单数据
const formData = ref({
  ruleName: '',
  model: '',
  addTime: '',
  minValue: '',
  maxValue: '',
  destroyLevel: ''
});

// 毁伤等级
const damageLevels = ref([
  {
    name: '',
    definition: ''
  }
]);

// 添加一个新的毁伤等级
const addDamageLevel = () => {
  damageLevels.value.push({
    name: '',
    definition: ''
  });
};

// 删除指定的毁伤等级
const removeDamageLevel = (index) => {
  damageLevels.value.splice(index, 1);
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
const addCondition = () => {
  conditions.value.push({
    group: '',
    logic: '',
    indicators: []
  });
};

// 删除指定索引的条件组
const removeCondition = (index) => {
  conditions.value.splice(index, 1);
};

// 添加指标到条件组
const addIndex = (index) => {
  // 给指定条件组（condition）添加一个新的指标（indicator）
  conditions.value[index].indicators.push({
    minValue: '',
    maxValue: 'numeric', // 默认值
    impactFactor: '',
    stop:''
  });
};

// 删除指标
const removeIndicator = (conditionIndex, indicatorIndex) => {
  conditions.value[conditionIndex].indicators.splice(indicatorIndex, 1);
};

// 范围
const ranges = ref([
  { minValue: '', maxValue: '', destroyLevel: '' }
]);

// 添加范围
const addRange = () => {
  ranges.value.push({ minValue: '', maxValue: '', destroyLevel: '' });
};

// 删除最后一组范围
const removeRange = () => {
  if (ranges.value.length > 1) {
    ranges.value.pop();
  }
};

// 初始化一个数组来保存每组数据
const indicators = ref([]);

// 添加一组数据
const addRange1 = (conditionIndex, indicatorIndex) => {
  // 添加一个新的数据行到指定的条件组和指标组中
  conditions.value[conditionIndex].indicators[indicatorIndex].ranges = [
    ...conditions.value[conditionIndex].indicators[indicatorIndex].ranges || [],
    {
      minValue: '',
      maxValue: '',
      impactFactor: '',
      stop:''
    }
  ];
};

// 保存规则数据
const saveRuleData = async () => {
  // 转换成后端要求的格式
  const payload = {
    rule: {
      ruleName: formData.value.ruleName,
      modelId: 2, // 假设 model 是字符串，可能需要转换为数字
      damageLevels: damageLevels.value.map(level => ({
        name: level.name
      })),
      targetTypes: [
        {
          targetType: '电子干扰',  // 假设目标类型是固定的“电子干扰”
          groups: conditions.value.map(condition => ({
            groupName: condition.group,
            operator: condition.logic,
            indicators: condition.indicators.map(indicator => ({
              indicatorName: indicator.minValue,  // 假设这里的 minValue 代表指标名称
              dataType: indicator.maxValue,  // 假设 maxValue 代表数据类型
              ranges: indicator.ranges ? indicator.ranges.map(range => ({
                minValue: range.minValue,
                maxValue: range.maxValue,
                weight: range.impactFactor,  // 假设 impactFactor 是权重
                isTerminal: range.stop  // 假设 stop 代表是否终止判断
              })) : []
            }))
          })),
          finalIndicator: {
            indicatorName: '综合评分',  // 假设这是固定的
            dataType: 'NUMBER',  // 假设这是固定的
            ranges: [
              { minValue: 0, maxValue: 60, damageLevel: '未毁伤' },
              { minValue: 60, maxValue: 100, damageLevel: '毁伤' }
            ]
          }
        }
      ]
    }
  };

  try {
    // 发送POST请求
    const response = await axios.post('http://192.168.1.200:3001/api/calRule/add', payload);
    console.log('Response:', response.data);
    emit('update:isShow', false); // 关闭对话框
  } catch (error) {
    console.error('Error saving rule:', error);
  }
};

// 关闭对话框
const closeDialog = () => {
  emit('update:isShow', false);
};
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

.add-button, .add-button2, .add-button3, .add-button4 {
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
  left: 1190px;
  top: 14px;
}

.add-button3 {
  position: absolute;
  left: 300px;
  margin-top: 15px;
  /*bottom: 20px;*/
  /*top: calc(83% + 20px);*/
  /*margin-top: 20px;*/
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

.delete-button, .delete-button1, .delete-button2 {
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

.delete-button {
  right: 20px;
  top: 13px;
}

.delete-button1 {
  left: 1055px;
  top: 190px;
}

.delete-button2 {
  left: 800px;
  top: 80px;
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

.button:hover {
  background-color: #2391FF;
  color: white;
}
</style>