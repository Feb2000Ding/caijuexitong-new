<template>
  <!-- 模态框覆盖层，当 isShow 为 true 时显示 -->
  <div v-if="isShow" class="task-modal-overlay" :class="{'blurred': isShowRuleExamplePanel}">
    <div class="task-modal">
      <!-- 头部区域 -->
      <div class="task-modal-header">
        <div class="task-modal-title">
          <img src="@/assets/images/icon-title.png" alt="Icon" class="task-modal-icon" />
          添加裁决模型
        </div>
        <button @click="closeDialog" class="close-button">X</button>
      </div>

      <!-- 主体部分 -->
      <div class="task-modal-body">
        <div class="form-container">

          <!-- 模型名称、裁决模型、添加时间 -->
          <div class="form-row">
            <!-- 模型名称 -->
            <div class="form-column">
              <label for="modelName">模型名称</label>
              <input type="text" id="modelName" v-model="formData.modelName" style="height:32px; width: 237px"/>
            </div>

            <!-- 裁决模型选择 -->
            <div class="form-column">
              <label for="modelType">裁决模型</label>
              <select id="modelType" class="select-box" v-model="formData.modelType" style="margin-left: -3px;">
                <option value="" selected disabled>请选择裁决模型</option>
                <option v-for="model in modelOptions" :key="model.modelId" :value="model.modelId">{{ model.modelName }}</option>
              </select>
            </div>

            <!-- 添加时间 -->
            <div class="form-column">
              <label for="addTime">添加时间</label>
              <input type="text" id="addTime" v-model="formData.addTime" style="height:32px; width: 237px"/>
            </div>
          </div>

          <!-- 输入参数容器 (默认只渲染一个) -->
          <div class="target-container">
            <!-- 目标类型输入框和添加目标类型按钮 -->
            <div class="input-container">
              <div class="target-type-definition2" style="margin-top:-4px;margin-left:32px;">
                输入参数
              </div>
            </div>

            <!-- 目标类型输入框 -->
            <div v-for="(target, index) in formData.inputParam" :key="index" style="display: flex; align-items: center; margin-top: 20px;">
              <label style="color:white; font-size: 20px; font-style: normal; font-weight: 400; line-height: normal; margin-left:40px;">
                目标类型
              </label>
              <input type="text"
                     v-model="target.targetType"
                     placeholder="默认目标类型"
                     class="input-field"
                     style="width:237px; height:32px; margin-top:85px; margin-left:120px;" />

              <!-- 输入框 -->
              <input type="text"
                     v-model="target.targetType"
                     placeholder="默认目标类型"
                     class="input-field"
                     style="width:237px; height:32px; margin-top:85px; margin-left:120px;" />

              <!-- 添加目标按钮 (仅在最后一个目标框时显示) -->
