<template>
  <!-- 裁决任务管理弹窗-->
  <div v-if="isShow" class="task-modal-overlay">
    <effectExamplePanel v-if="exampleDialogVisible" @close="closeExamplePanel" />
    <div class="task-modal">
      <!--头部-->
      <div class="task-modal-header">
        <div class="task-modal-title">
          <img src="@/assets/images/icon-title.png" alt="Icon" class="task-modal-icon">
          效果模型数据管理
        </div>
        <button @click="closeModal">X</button>
      </div>
      <!--主体-->
      <div class="task-modal-body">
        <!--按钮组-->
        <div class="button-group">
          <button class="button" style="margin-left: 10px;" @click="editTask">添加模型</button>
          <!--          <input class="input-search" placeholder="Try typing new..." />-->
          <!--          <button class="button" style="margin-right:20px">搜索</button>-->
<!--          <button class="button" style="margin-right: 20px; background-color: #C33333" @click="deleteTask(selectedRow)">删除</button>-->
          <button class="button" style="margin-right: 20px; background-color: #C33333" @click="deleteTask">删除</button>
        </div>
        <!--添加任务的弹窗-->
        <div v-if="dialogVisible" class="custom-dialog-overlay">
          <div class="custom-dialog">
            <div class="dialog-header">
              <span class="header-title">导入模型文件</span>
              <button class="close-button" @click="dialogVisible = false">X</button>
            </div>
            <div class="dialog-content">
              <div class="dialog-column">
                <button class="add-file-btn" @click="triggerFileInput">添加文件</button>
                <div class="upload-panel">
                  <div class="icon-container">
                    <el-icon class="upload-icon">
                      <i class="el-icon-cloudy"></i>
                    </el-icon>
                  </div>
                  <p class="upload-text">将文件拖到此处，或 <span class="upload-link" @click="triggerFileInput">点击上传</span></p>
                  <input type="file" id="fileUpload" class="file-input" @change="handleFileUpload" />
                </div>
