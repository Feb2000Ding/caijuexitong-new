<template>
  <!-- 裁决任务管理弹窗-->
  <div v-if="isShow" class="task-modal-overlay">
    <modelExamplePanel v-if="exampleDialogVisible" @close="closeExamplePanel" />
    <div class="task-modal">
      <!--头部-->
      <div class="task-modal-header">
        <div class="task-modal-title">
          <img src="@/assets/images/icon-title.png" alt="Icon" class="task-modal-icon">
          裁决模型数据管理
        </div>
        <button @click="closeModal">X</button>
      </div>
      <!--主体-->
      <div class="task-modal-body">
        <!--按钮组-->
        <div class="button-group">
          <button class="button" style="margin-left: 10px;" @click="addModel">添加模型</button>
          <!--          <input class="input-search" placeholder="Try typing new..." />-->
          <!--          <button class="button" style="margin-right:20px">搜索</button>-->
          <button class="button" style="margin-right: 20px; background-color: #C33333" @click="deleteModel">删除</button>
        </div>
        <!--添加任务的弹窗-->
        <div v-if="dialogVisible" class="custom-dialog-overlay">
          <div class="custom-dialog">
            <div class="dialog-header">
              <span class="header-title">添加裁决模型</span>
              <button class="close-button" @click="dialogVisible = false">X</button>
            </div>
            <div class="dialog-content">
              <div class="dialog-column">
                <div class="form-row">
                  <label for="targetType" class="input-label">*目标类型</label>
                  <input
                      type="text"
                      id="targetType"
                      class="input-field"
                      placeholder="请输入目标类型"
                      v-model="modelForm.targetType"
                  />
                </div>

                <div class="form-row">
                  <label for="indicator" class="input-label">*指标组</label>
                  <input
                      type="text"
                      id="indicator"
                      class="input-field"
                      placeholder="请输入指标组"
                      v-model="modelForm.indicator"
                  />
                </div>

                <div class="form-row">
                  <label for="conditionGroup" class="input-label">*条件组</label>
                  <input
                      type="text"
                      id="conditionGroup"
                      class="input-field"
                      placeholder="请输入条件组"
                      v-model="modelForm.conditionGroup"
                  />
                </div>

                <div class="form-row">
                  <label for="side" class="input-label">*裁决方</label>
                  <input
                      type="text"
                      id="side"
                      class="input-field"
                      placeholder="请输入裁决方"
                      v-model="modelForm.side"
                  />
                </div>
                <button class="download-file-btn" @click="uploadParameters">上传参数</button>

              </div>
              <div class="dialog-column">
                <button class="download-file-btn" @click="downloadFile">下载文件</button>
                <button class="add-file-btn" @click="triggerFileInput">上传文件</button>
                <input type="file" id="fileUpload" class="file-input" @change="handleFileUpload" style="display: none" />

                <!--                <div class="upload-panel">-->
                <!--                  <div class="icon-container">-->
                <!--                    <el-icon class="upload-icon">-->
                <!--                      <i class="el-icon-cloudy"></i>-->
                <!--                    </el-icon>-->
                <!--                  </div>-->
                <!--                  <p class="upload-text">-->
                <!--                    将文件拖到此处，或 <span class="upload-link" @click="triggerFileInput">点击添加</span>-->
                <!--                  </p>-->
                <!--                  &lt;!&ndash; 上传的文件名 &ndash;&gt;-->
                <!--                  <p v-if="uploadedFileName" class="uploaded-file-name">{{ uploadedFileName }}</p>-->
                <!--                  <input type="file" id="fileUpload" class="file-input" @change="handleFileUpload" />-->
                <!--                </div>-->
                <div class="form-row">
                  <label for="modelName" class="input-label">*模型名称</label>
                  <input type="text" id="modelName" class="input-field" v-model="modelForm.modelName" placeholder="请输入模型名称" />