<!--              <button v-if="index === formData.inputParam.length - 1" @click="addTarget" class="add-button" style="margin-top:0; margin-left:300px;">-->
<!--                添加目标-->
<!--              </button>-->

              <!-- 删除目标按钮 (仅在有多个目标时显示) -->
              <button v-if="formData.inputParam.length > 1 && index === formData.inputParam.length - 1" @click="deleteTarget(index)" class="delete-button" :style="{ marginTop: deleteButtonTop + 'px' }" style="margin-top:135px; margin-left:10px;">
                删除目标
              </button>
            </div>

            <!-- 输入参数 1 输入框 -->
            <div class="condition-container">
              <div class="input-container">
                <label style="color:white; font-size: 20px; font-style: normal; font-weight: 700; line-height: normal; margin-left:32px;">参数结果</label>
                <button class="example-button" @click="openExamplePanel" style="margin-left:140px;">保存参数</button>
              </div>

              <!-- 条件参数输入框和删除参数按钮 -->
              <div style="display: flex; align-items: center; margin-top: 20px;">
                <label style="color:white; font-size: 20px; font-style: normal; font-weight: 400; line-height: normal; margin-left:40px;">输入参数</label>
                <input type="text"
                       v-model="formData.inputParam1"
                       placeholder="xxxxxx"
                       class="input-field"
                       style="width:237px; height:32px;margin-top:63px; margin-left:120px;" />
                <input type="text"
                       v-model="formData.inputParam2"
                       placeholder="xx,xx,xx"
                       class="input-field"
                       style="width:237px; height:32px;margin-top:63px; margin-left:400px;" />
                <button class="delete-button" style="margin-top:60px;margin-left:100px;">删除参数</button>
              </div>
            </div>

            <!-- 下载框架按钮 -->
            <button class="add-button" style="margin-left:35px;" @click="downloadFramework">下载框架</button>

            <!-- 最终指标部分 -->
            <div class="index-container">
              <div class="input-container">
                <div class="target-type-definition2" style="margin-top:-4px;margin-left:32px;">
                  上传文件
                </div>
              </div>

              <div >
                <div class="form-row1" style="margin-top:20px; display: flex;">
                  <!-- 模型名称选择 -->
                  <div class="form-column1">
                    <label for="maxValue">选择模型</label>
                    <select id="maxValue" v-model="formData.modelName1" class="select-box" style="height:32px; width:237px; margin-left:-2px;">
                      <option value="" selected disabled>请选择裁决模型</option>
                      <option v-for="model in modelOptions" :key="model.modelId" :value="model.modelId">{{ model.modelName }}</option>
                    </select>
                  </div>

                  <!-- 模型类型选择 -->
                  <div class="form-column1">
                    <label for="destroyLevel">模型类型</label>
                    <select id="destroyLevel" v-model="formData.modelType1" class="select-box" style="height:32px; width:237px; margin-left:-2px;">
                      <option value="" selected disabled>请选择模型类型</option>
                      <option v-for="model in modelOptions" :key="model.modelId" :value="model.modelId">{{ model.modelName }}</option>
                    </select>
                  </div>

                  <input type="file" id="fileUpload" style="display:none" @change="handleFileUpload" />
                  <button class="add-button" style="margin-left:35px;" @click="triggerFileInput">上传文件</button>


                </div>
                <div v-if="uploadedFileName" class="form-row1" style="margin-top: 10px; display: flex; flex-direction: column;">
                  <div class="target-type-definition3" style="min-width:500px;">
                    已上传: {{ uploadedFileName }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 输出参数容器 (默认只渲染一个) -->
          <div class="target-container">
            <!-- 目标类型输入框和添加目标类型按钮 -->
            <div class="input-container">
              <div class="target-type-definition2" style="margin-top:-4px;margin-left:32px;">
                输出参数
                <button class="example-button" @click="addOutputParam">添加输出参数</button>
              </div>
            </div>

            <!-- 条件参数输入框和删除参数按钮 -->
            <div v-for="(param, index) in formData.outputParam" :key="index" style="display: flex; align-items: center; margin-top: 20px;">
              <label style="color:white; font-size: 20px; font-style: normal; font-weight: 400; line-height: normal; margin-left:40px;">输出参数</label>

              <!-- 输入框 -->
              <input type="text" v-model="param.outputParam1" class="input-field" style="width:237px; height:32px;margin-top:80px; margin-left:120px;" />
              <input type="text" v-model="param.outputParam2" class="input-field" style="width:237px; height:32px;margin-top:80px; margin-left:400px;" />

              <!-- 删除按钮 -->
              <button v-if="formData.outputParam.length > 1" @click="deleteOutputParam(index)" class="delete-button" style="margin-top:60px;margin-left:100px;">删除参数</button>
            </div>
          </div>

          <!-- 方法名容器 (默认只渲染一个) -->
          <div class="target-container">
            <!-- 目标类型输入框和添加目标类型按钮 -->
            <div class="input-container">
              <div class="target-type-definition2" style="margin-top:-4px;margin-left:32px;">
                方法名
                <button class="example-button" @click="addMethodName">添加方法名</button>
              </div>
            </div>

            <!-- 条件参数输入框和删除参数按钮 -->
            <div v-for="(method, index) in formData.methods" :key="index" style="display: flex; align-items: center; margin-top: 20px;">
              <label style="color:white; font-size: 20px; font-style: normal; font-weight: 400; line-height: normal; margin-left:40px;">方法名</label>

              <!-- 输入框 -->
              <input type="text" v-model="method.method1" class="input-field" style="width:237px; height:32px;margin-top:80px; margin-left:120px;" />

              <!-- 删除按钮 -->
              <button v-if="formData.methods.length > 1" @click="deleteMethod(index)" class="delete-button" style="margin-top:60px;margin-left:100px;">删除方法名</button>
            </div>
          </div>

        </div>
      </div>
      <div class="dialog-footer">
        <button class="button" @click="saveModelData" style="margin-top:20px">保存参数</button>
        <button class="button" @click="closeDialog" style="margin-top:20px">返回</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, defineProps, defineEmits, onMounted, watch} from 'vue';