<!--                <div class="form-row">-->
<!--                  <label for="fileUpload" class="input-label">上传文件</label>-->
<!--                  <input type="file" id="fileUpload" class="input-field" @change="handleFileUpload" />-->
<!--                </div>-->
                <div class="form-row">
                  <label for="input1" class="input-label">*输入参数</label>
                  <input v-model="modelForm.modelName" type="text" id="input1" class="input-field" placeholder="参数xx" />
                </div>
                <div class="form-row">
                  <label for="input2" class="input-label">*已输入参数</label>
                  <input v-model="modelForm.createTime" type="text" id="input2" class="input-field" placeholder="参数xxx" />
                </div>
              </div>
              <div class="dialog-column" style="margin-top: 40px;">
                <div class="form-row">
                  <label for="modelName" class="input-label">*模型名称</label>
                  <input v-model="modelForm.modelName" type="text" id="modelName" class="input-field" placeholder="xxxxx" />
                </div>
                <div class="form-row">
                  <label for="modelType" class="input-label">*效果模型类别</label>
                  <select v-model="modelForm.modelType" id="modelType" class="input-field">
                    <option value="电子干扰">电子干扰</option>
                    <option value="光学干扰">光学干扰</option>
                    <option value="通信干扰">通信干扰</option>
                    <option value="电子对抗">电子对抗</option>
                  </select>
                </div>
                <div class="form-row">
                  <label for="createTime" class="input-label">*创建时间</label>
                  <input v-model="modelForm.createTime" type="text" id="createTime" class="input-field" placeholder="2024年xx月xx日" />
                </div>
              </div>
              <!--              <div class="form-container">-->
              <!--                <div class="form-row">-->
              <!--                  <label for="taskName" class="input-label">*任务名称</label>-->
              <!--                  <input type="text" id="taskName" class="input-field" placeholder="请输入任务名称" />-->
              <!--                  <label for="taskName" class="input-label">*想定任务名称</label>-->
              <!--                  <select id="taskNameXiangding" class="input-field">-->
              <!--                    <option value="电子干扰">电子干扰</option>-->
              <!--                    <option value="光学干扰">光学干扰</option>-->
              <!--                    <option value="通信干扰">通信干扰</option>-->
              <!--                    <option value="电子对抗">电子对抗</option>-->
              <!--                  </select>-->
              <!--                </div>-->
              <!--                <div class="form-row">-->
              <!--                  <label for="createTime" class="input-label">*创建时间</label>-->
              <!--                  <input type="text" id="createTime" class="input-field" placeholder="2024年xx月xx日" />-->
              <!--                </div>-->
              <!--                <div class="form-row">-->
              <!--                  <label for="judgementModel" class="input-label">*裁决模型</label>-->
              <!--                  <select id="judgementModel" class="input-field">-->
              <!--                    <option value="电子干扰">电子干扰</option>-->
              <!--                    <option value="光学干扰">光学干扰</option>-->
              <!--                    <option value="通信干扰">通信干扰</option>-->
              <!--                    <option value="电子对抗">电子对抗</option>-->
              <!--                  </select>-->
              <!--                  <label for="effectModel" class="input-label">*效果模型</label>-->
              <!--                  <select id="effectModel" class="input-field">-->
              <!--                    <option value="电子干扰">电子干扰</option>-->
              <!--                    <option value="光学干扰">光学干扰</option>-->
              <!--                    <option value="通信干扰">通信干扰</option>-->
              <!--                    <option value="电子对抗">电子对抗</option>-->
              <!--                  </select>-->
              <!--                </div>-->
              <!--                <div class="form-row">-->
              <!--                  <label for="judgementRule" class="input-label">*裁决规则</label>-->
              <!--                  <select id="judgementRule" class="input-field">-->
              <!--                    <option value="电子干扰">电子干扰</option>-->
              <!--                    <option value="光学干扰">光学干扰</option>-->
              <!--                    <option value="通信干扰">通信干扰</option>-->
              <!--                    <option value="电子对抗">电子对抗</option>-->
              <!--                  </select>-->
              <!--                </div>-->
              <!--                <div class="form-row">-->
              <!--                  <label class="radio-label">裁决方式</label>-->
              <!--                  <div class="radio-group">-->
              <!--                    <label>-->
              <!--                      <input type="radio" name="decisionMethod" value="auto" /> 自动裁决-->
              <!--                    </label>-->
              <!--                    <label>-->
              <!--                      <input type="radio" name="decisionMethod" value="manual" /> 手动裁决-->
              <!--                    </label>-->
              <!--                  </div>-->
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
            <el-table-column prop="effectName" label="效果模型名称" width="240" />
            <el-table-column prop="effectName" label="模型类型" width="240" />
            <el-table-column prop="createTime" label="创建时间" width="300" />
            <el-table-column prop="modelName" label="关联裁决模型" width="648" />
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
              :class="[
        currentPage === page ? 'active-page' : '',
        hoverPage === page && currentPage !== page ? 'hover-page' : '',
        'pagination-number-button'
      ]"
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
import  { ElTable, ElTableColumn, ElPagination, ElButton  } from 'element-plus';
import axios from "axios";
import EffectExamplePanel from './EffectExamplePanel.vue';

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

const emit = defineEmits(['update:isShow']);

const closeModal = () => {
  emit('update:isShow', false);
};