<!--                  <select v-model="modelForm.modelName" id="modelName" class="input-field">-->
<!--                    <option value="" disabled selected>请选择一个模型</option>-->
<!--                    <option v-for="model in models" :key="model.id" :value="model.modelName">-->
<!--                      {{ model.modelName }}-->
<!--                    </option>-->
<!--                  </select>-->
                  <!--                  <input v-model="modelForm.modelName" type="text" id="modelName" class="input-field" placeholder="xxxx模型" />-->
                </div>
                <div class="form-row">
                  <label for="modelType" class="input-label">*模型类型</label>
                  <select v-model="modelForm.modelType" id="modelType" class="input-field">
                    <option value="定向能模型" selected>定向能模型</option>
                    <option value="动能模型">动能模型</option>
                  </select>
                </div>
                <!-- 创建时间（只读且默认显示当前时间）-->
                <!--                <div class="form-row">-->
                <!--                  <label for="createTime" class="input-label">*创建时间</label>-->
                <!--                  <input v-model="modelForm.createTime" type="text" id="createTime" class="input-field" :placeholder="currentDate" readonly />-->
                <!--                </div>-->
              </div>
<!--              <div class="dialog-column">-->
<!--                <div class="form-row">-->
<!--                  <label for="input1" class="input-label" style="margin-top: -100px;">*输入参数:</label>-->
<!--                  <textarea v-model="modelForm.inputParameter" id="input1" class="input-field" style="min-height:200px; overflow-y: auto;" readonly></textarea>-->
<!--                </div>-->
<!--                <div class="form-row">-->
<!--                  <label for="input2" class="input-label" style="margin-top: -100px;">*输出参数:</label>-->
<!--                  <textarea v-model="modelForm.outputParameter" id="input2" class="input-field" style="min-height:200px; overflow-y: auto;" readonly></textarea>-->
<!--                </div>-->
<!--              </div>-->
            </div>
            <div class="dialog-footer">
              <!--              <button class="button"@click="dialogVisible = false">取消</button>-->
              <button class="button" @click="openExamplePanel">查看示例</button>
              <button class="button" @click="submitTask">确认</button>
            </div>
          </div>
        </div>
        <!--el-table-->
        <div class="table-container">
          <el-table
              :data="paginatedData"
              class="custom-table"
              :head-cell-style="{ height: '80px', lineHeight: '80px' }"
              :row-style="{ height: '55px' }"
              ref="multipleTableRef"
              @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="80" />
            <el-table-column prop="modelName" label="模型名称" width="240" />
            <el-table-column prop="modelType" label="模型类型" width="240" />
            <el-table-column prop="createTime" label="创建时间" width="300" />
            <el-table-column prop="parameter" label="参数" width="662" />
          </el-table>
        </div>

        <!-- 小型分页 -->
        <div class="custom-pagination">
          <el-button
              size="small"
              :disabled="currentPage <= 1"
              @click="handlePageChange(currentPage - 1)"
              class="pagination-button"
              @mouseover="hoverPage = 'prev'"
              @mouseleave="hoverPage = null"
          >
            上一页
          </el-button>
          <el-button
              v-for="page in totalPages"
              :key="page"
              size="small"
              :type="currentPage === page ? 'primary' : ''"
              :class="[currentPage === page ? 'active-page' : '', hoverPage === page && currentPage !== page ? 'hover-page' : '', 'pagination-number-button']"
              @click="handlePageChange(page)"
              @mouseover="hoverPage = page"
              @mouseleave="hoverPage = null"
          >
            {{ page }}
          </el-button>
          <el-button
              size="small"
              :disabled="currentPage >= totalPages"
              @click="handlePageChange(currentPage + 1)"
              class="pagination-button"
              @mouseover="hoverPage = 'next'"
              @mouseleave="hoverPage = null"
          >
            下一页
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, ref, onMounted, computed} from 'vue';
import  { ElTable, ElTableColumn, ElPagination, ElButton, ElIcon  } from 'element-plus';
import axios from "axios";
import 'element-plus/theme-chalk/el-icon.css';
import ModelExamplePanel from './ModelExamplePanel.vue';

