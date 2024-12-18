<template>
  <!-- 裁决任务管理弹窗 -->
  <div v-if="isShow" class="task-modal-overlay">
    <div class="task-modal" :style="modalStyle">
      <!-- 头部 -->
      <div class="task-modal-header">
        <div class="task-modal-title">
          <img src="@/assets/images/icon-title.png" alt="Icon" class="task-modal-icon">
          裁决规则数据管理
        </div>
        <button @click="closeModal">X</button>
      </div>

      <!-- 主体 -->
      <div class="task-modal-body">
        <!-- 按钮组 -->
        <div class="button-group">
          <button class="button" style="margin-left: 10px;" @click="exportRule">导出规则</button>
          <button class="button" style="margin-right: 20px" @click="editTask">添加规则</button>
<!--          <button class="button" style="margin-right: 20px; background-color: #C33333" @click="deleteTask">删除</button>-->
        </div>

        <!-- 编辑规则的弹窗 -->
        <div v-if="dialogVisible" class="custom-dialog-overlay">
          <div class="custom-dialog">
            <div class="dialog-header">
              <span class="header-title">编辑裁决规则</span>
              <button class="close-button" @click="handleDialogClose">X</button>
            </div>
            <div class="dialog-content">
              <div class="form-container">
                <div class="form-row">
                  <label for="ruleName" class="input-label">*规则名称</label>
                  <input type="text" id="ruleName" class="input-field" v-model="taskForm.ruleName" placeholder="请输入任务名称" />
                </div>
                <div class="form-row">
                  <label for="judgeModel" class="input-label">*裁决模型</label>
                  <select id="judgeModel" class="input-field" v-model="taskForm.judgeModel">
                    <option value="电子干扰">电子干扰</option>
                    <option value="光学干扰">光学干扰</option>
                    <option value="通信干扰">通信干扰</option>
                    <option value="电子对抗">电子对抗</option>
                  </select>
                </div>
                <div class="form-row">
                  <label for="destroyLevel" class="input-label">*毁伤等级</label>
                  <select id="destroyLevel" class="input-field" v-model="taskForm.destroyLevel">
                    <option value="轻微">轻微</option>
                    <option value="严重">严重</option>
                    <option value="干扰">干扰</option>
                  </select>
                </div>
                <div class="form-row">
                  <label for="createTime" class="input-label">*创建时间</label>
                  <input type="text" id="createTime" class="input-field" v-model="taskForm.createTime" placeholder="2024年xx月xx日" />
                </div>
                <div class="form-row">
                  <label for="targetType" class="input-label">*目标类型</label>
                  <input type="text" id="targetType" class="input-field" v-model="taskForm.targetType" placeholder="电子干扰xxxxxx" />
                </div>
                <div class="form-row">
                  <label for="finalLevel" class="input-label">*最终指标</label>
                  <input type="text" id="finalLevel" class="input-field" v-model="taskForm.finalLevel" placeholder="电子干扰xxxxxx" />
                  <select id="shuzhifanwei" class="input-field"  placeholder="数值范围">
                    <option value="范围1">范围1</option>
                    <option value="范围2">范围2</option>
                    <option value="范围3">范围3</option>
                  </select>
                  <select id="zuidazhi" class="input-field" placeholder="最大值">
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                  </select>
                  <select id="zuixiaozhi" class="input-field"  placeholder="最小值">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                  </select>
                  <select id="huishangdengji" class="input-field" placeholder="毁伤等级">
                    <option value="轻微">轻微</option>
                    <option value="严重">严重</option>
                    <option value="干扰">干扰</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="dialog-footer">
              <button class="button" @click="handleDialogClose">取消</button>
              <button class="button" @click="submitTask">确认</button>
            </div>
          </div>
        </div>

        <!-- el-table -->
        <div class="table-container">
          <el-table :data="paginatedData" class="custom-table" :head-cell-style="{ height: '80px', lineHeight: '80px' }" :row-style="{ height: '55px' }" ref="multipleTableRef">
            <el-table-column type="selection" width="60" />
            <el-table-column prop="ruleName" label="规则名称" width="210" />
            <el-table-column prop="judgeModel" label="裁决模型" width="280" />
            <el-table-column prop="createTime" label="创建时间" width="250" />
            <el-table-column prop="parameters" label="参数" width="700" />
            <el-table-column prop="actions" label="操作" width="250">
              <template #default="scope">
                <el-button class="custom-button" size="mini" @click="editTask(scope.row)">编辑</el-button>
                <el-button class="custom-button" size="mini" @click="deleteTask(scope.row)">删除</el-button>