import axios from "axios";

const props = defineProps({
  isShow: Boolean,
  modelForm: Object,
});
const emit = defineEmits(['update:isShow', 'showModelDialog']);

// 表单数据
const formData = ref({
  modelName: '',
  modelType: '',
  addTime: '',
  inputParam: [
    { inputParam1: '', inputParam2: '', targetType:'', modelName1:'', modelType1:''  },
  ],
  outputParam: [
    { outputParam1: '', outputParam2:'' },
  ],
  methods: [
    { method1: '', },
  ]
});

// 监听 isShow 变化，isShow 为 true 时自动设置当前时间
watch(() => props.isShow, (newVal) => {
  if (newVal) {
    setCurrentTime();
  }
});

// 设置当前时间的方法
function setCurrentTime() {
  const currentDate = new Date();
  const formattedTime = currentDate.toISOString().slice(0, 19).replace('T', ' '); // 格式：yyyy-MM-dd HH:mm:ss
  formData.value.addTime = formattedTime;
}

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

const deleteButtonTop = ref(0);  // 用来动态调整删除按钮的位置

const addTarget = () => {
  // 每次添加一个新的目标类型输入框
  formData.value.inputParam.push({ targetType: '' });

  // 调整删除按钮位置
  deleteButtonTop.value += 60;  // 每次添加一个新目标框，删除按钮向下移动
};

const deleteTarget = (index) => {
  // 删除指定索引的目标类型输入框
  if (formData.value.inputParam.length > 1) {
    formData.value.inputParam.splice(index, 1);

    // 调整删除按钮位置
    deleteButtonTop.value -= 53;  // 每次删除一个目标框，删除按钮向上移动
  }
};

// 添加输出参数
const addOutputParam = () => {
  formData.value.outputParam.push({ outputParam1: '', outputParam2: '' });
};

// 删除输出参数
const deleteOutputParam = (index) => {
  if (formData.value.outputParam.length > 1) {
    formData.value.outputParam.splice(index, 1);
  }
};

// 添加方法名
const addMethodName = () => {
  formData.value.methods.push({ method1: '' });
};

// 删除方法名
const deleteMethod = (index) => {
  if (formData.value.methods.length > 1) {
    formData.value.methods.splice(index, 1);
  }
};

const downloadFramework = async () => {
  console.log("下载");
  try {
    const response = await axios.get('http://192.168.43.234:3001/api/judgeModel/downloadFramework', {
      params: {
        modelName: formData.value.modelName,
        token: '', // 根据需要填入 token
      },
      responseType: 'blob',
    });

    // 确保请求成功后打印日志
    console.log("下载中");

    // 创建 Blob 对象并开始下载
    const blob = new Blob([response.data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'downloaded-file');  // 设置下载的文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    // 打印详细的错误信息
    console.error('下载文件失败:', error.response ? error.response.data : error.message);
  }
};

// 处理文件上传
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input?.files?.[0]; // 获取选择的第一个文件
  if (file) {
    // 将文件名保存到 uploadedFileName 中
    uploadedFileName.value = file.name;

    // 调用上传文件方法
    await uploadFile(file);
  }
};