const exampleDialogVisible = ref(false); // 控制是否显示弹窗
const openExamplePanel = () => {
  exampleDialogVisible.value = true;
};

const closeExamplePanel = () => {
  exampleDialogVisible.value = false;
};

const props = defineProps({
  isShow: Boolean
});

const emit = defineEmits(['update:isShow', 'showNewModelDialog']);

const closeModal = () => {
  emit('update:isShow', false);
};

// 模拟表格数据
let tableData = ref([
  // {
  //   id: 1,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 2,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 3,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 4,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 5,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 6,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 7,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 8,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 9,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 10,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 11,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 12,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 13,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 14,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 15,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 16,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 17,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 18,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 19,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
  // {
  //   id: 20,
  //   modelName: 'xxxxxx方案2',
  //   createTime: '24-05-02 11:00',
  //   modelType: '雷达反制',
  //   parameter: '规则2',
  // },
]);

// 存储模型数据
const models = ref<Model[]>([]);

// 分页查询方法
const fetchTableData = async (
    modelName = "",
    modelType = "",
    current = 0,
    pageSize = 100,
    sortField = "",
    sortOrder = ""
) => {
  try {
    console.log("正在请求数据...");

    // 发起请求，修改请求体结构
    const response = await axios.post("http://localhost:3001/api/judgeModel/pageList", {
      current,
      pageSize,
      sortField,
      sortOrder,
      modelName,
      modelType
    });

    // 检查返回的响应
    if (response.data.code === 0) {
      const newData = response.data.data.records;
      console.log("请求到的新数据:", newData);

      // 清空现有数据，重新填充 tableData
      tableData.value = [];

      // 遍历返回的数据并更新 tableData
      newData.forEach((record) => {
        const inputFormatted = formatParameters(record.input); // 格式化 input
        const outputFormatted = formatParameters(record.output); // 格式化 output

        tableData.value.push({
          id: record.modelId || '',
          modelName: record.modelName || '',  // 模型名称
          createTime: record.createTime || '', // 创建时间
          modelType: record.modelName || '', // 模型类型名称
          remark: record.remark || '', // 备注
          indicators: record.indicators || '', // 指标
          apiId: record.apiId || '', // API ID
          fileName: record.fileName || '', // 文件名
          fileContent: record.fileContent || '', // 文件内容
          actions: '编辑',  // 默认动作
          parameter: `${inputFormatted}\n${outputFormatted}`,  // 格式化后的参数
        });
      });

      console.log("更新后的表格数据:", tableData.value);

      // 存储模型数据
      models.value = newData.map((record) => ({
        modelId: record.modelId,
        modelName: record.modelName || '',
      }));

    } else {
      console.error("请求数据失败: ", response.data.message);
    }

  } catch (err) {
    console.error("请求数据失败:", err);
  }
};

// 格式化参数
const formatParameters = (parameters) => {
  if (!parameters) return '';

  let formatted = '';

  // 遍历 input 和 output 对象，构建字符串
  for (const [key, value] of Object.entries(parameters)) {
    if (Array.isArray(value)) {
      formatted += `${key}: [${value.join(', ')}]\n`;
    } else if (typeof value === 'object') {
      formatted += `${key}: ${JSON.stringify(value)}\n`;
    } else {
      formatted += `${key}: ${value}\n`;
    }
  }

  return formatted.trim();
};

// 当前页数和每页显示的数据量
const currentPage = ref(1);
const pageSize = ref(10);

// 计算分页
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