<!--                <el-button class="custom-button" size="mini" @click="executeTask(scope.row)">执行</el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 小型分页 -->
        <div class="custom-pagination">
          <el-button size="small" :disabled="currentPage <= 1" @click="handlePageChange(currentPage - 1)" class="pagination-button">上一页</el-button>
          <el-button v-for="page in totalPages" :key="page" size="small" :type="currentPage === page ? 'primary' : ''" @click="handlePageChange(page)" class="pagination-button pagination-number-button">
            {{ page }}
          </el-button>
          <el-button size="small" :disabled="currentPage >= totalPages" @click="handlePageChange(currentPage + 1)" class="pagination-button">下一页</el-button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {defineProps, defineEmits, ref, onMounted, computed, toRaw} from 'vue';
import  { ElTable, ElTableColumn, ElPagination, ElButton  } from 'element-plus';
import axios from "axios";
// import {toRaw} from "vue/dist/vue";

const props = defineProps({
  isShow: Boolean
});

const emit = defineEmits(['update:isShow']);

const closeModal = () => {
  emit('update:isShow', false);
};

const exportRule = () => {
  alert('导出成功！');
};

// 模拟表格数据
let tableData = ref([
  { id: 1, ruleName: 'xxxxxx方案1', createTime: '24-05-01 10:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 2, ruleName: 'xxxxxx方案2', createTime: '24-05-02 11:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 3, ruleName: 'xxxxxx方案3', createTime: '24-05-03 12:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 4, ruleName: 'xxxxxx方案4', createTime: '24-05-04 13:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 5, ruleName: 'xxxxxx方案5', createTime: '24-05-05 14:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 6, ruleName: 'xxxxxx方案6', createTime: '24-05-06 15:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 7, ruleName: 'xxxxxx方案7', createTime: '24-05-07 16:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 8, ruleName: 'xxxxxx方案8', createTime: '24-05-08 17:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 9, ruleName: 'xxxxxx方案9', createTime: '24-05-09 18:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 10, ruleName: 'xxxxxx方案10', createTime: '24-05-10 19:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 11, ruleName: 'xxxxxx方案11', createTime: '24-05-11 20:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 12, ruleName: 'xxxxxx方案12', createTime: '24-05-12 21:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 13, ruleName: 'xxxxxx方案13', createTime: '24-05-13 22:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 14, ruleName: 'xxxxxx方案14', createTime: '24-05-14 23:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 15, ruleName: 'xxxxxx方案15', createTime: '24-05-15 24:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 16, ruleName: 'xxxxxx方案16', createTime: '24-05-16 01:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 17, ruleName: 'xxxxxx方案17', createTime: '24-05-17 02:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 18, ruleName: 'xxxxxx方案18', createTime: '24-05-18 03:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 19, ruleName: 'xxxxxx方案19', createTime: '24-05-19 04:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  { id: 20, ruleName: 'xxxxxx方案20', createTime: '24-05-20 05:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' }
]);

// 分页查询方法
const fetchTableData = async (
    ruleName = "",
    current = 0,
    pageSize = 10,
    sortField = "",
    sortOrder = ""
) => {
  try {
    console.log("正在请求数据...");
    const response = await axios.post("http://192.168.1.200:3001/api/calRule/pageList", {
      current,
      pageSize,
      sortField,
      sortOrder,
      ruleName,
    });

    console.log("response.data.data", response.data.data);
    console.log("response.data.data.records", response.data.data.records);

    const newData = response.data.data.records;
    console.log("请求到的新数据:", newData);

    // 遍历返回的数据并更新 tableData
    newData.forEach((record, index) => {
      // 如果对应索引已有数据，更新指定字段；否则添加新数据
      if (tableData.value[index]) {
        tableData.value[index].ruleName = record.task.ruleName;  // 替换规则名称
        tableData.value[index].createTime = record.task.createTime; // 替换创建时间
        tableData.value[index].judgeModel = record.task.judgeModel; // 替换判定模型
        tableData.value[index].parameters = record.task.parameters; // 替换参数
        tableData.value[index].destroyLevel = record.task.destroyLevel; // 替换销毁等级
        tableData.value[index].judgementMethod = record.task.judgementMethod; // 替换裁决方法
        tableData.value[index].targetType = record.task.targetType; // 替换目标类型
        tableData.value[index].finalLevel = record.task.finalLevel; // 替换最终级别
      } else {
        // 添加新数据，保留默认值
        tableData.value.push({
          id: record.task.taskId || '',
          ruleName: record.task.ruleName,
          createTime: record.task.createTime,
          judgeModel: record.task.judgeModel,
          parameters: record.task.parameters,
          destroyLevel: record.task.destroyLevel,
          judgementMethod: record.task.judgementMethod,
          targetType: record.task.targetType,
          finalLevel: record.task.finalLevel,
          actions: '编辑',
        });
      }
    });

    // 如果返回的数据少于现有数据，截断多余数据
    if (newData.length < tableData.value.length) {
      tableData.value.splice(newData.length);
    }

    console.log("更新后的表格数据:", tableData.value);
  } catch (err) {
    console.error("请求数据失败:", err);
  }
};

// 当前页数和每页显示的数据量
const currentPage = ref(1);
const pageSize = ref(10);

// 计算分页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

// 计算总条数
const totalItems = computed(() => tableData.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// 处理分页变化
const handlePageChange = (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return; // 防止越界
  currentPage.value = newPage;
};

// 控制添加任务的对话框
const dialogVisible = ref(false);

const taskForm = ref({
  id: 0,
  ruleName: '',
  createTime: '',
  judgeModel: '',
  parameters: '',
  destroyLevel: '',
  judgementMethod: '',
  targetType: '',
  finalLevel: '进行中',
  actions: '编辑',
});

// 编辑任务
const editTask = (task) => {
  taskForm.value = { ...task }; // 填充选中的任务数据到表单
  dialogVisible.value = true;  // 打开对话框
};

// 提交任务
const submitTask = async () => {
  try {
    console.log("提交的任务数据:", taskForm);

    // 构造任务数据，确保包含所有必要的字段
    const taskData = {
      id: taskForm.value.id || Date.now(), // 如果没有 id，则自动生成
      ruleName: taskForm.value.ruleName || "任务名称",
      createTime: taskForm.value.createTime || "2024年xx月xx日",
      judgeModel: taskForm.value.judgeModel || "电子干扰",
      parameters: taskForm.value.parameters || "参数xx",
      destroyLevel: taskForm.value.destroyLevel || "默认销毁等级",
      judgementMethod: taskForm.value.judgementMethod || "默认方法",
      targetType: taskForm.value.targetType || "默认效果",
      finalLevel: taskForm.value.finalLevel || "待处理", // 默认值
      actions: "编辑", // 操作类型：编辑
    };

    // 查找是否已存在该任务
    const existingIndex = tableData.value.findIndex(
        (item) => item.id === taskForm.value.id
    );

    if (existingIndex !== -1) {
      // 如果任务已存在，则更新任务数据，保持位置不变
      tableData.value[existingIndex] = taskData;
    } else {
      // 如果任务不存在，则插入新任务
      tableData.value.unshift(taskData);
    }

    // 触发 Vue 的响应式更新，刷新表格
    tableData.value = [...tableData.value];

    // 重置表单并关闭对话框
    dialogVisible.value = false;
    taskForm.value = {};  // 清空表单数据
  } catch (err) {
    console.error("保存任务失败", err);
  }
};

// 删除任务
const deleteTask = async (row) => {
  try {
    console.log("要删除的任务ID:", row.id);

    // 删除本地的数据
    const index = tableData.value.findIndex(item => item.id === row.id);
    if (index !== -1) {
      tableData.value.splice(index, 1);  // 删除对应的任务项
      console.log("删除后的 tableData:", tableData.value);
    } else {
      console.log("未找到要删除的任务");
    }
  } catch (err) {
    console.error("删除任务失败", err);
  }
};

// // 执行任务
// const executeTask = (row) => {
//   const taskIndex = tableData.value.findIndex((task) => task.id === row.id);
//   if (taskIndex !== -1) {
//     tableData.value[taskIndex].taskStatus = "已完成";
//   }
// };

// 关闭添加任务的对话框
const handleDialogClose = () => {
  taskForm.value = {
    id: 0,
    ruleName: '',
    createTime: '',
    judgeModel: '',
    parameters: '',
    destroyLevel: '',
    judgementMethod: '',
    targetType: '',
    finalLevel: '进行中',
    actions: '编辑',
  };
  dialogVisible.value = false;
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
  /*background:black;*/
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  /*z-index: 1000;*/
  position: fixed;
  height:80%;
  width:60%;
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
  color: black;
  font-size: 14px;
  font-weight: 500px;
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
  width: 70%;
  height: 50%;
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

/* 关闭按钮 */
.close-button {
  background: none;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
}

/* 对话框内容 */
.dialog-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #155997;
}

.form-container {
  width: 70%;
  margin: 0 auto;
}

.form-row {
  display: flex;
  /*flex-wrap: wrap;*/
  /*justify-content: space-between;*/
  align-items: center;
  margin-bottom: 15px;
  gap: 40px;
}

.input-label {
  font-size: 16px;
  color: #fff;
  margin-right: 5px;
  /*flex-basis: calc(50% - 20px);*/
  flex-basis: 30%;
  text-align: right;
}

.input-field {
  background-color: #000;
  color: #fff;
  padding: 8px;
  /*width: 100%;*/
  /*width: calc(50% - 20px);*/
  flex-basis: calc(50% - 160px);
  border: 1px solid #ccc;
  border-radius: 4px;
}

.radio-group {
  display: flex;
  align-items: center;
  gap: 20px;
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

.custom-pagination .pagination-number-button {
  width: 35px;
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