// 模拟表格数据
let tableData = ref([
  {
    id: 1,
    modelName: 'xxxxxx方案1',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 2,
    modelName: 'xxxxxx方案2',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 3,
    modelName: 'xxxxxx方案3',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 4,
    modelName: 'xxxxxx方案4',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 5,
    modelName: 'xxxxxx方案5',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 6,
    modelName: 'xxxxxx方案6',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 7,
    modelName: 'xxxxxx方案7',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 8,
    modelName: 'xxxxxx方案8',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 9,
    modelName: 'xxxxxx方案9',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 10,
    modelName: 'xxxxxx方案10',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 11,
    modelName: 'xxxxxx方案11',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 12,
    modelName: 'xxxxxx方案12',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 13,
    modelName: 'xxxxxx方案13',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 14,
    modelName: 'xxxxxx方案14',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 15,
    modelName: 'xxxxxx方案15',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 16,
    modelName: 'xxxxxx方案16',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 17,
    modelName: 'xxxxxx方案17',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 18,
    modelName: 'xxxxxx方案18',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
  {
    id: 19,
    modelName: 'xxxxxx方案19',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
   parameter: '规则2',
  },
  {
    id: 20,
    modelName: 'xxxxxx方案20',
    createTime: '24-05-02 11:00',
    modelType: '雷达反制',
    parameter: '规则2',
  },
]);

// 分页查询方法
const fetchTableData = async (
    effectName = "",
    modelId = 0,
    current = 0,
    pageSize = 100,
    sortField = "",
    sortOrder = ""
) => {
  try {
    console.log("正在请求数据...");

    // 请求接口
    const response = await axios.post(
        "http://localhost:3001/api/judgeEffect/pageList",
        {
          current,
          pageSize,
          sortField,
          sortOrder,
          effectName,
          modelId,
        },
        {
          headers: {
            // 可以在这里加上 token 如果需要
            "token": "your_token_here",
          },
        }
    );
    console.log("response.data.data", response.data.data);

    const newData = response.data.data.records;
    console.log("请求到的新数据:", newData);

    // 插入假数据
    const fakeData = {
      taskId: 'fake_task_id',
      effectName: '光能效果模型',
      modelId: 123,
      modelName: '光能模型',
      createTime: '2024-12-20 17:08:34',
      parameter: '参数xx',
      actions: '编辑',
    };

    // 将假数据插入到 newData 中
    newData.push(fakeData);

    // 清空原有数据
    tableData.value = [];

    // 更新表格数据
    newData.forEach((record) => {
      tableData.value.push({
        id: record.taskId || '',
        effectName: record.effectName,
        modelId: record.modelId,
        modelName: record.modelName,
        createTime: record.createTime,
        parameter: record.parameter || '',
        actions: record.actions || '编辑',
      });
    });

    // 如果返回的数据少于现有数据，截断多余数据
    if (newData.length < tableData.value.length) {
      tableData.value.splice(newData.length);
    }

    console.log("更新后的表格数据:", tableData.value);
  } catch (err) {
    console.error("请求数据失败:", err);

    // 请求失败时插入假数据
    tableData.value = [
      {
        taskId: 'fake_task_id',
        effectName: '光能效果模型',
        modelId: 123,
        modelName: '光能模型',
        createTime: '2024-12-20 17:08:34',
        parameter: '参数xx',
        actions: '编辑',
      },
    ];
  }
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

// 处理分页变化
const handlePageChange = (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return; // 防止越界
  currentPage.value = newPage;
};

// 控制添加任务的对话框
const dialogVisible = ref(false);

const modelForm = ref({
  id: 0,
  modelName: '',
  modelType: '',
  createTime: '',
});

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input?.files?.[0];
  if (file) {
    console.log("上传的文件:", file);
  }
};

// 触发文件选择框
const triggerFileInput = () => {
  const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
  fileInput?.click();
};

// 编辑任务
const editTask = (task) => {
  modelForm.value = { ...task }; // 填充选中的任务数据到表单
  dialogVisible.value = true; // 打开对话框
};

// 提交任务
const submitTask = async () => {
  try {
    const taskData = {
      id: modelForm.value.id,
      taskName: modelForm.value.modelName || 'taskName',
      createTime: modelForm.value.createTime || '2024年xx月xx日',
      judgementRule: modelForm.value.modelType || '电子干扰',

    };
    // // 模拟请求
    // const response = await axios.post(
    //     'http://192.168.1.200:3001/judgeTask/update',
    //     taskData
    // );
    // console.log('编辑任务成功', response.data);
    console.log("tableData.value", tableData.value)

    const index = tableData.value.findIndex((item) => item.id === taskForm.value.id);
    if (index !== -1) {
      tableData.value.splice(index, 1);
    }

    tableData.value.unshift(taskData);

    console.log("tableData.value", tableData.value);

    dialogVisible.value = false;
  } catch (err) {
    console.error('编辑任务失败', err);
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
const deleteTask = () => {
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
  width: 70%;
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
}

.dialog-column {
  flex: 1; /* 左右各占 50% */
  max-width: 48%; /* 确保两列宽度不超过容器 */
  display: flex;
  flex-direction: column; /* 每列的输入框垂直排列 */
  gap: 15px; /* 每列内部的输入框间距 */
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 5px;
}

.input-label {
  font-size: 16px;
  color: #fff;
  text-align: left;
  width: 100px;
  white-space: nowrap;
}

.input-field {
  flex: 1;
  background-color: #000;
  color: #fff;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100px;
}

.input-field::placeholder {
  color: #ccc;
}

.add-file-btn {
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

.add-file-btn:hover {
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

.file-input {
  display: none;
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

/*.input-field {*/
/*  background-color: #000;*/
/*  color: #fff;*/
/*  padding: 8px;*/
/*  border: 1px solid #ccc;*/
/*  border-radius: 4px;*/
/*  flex-grow: 1;*/
/*  min-width: 100px;*/
/*  width: 70%;*/
/*}*/

.radio-group {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 16px;
}

.radio-label {
  font-size: 16px;
  color: #fff;
  margin-right: 10px;
}

.radio-group label {
  margin-right: 20px;
  color: #fff;
}

/* 对话框底部 */
.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: 80px;
  background-color: #155997;
}

.button {
  width: 100px;
  height: 32px;
  background-color: #1364BE;
  border: 1px solid #015C87;
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