const totalItems = computed(() => tableData.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const hoverPage = ref(null);

// 处理分页变化
const handlePageChange = (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return; // 防止越界
  currentPage.value = newPage;
};

// 控制添加任务的对话框
const dialogVisible = ref(false);

const modelForm = ref({
  id: null,
  modelName: '',
  modelType: null,
  createTime: '',
  inputParameter: {
    targetType: '',
    indicator:'',
    modelType: null,
    conditionGroup: '',
    side: ''
  },
  outputParameter: {
    damageLevel: ''
  },
  targetType:'',
  indicator:'',
  conditionGroup:'',
  side:''
});

// // ref变量保存上传的文件名
// const uploadedFileName = ref<string | null>(null);
//
// const uploadParameters = async () => {
//   try {
//     const requestData = {
//       modelName: "测试模型7",
//       modelType: "动能模型",
//       input: {
//         targetType: [modelForm.value.targetType],
//         indicator: [modelForm.value.indicator],
//         conditionGroup: [modelForm.value.conditionGroup],
//         side: [modelForm.value.side]
//       },
//       output: "damageLevel"  // 假设是固定值，可以根据实际情况调整
//     };
//
//     const response = await axios.post('http://192.168.43.234:3001/api/judgeModel/add', requestData);
//
//     // 处理响应
//     console.log('上传成功:', response.data);
//   } catch (error) {
//     console.error('上传失败:', error);
//   }
// };
//
// // 下载文件
// const downloadFile = async () => {
//   try {
//     const response = await axios.get('http://192.168.43.234:3001/api/judgeModel/downloadFramework', {
//       params: {
//         token: '',
//         name: name,
//       },
//       responseType: 'blob',
//     });
//
//     const blob = new Blob([response.data], { type: 'application/octet-stream' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', name);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error('下载文件失败:', error);
//
//   }
// };
//
// // 触发文件选择框的点击事件
// const triggerFileInput = () => {
//   const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
//   fileInput?.click();  // 触发文件选择框
// };
//
// // 处理文件上传
// const handleFileUpload = async (event: Event) => {
//   const input = event.target as HTMLInputElement;
//   const file = input?.files?.[0]; // 获取选择的第一个文件
//   if (file) {
//     // 将文件名保存到 uploadedFileName 中
//     uploadedFileName.value = file.name;
//
//     // 调用上传文件方法
//     await uploadFile(file);
//   }
// };
//
// // 上传文件至后端接口
// const uploadFile = async (file: File) => {
//   try {
//     const formData = new FormData();
//     formData.append('file', file);  // 将文件添加到 FormData 对象
//     formData.append('modelName', '测试模型');  // 你可以根据需求设置动态模型名称
//     formData.append('token', 'your_token_here');  // 替换为实际的 token
//
//     // 发送 POST 请求上传文件
//     const response = await axios.post('http://192.168.43.234:3001/api/judgeModel/upload', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data', // 必须指定Content-Type为multipart/form-data
//       },
//     });
//
//     // 处理响应
//     if (response.data.code === 0) {
//       console.log('文件上传成功');
//       // 这里可以进行成功后的处理，如显示提示信息
//     } else {
//       console.error('文件上传失败', response.data.message);
//       // 处理上传失败的情况
//     }
//   } catch (error) {
//     console.error('文件上传请求失败:', error);
//     // 处理网络错误等情况
//   }
// };
//
// // 格式化接口返回的 input 数据
// const formatInputData = (inputData: any) => {
//   console.log("inputData", inputData);
//   let formattedString = '';
//
//   for (const [key, value] of Object.entries(inputData)) {
//     if (Array.isArray(value)) {
//       formattedString += `${key}: ${value.join(', ')}\n`; // 如果是数组，使用逗号连接
//     } else {
//       formattedString += `${key}: ${value}\n`; // 否则直接显示字段值
//     }
//   }
//
//   console.log("formattedString.trim()", formattedString.trim());
//   // 确保字符串末尾没有额外的换行符
//   return formattedString.trim();
// };
//
// // 格式化接口返回的 output 数据
// const formatOutputData = (outputData: any) => {
//   let formattedString = '';
//
//   for (const [key, value] of Object.entries(outputData)) {
//     if (Array.isArray(value)) {
//       formattedString += `${key}: ${value.join(', ')}\n`; // 如果是数组，使用逗号连接
//     } else {
//       formattedString += `${key}: ${value}\n`; // 否则直接显示字段值
//     }
//   }
//
//   return formattedString.trim();
// };

// // 文件上传处理
// const uploadFile = async (file: File) => {
//   try {
//     const formData = new FormData();
//     formData.append('file', file);
//
//     // 发送文件上传请求
//     const response = await axios.post('http://192.168.43.234:3001/api/judgeModel/parse', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       }
//     });
//
//     console.log('文件上传成功', response.data);
//
//     // 从接口响应中提取 input 和 output 参数并格式化
//     if (response.data && response.data.data) {
//       const inputData = response.data.data.input;
//       const outputData = response.data.data.output;
//
//       // 格式化 input 和 output 参数并赋值给输入框
//       modelForm.value.inputParameter = formatInputData(inputData);
//       modelForm.value.outputParameter = formatOutputData(outputData);
//     }
//   } catch (error) {
//     console.error('文件上传失败', error);
//   }
// };

// 添加模型
const addModel = (task) => {
  modelForm.value = { ...task }; // 填充选中的任务数据到表单
  // dialogVisible.value = true; // 打开对话框
  emit('showNewModelDialog');
};

// 提交任务
const submitTask = async () => {
  const formData = new FormData();

  // 将表单数据添加到 FormData
  formData.append('modelName', modelForm.value.modelName);
  formData.append('modelType', modelForm.value.modelType);
  // // formData.append('createTime', modelForm.value.createTime);
  // formData.append('inputParameter', modelForm.value.inputParameter);
  // formData.append('outputParameter', modelForm.value.outputParameter);

  // 添加文件数据
  const file = document.getElementById('fileUpload') as HTMLInputElement;
  if (file?.files?.[0]) {
    formData.append('file', file.files[0]);
  }

  try {
    const response = await axios.post('http://localhost:3001/api/judgeModel/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    console.log('提交成功:', response.data);
    dialogVisible.value = false;
  } catch (error) {
    console.error('提交失败:', error);

  }
};

// 关闭添加任务的对话框
const handleDialogClose = () => {
  taskForm.value = {
    id: 0,
    taskName: '',
    createTime: '',
    judgementRule: '',
    judgementModel: '',
    judgementEffect: '',
    judgementMethod: '',
    taskStatus: ''
  };
};

// 存储选中的行
const selectedRows = ref<any[]>([]);

// 处理选中行变化
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows; // 存储选中的行
};

// 删除选中的任务
const deleteModel = () => {
  if (selectedRows.value.length === 0) {
    // 如果没有选中项，直接返回
    console.log("没有选中项，无法删除");
    return;
  }

  // 删除选中的任务
  selectedRows.value.forEach((row) => {
    const index = tableData.value.findIndex(item => item.id === row.id);
    if (index !== -1) {
      tableData.value.splice(index, 1); // 从 tableData 中删除
    }
  });

  // 清空选中项
  selectedRows.value = [];
};

// 动态设置宽度和高度
const modalStyle = ref({});

onMounted(() => {
  const parentWidth = window.innerWidth;
  const parentHeight = window.innerHeight;
  modalStyle.value = {
    width: `${parentWidth * 0.8}px`,
    height: `${parentHeight * 0.8}px`
  };
  fetchTableData();
});
</script>

<style scoped>
.task-modal {
  /*width: 60vw;*/
  /*height: 60vh;*/
  background: linear-gradient(to bottom, rgba(9, 25, 37, 0.75), rgba(44, 65, 94, 0.75));
  /*background: linear-gradient(to bottom, #091925, #2C415E);*/
  /*background:black;*/
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  /*z-index: 1000;*/
  position: fixed;
  height:80%;
  width:70%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  dsplay: flex;
  flex-direction: column;
}

.task-modal-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 45px;
  /*color: #fff;*/
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(to bottom, rgba(15,33,51), rgba(57,125,202));
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.task-modal-header button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 900;
  color: #01E3FF;
}