// 上传文件至后端接口
const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('modelName', '测试模型');
    formData.append('token', '');

    // 发送 POST 请求上传文件
    const response = await axios.post('http://192.168.43.234:3001/api/judgeModel/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.code === 0) {
      console.log('文件上传成功');
    } else {
      console.error('文件上传失败', response.data.message);
    }
  } catch (error) {
    console.error('文件上传请求失败:', error);
  }
};

// ref变量保存上传的文件名
const uploadedFileName = ref<string | null>(null);

// 触发文件选择框的点击事件
const triggerFileInput = () => {
  console.log('1111111111111111111111111111111111')
  const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
  fileInput?.click();  // 触发文件选择框
};

// 提交表单数据
const saveModelData = async () => {
  try {
    const requestData = {
      modelName: formData.value.modelName,
      modelType: formData.value.modelType, // 模型类型
      inputParam: formData.value.inputParam.reduce((acc, param) => {
        // 使用 reduce 构建一个对象形式的 inputParam
        acc[param.targetType] = {
          indicator: param.indicator || [], // 如果没有 indicator，默认为空数组
        };
        return acc;
      }, {}),
      outputParam: formData.value.outputParam,
      method: [formData.value.method1] // 方法数组
    };

    console.log('请求体:', requestData);

    const response = await axios.post('http://192.168.43.234:3001/api/judgeModel/add', requestData);

    if (response.status === 200) {
      closeDialog();  // 关闭模态框
    } else {

    }
  } catch (error) {
    console.error(error);
  }
};

const closeDialog = () => {
  emit('update:isShow', false);
  emit('showModelDialog');
};

const saveModel = async () => {
  // 整理请求体
  const requestBody = {
    modelName: formData.value.modelName,
    modelType: formData.value.modelType,
    inputParam: formData.value.inputParam.map(item => ({
      targetType: item.targetType.split(',').map(type => type.trim()), // 假设输入的目标类型是逗号分隔
      modelType: item.modelType,
      side: item.side.split(',').map(side => side.trim()), // 假设输入的阵营是逗号分隔
    })),
    outputParam: {
      indicator: [
        ...formData.value.outputParam[0].outputParam1.split(',').map(indicator => indicator.trim()),
        ...formData.value.outputParam[0].outputParam2.split(',').map(indicator => indicator.trim())
      ]
    },
    methodName: formData.value.methods.map(item => item.method1),
  };

  console.log('整理后的请求体:', requestBody);

  // 发送 POST 请求
  try {
    const response = await axios.post('http://192.168.43.234:3001/api/judgeModel/add', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('服务器响应:', response.data);
    // closeDialog();
  } catch (error) {
    console.error('请求失败:', error);

  }
};

onMounted(() => {
  getModels();
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

.blurred {
  backdrop-filter: blur(10px);  /* 高斯模糊效果 */
}

.task-modal-overlay::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: -1;
}

.task-modal-overlay > .rule-example-panel {
  position: relative;
  z-index: 1;
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
  width: 0px;
}

.task-modal-body::-webkit-scrollbar-thumb {
  background: transparent;
}

.task-modal-body::-webkit-scrollbar-track {
  background: transparent;
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

.target-type-definition2 {
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

.target-type-definition3 {
  width: 168px;
  height: 29px;
  margin-left: 45px;
  flex-shrink: 0;
  color: #F6F9FE;
  text-shadow: 0px 2px 8px rgba(5, 28, 55, 0.42), 0px 0px 7px rgba(75, 180, 229, 0.25);
  font-family: "Alibaba PuHuiTi";
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
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