.task-modal-title {
  /*position: absolute;*/
  margin-left: 30px;
  display: flex;
  align-items: center;
  font-family: "微软雅黑 Bold", "微软雅黑", sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 18px;
  color: #FFFFFF;
  text-align: left;
  line-height: 45px;
}

.task-modal-icon {
  margin-right: 10px;
  /*vertical-align: middle;*/
  width: 23px;
  height: 23px;
  z-index: 20;
}

.task-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  /*background: rgba(0, 0, 0, 0.5);*/
  display: flex;
  justify-content: center;
  align-items: center;
}

.task-modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
}

.button-group {
  margin-top: 50px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 40px);
  background-color: transparent;
}

.button-group .button {
  border-radius: 5px;
  height: 35px;
  width: 125px;
  background-color: #1B86D5;
  border: none;
  color: #FBFDFF;
  font-family: "微软雅黑", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 17px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.input-search {
  flex: 1;
  background-color: white;
  margin-left: 700px;
  margin-right: 20px;
  color: #ccc;
  border: none;
  border-radius: 5px;
  padding: 8px;
}

.input-field::placeholder {
  color: #ccc;
}

.custom-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* 对话框 */
.custom-dialog {
  background: white;
  width: 50%;
  /*height: 60%;*/
  min-height: 25%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 对话框头部 */
.dialog-header {
  height: 40px;
  background: linear-gradient(to bottom, #0F5B9D, #498ED7);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 10px;
}

/* 标题文字 */
.header-title {
  color: white;
  font-family: "微软雅黑 Bold", "微软雅黑", sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 16px;
  margin-left: 10px;
  flex-grow: 1;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  font-weight: 700;
  color: rgb(1,227,255);
  cursor: pointer;
  padding: 10px;
}

/* 对话框内容 */
.dialog-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #155997;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.dialog-column {
  flex: 1;
  max-width: 48%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0;
  margin: 0;
}

/*.dialog-column:nth-child(2) {*/
/*  margin-top: 38px;*/
/*}*/

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  gap: 5px;
}

.input-label {
  font-size: 16px;
  color: #fff;
  text-align: left;
  width: 100px;
  white-space: nowrap;
}

.input-field{
  flex: 1;
  background-color: #000;
  color: #fff;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-column {
  flex: 1;
  margin-right: 20px;
}

.form-row.multi-input .form-column {
  flex-basis: 48%;
}

.input-label {
  font-size: 16px;
  color: #fff;
  margin-right: 5px;
  text-align: left;
  display: block;
  width: 100px;
  white-space: nowrap;
}

.input-field {
  background-color: #000;
  color: #fff;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-grow: 1;
  min-width: 80px;
  width: 70%;
}

.add-file-btn, .download-file-btn {
  width: 90px;
  height: 36px;
  background: inherit;
  background-color: rgba(64, 158, 255, 1);
  border: none;
  border-radius: 4px;
  font-size: 14px;
  color: #FFFFFF;
  box-shadow: none;
  cursor: pointer;
  text-align: center;
  line-height: 36px;
  margin-bottom: 5px;
}

.add-file-btn:hover, .download-file-btn:hover {
  background-color: rgba(50, 130, 230, 1);
}

.upload-panel {
  background-color: white;
  border: 2px solid #ccc;
  padding: 20px;
  text-align: center;
  border-radius: 4px;
  width: 360px;
  height: 200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  margin-botton: 5px;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  z-index: 10000;
}

.upload-text {
  font-family: "Arial Normal", "Arial", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 13px;
  letter-spacing: normal;
  color: #333333;
  vertical-align: middle;
  text-align: center;
  line-height: normal;
  text-transform: none;
}

.upload-link {
  color: #40A9FF;
  cursor: pointer;
}

.upload-link:hover {
  text-decoration: underline;
}

/*已上传的文件名*/
.uploaded-file-name {
  font-family: Roboto, sans-serif;
  color: #0f40f5;
  text-decoration: underline;
  margin-top: 10px;
}

.file-input {
  display: none;
}

/* 对话框底部 */
.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 50px;
  background-color: #155997;
}

.button {
  width: 100px;
  height: 32px;
  background-color: #1364BE;
  border: 0.5px solid #01E3FF;
  color: white;
  font-family: "微软雅黑", sans-serif;
  font-weight: 400;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  line-height: 32px;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #2391FF;
  color: white;
}

.table-container {
  width: calc(100% - 30px);
  max-width: calc(100% );
  margin: 15px 15px;
  padding: 0;
  box-sizing: border-box;
}

.custom-table {
  width: 100%;
}

/*.custom-table .el-table__header-wrapper {*/
/*  height: 141px*/
/*}*/
::v-deep .el-table__header {
  line-height: 60px;
}

.custom-table .el-table__header th {
  height: 141px ;
  vertical-align: middle;
  padding: 0
}

.custom-table .el-table__header .cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-pagination {
  margin-top: 20px;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
}

.custom-pagination .el-button {
  margin: 0 5px;
  height: 35px;
  font-family: "Arial Normal", "Arial", sans-serif;
  font-weight: 400;
  font-size: 13px;
  text-align: center;
  line-height: normal;
  background-color: #1F4A6F;
  color: #2391FF;
  border: 0.1px solid #2391FF;
}

.custom-pagination .el-button:hover {
  background-color: #20598F !important;
  color: white !important;
  border-color: #2391FF !important;
}

.custom-pagination .pagination-number-button {
  width: 35px;
}

/* 已选中的页码样式 */
.custom-pagination .active-page {
  background-color: #2391FF !important;
  color: white !important;
  border-color: #2391FF !important;
}

/* 鼠标悬浮的页码样式 */
.custom-pagination .hover-page {
  background-color: #20598F !important;
  color: white !important;
  border-color: #2391FF !important;
}

::v-deep .el-table .el-table__header th {
  font-family: "微软雅黑", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 20px;
  color: #FFFFFF;
}

/* 表格体的字体样式 */
::v-deep .el-table .el-table__body td {
  font-family: "微软雅黑", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  color: #FFFFFF;
}

/* 表格边框 */
::v-deep .el-table {
  border: 0.3px solid #797979;
}

::v-deep .el-table__header-wrapper th {
  border-bottom: 0.1px solid #1B88D7 !important;
}

/* 表格头的边框 */
::v-deep .el-table .el-table__header th {
  border: 0.3px solid #1B88D7;
}

/* 表格体的单元格边框 */
::v-deep .el-table .el-table__body td {
  border: 0.3px solid #797979;
}

/* 列的边框 */
::v-deep .el-table .el-table__selection {
  border: 0.3px solid #797979;
}

::v-deep .el-table .el-table__body tr:nth-child(odd) {
  background-color: rgba(27, 136, 215, 0.1);
}

::v-deep .el-table .el-table__body tr:nth-child(even) {
  background-color: rgba(27, 136, 215, 0.05);
}

::v-deep .custom-button {
  border-radius: 8px;
  border: 1px solid #1B88D7;
  background-color: rgba(35, 145, 255, 0.5);
  color: #ffffff;
  padding: 4px 12px;
  font-size: 14px;
  margin-right: 10px;
}

::v-deep .custom-button:last-child {
  margin-right: 0;
}

::v-deep .custom-button:hover {
  background-color: rgba(35, 145, 255, 0.7);
  border-color: #1B88D7;
  cursor: pointer;
}

.task-status-btn {
  width: 94px;
  height: 24px;
  font-family: "微软雅黑", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: not-allowed;
  text-align: center;
}

.task-status-btn.completed {
  background-color: #51C5A2;
  border-radius: 2px;
}

.task-status-btn.incomplete {
  background-color: #F56C6C;
  border-radius: 2px;
}

::v-deep .el-table .cell {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
