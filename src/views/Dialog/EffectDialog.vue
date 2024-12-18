<template>
  <!-- 裁决任务管理弹窗-->
  <div v-if="isShow" class="task-modal-overlay">
    <div class="task-modal">
      <!--头部-->
      <div class="task-modal-header">
        <div class="task-modal-title">
          <img src="@/assets/images/icon-title.png" alt="Icon" class="task-modal-icon">
          裁决任务数据管理
        </div>
        <button @click="closeModal">X</button>
      </div>
      <!--主体-->
      <div class="task-modal-body">
        <!--按钮组-->
        <div class="button-group">
          <button class="button" style="margin-left: 10px;" @click="editTask">添加任务</button>
          <input class="input-search" placeholder="Try typing new..." />
          <button class="button" style="margin-right:20px">搜索</button>
          <button class="button" style="margin-right: 20px; background-color: #C33333">删除</button>
        </div>
        <!--添加任务的弹窗-->
        <div v-if="dialogVisible" class="custom-dialog-overlay">
          <div class="custom-dialog">
            <div class="dialog-header">
              <span class="header-title">添加裁决任务</span>
              <button class="close-button" @click="dialogVisible = false">X</button>
            </div>
            <div class="dialog-content">
              <div class="form-container">
                <div class="form-row">
                  <label for="taskName" class="input-label">*任务名称</label>
                  <input type="text" id="taskName" class="input-field" placeholder="请输入任务名称" />
                  <label for="taskName" class="input-label">*想定任务名称</label>
                  <select id="taskNameXiangding" class="input-field">
                    <option value="电子干扰">电子干扰</option>
                    <option value="光学干扰">光学干扰</option>
                    <option value="通信干扰">通信干扰</option>
                    <option value="电子对抗">电子对抗</option>
                  </select>
                </div>
                <div class="form-row">
                  <label for="createTime" class="input-label">*创建时间</label>
                  <input type="text" id="createTime" class="input-field" placeholder="2024年xx月xx日" />
                </div>
                <div class="form-row">
                  <label for="judgementModel" class="input-label">*裁决模型</label>
                  <select id="judgementModel" class="input-field">
                    <option value="电子干扰">电子干扰</option>
                    <option value="光学干扰">光学干扰</option>
                    <option value="通信干扰">通信干扰</option>
                    <option value="电子对抗">电子对抗</option>
                  </select>
                  <label for="effectModel" class="input-label">*效果模型</label>
                  <select id="effectModel" class="input-field">
                    <option value="电子干扰">电子干扰</option>
                    <option value="光学干扰">光学干扰</option>
                    <option value="通信干扰">通信干扰</option>
                    <option value="电子对抗">电子对抗</option>
                  </select>
                </div>
                <div class="form-row">
                  <label for="judgementRule" class="input-label">*裁决规则</label>
                  <select id="judgementRule" class="input-field">
                    <option value="电子干扰">电子干扰</option>
                    <option value="光学干扰">光学干扰</option>
                    <option value="通信干扰">通信干扰</option>
                    <option value="电子对抗">电子对抗</option>
                  </select>
                </div>
                <div class="form-row">
                  <label class="radio-label">裁决方式</label>
                  <div class="radio-group">
                    <label>
                      <input type="radio" name="decisionMethod" value="auto" /> 自动裁决
                    </label>
                    <label>
                      <input type="radio" name="decisionMethod" value="manual" /> 手动裁决
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="dialog-footer">
              <button class="button"@click="dialogVisible = false">取消</button>
              <button class="button" @click="submitTask">保存</button>
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
            <el-table-column type="selection" width="60" />
            <el-table-column prop="taskName" label="任务名称" width="160" />
            <el-table-column prop="taskName" label="想定任务名称" width="180" />
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column prop="judgementModel" label="裁决模型" width="140" />
            <el-table-column prop="judgementRule" label="裁决规则" width="140" />
            <el-table-column prop="judgementMethod" label="裁决方式" width="140" />
            <el-table-column prop="judgementEffect" label="裁决效果" width="160" />
            <el-table-column prop="taskStatus" label="任务状态" width="160">
              <template #default="scope">
                <el-button
                    :class="[
              'task-status-btn',
              scope.row.taskStatus === '已完成' ? 'completed' : 'incomplete'
            ]"
                    size="mini"
                    disabled
                >
                  {{ scope.row.taskStatus === '已完成' ? '已完成' : '未执行' }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="actions" label="操作" width="188">
              <template #default="scope">
                <el-button
                    class="custom-button"
                    size="mini"
                    @click="editTask(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                    class="custom-button"
                    size="mini"
                    @click="deleteTask(scope.row)"
                >
                  执行
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 小型分页 -->
        <div class="custom-pagination">
          <el-button
              size="small"
              :disabled="currentPage <= 1"
              @click="handlePageChange(currentPage - 1)"
              class="pagination-button"
          >
            上一页
          </el-button>
          <el-button
              v-for="page in totalPages"
              :key="page"
              size="small"
              :type="currentPage === page ? 'primary' : ''"
              @click="handlePageChange(page)"
              class="pagination-button pagination-number-button"
          >
            {{ page }}
          </el-button>
          <el-button
              size="small"
              :disabled="currentPage >= totalPages"
              @click="handlePageChange(currentPage + 1)"
              class="pagination-button"
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
    taskName: 'xxxxxx方案1',
    createTime: '24-05-01 10:00',
    judgementModel: '电子干扰',
    judgementRule: '规则1',
    judgementMethod: '手动裁决',
    judgementEffect: '效果模型1',
    taskStatus: '进行中',
    actions: '编辑',
  },
  {
    id: 2,
    taskName: 'xxxxxx方案2',
    createTime: '24-05-02 11:00',
    judgementModel: '雷达反制',
    judgementRule: '规则2',
    judgementMethod: '自动裁决',
    judgementEffect: '效果模型2',
    taskStatus: '未开始',
    actions: '编辑',
  },
  {
    id: 3,
    taskName: 'xxxxxx方案3',
    createTime: '24-05-03 12:00',
    judgementModel: '电子干扰',
    judgementRule: '规则3',
    judgementMethod: '手动裁决',
    judgementEffect: '效果模型3',
    taskStatus: '已完成',
    actions: '编辑',
  },
  {
    id: 4,
    taskName: 'xxxxxx方案4',
    createTime: '24-05-04 13:00',
    judgementModel: '通信拦截',
    judgementRule: '规则4',
    judgementMethod: '手动裁决',
    judgementEffect: '多个效果模型',
    taskStatus: '进行中',
    actions: '编辑',
  },
  {
    id: 5,
    taskName: 'xxxxxx方案5',
    createTime: '24-05-05 14:00',
    judgementModel: '雷达反制',
    judgementRule: '规则5',
    judgementMethod: '自动裁决',
    judgementEffect: '效果模型5',
    taskStatus: '未开始',
    actions: '编辑',
  },
  {
    id: 6,
    taskName: 'xxxxxx方案6',
    createTime: '24-05-06 15:00',
    judgementModel: '电子干扰',
    judgementRule: '规则6',
    judgementMethod: '手动裁决',
    judgementEffect: '效果模型6',
    taskStatus: '已完成',
    actions: '编辑',
  },
  {
    id: 7,
    taskName: 'xxxxxx方案7',
    createTime: '24-05-07 16:00',
    judgementModel: '通信拦截',
    judgementRule: '规则7',
    judgementMethod: '自动裁决',
    judgementEffect: '效果模型7',
    taskStatus: '进行中',
    actions: '编辑',
  },
  {
    id: 8,
    taskName: 'xxxxxx方案8',
    createTime: '24-05-08 17:00',
    judgementModel: '雷达反制',
    judgementRule: '规则8',
    judgementMethod: '手动裁决',
    judgementEffect: '效果模型8',
    taskStatus: '已完成',
    actions: '编辑',
  },
  {
    id: 9,
    taskName: 'xxxxxx方案9',
    createTime: '24-05-09 18:00',
    judgementModel: '电子干扰',
    judgementRule: '规则9',
    judgementMethod: '手动裁决',
    judgementEffect: '效果模型9',
    taskStatus: '未开始',
    actions: '编辑',
  },
  {
    id: 10,
    taskName: 'xxxxxx方案10',
    createTime: '24-05-10 19:00',
    judgementModel: '通信拦截',
    judgementRule: '规则10',
    judgementMethod: '自动裁决',
    judgementEffect: '效果模型10',
    taskStatus: '已完成',
    actions: '编辑',
  },
  {
    id: 11,
    taskName: 'xxxxxx方案11',
    createTime: '24-05-11 10:30',
    judgementModel: '雷达反制',
    judgementRule: '规则11',
    judgementMethod: '手动裁决',
    judgementEffect: '多个效果模型',
    taskStatus: '进行中',
    actions: '编辑',
  },
  {
    id: 12,
    taskName: 'xxxxxx方案12',
    createTime: '24-05-12 11:30',
    judgementModel: '电子干扰',
    judgementRule: '规则12',
    judgementMethod: '自动裁决',
    judgementEffect: '效果模型12',
    taskStatus: '未开始',
    actions: '编辑',
  },
  {
    id: 13,
    taskName: 'xxxxxx方案13',
    createTime: '24-05-13 12:30',
    judgementModel: '通信拦截',
    judgementRule: '规则13',
    judgementMethod: '手动裁决',
    judgementEffect: '效果模型13',
    taskStatus: '已完成',
    actions: '编辑',
  },
  {
    id: 14,
    taskName: 'xxxxxx方案14',
    createTime: '24-05-14 13:30',
    judgementModel: '雷达反制',
    judgementRule: '规则14',
    judgementMethod: '自动裁决',
    judgementEffect: '效果模型14',
    taskStatus: '进行中',
    actions: '编辑',
  },
  {
    id: 15,
    taskName: 'xxxxxx方案15',
    createTime: '24-05-15 14:30',
    judgementModel: '电子干扰',
    judgementRule: '规则15',
    judgementMethod: '手动裁决',
    judgementEffect: '效果模型15',
    taskStatus: '未开始',
    actions: '编辑',
  },
  {
    id: 16,
    taskName: 'xxxxxx方案16',
    createTime: '24-05-16 15:30',
    judgementModel: '通信拦截',
    judgementRule: '规则16',
    judgementMethod: '自动裁决',
    judgementEffect: '效果模型16',
    taskStatus: '已完成',
    actions: '编辑',
  },
  {
    id: 17,
    taskName: 'xxxxxx方案17',
    createTime: '24-05-17 16:30',
    judgementModel: '雷达反制',
    judgementRule: '规则17',
    judgementMethod: '手动裁决',
    judgementEffect: '多个效果模型',
    taskStatus: '进行中',
    actions: '编辑',
  },
  {
    id: 18,
    taskName: 'xxxxxx方案18',
    createTime: '24-05-18 17:30',
    judgementModel: '电子干扰',
    judgementRule: '规则18',
    judgementMethod: '自动裁决',
    judgementEffect: '效果模型18',
    taskStatus: '未开始',
    actions: '编辑',
  },
  {
    id: 19,
    taskName: 'xxxxxx方案19',
    createTime: '24-05-19 18:30',
    judgementModel: '通信拦截',
    judgementRule: '规则19',
    judgementMethod: '手动裁决',
    judgementEffect: '效果模型19',
    taskStatus: '已完成',
    actions: '编辑',
  },
  {
    id: 20,
    taskName: 'xxxxxx方案20',
    createTime: '24-05-20 19:30',
    judgementModel: '雷达反制',
    judgementRule: '规则20',
    judgementMethod: '自动裁决',
    judgementEffect: '效果模型20',
    taskStatus: '进行中',
    actions: '编辑',
  },
]);

// 分页查询方法
const fetchTableData = async (
    taskName = "",
    current = 0,
    pageSize = 10,
    sortField = "",
    sortOrder = ""
) => {
  try {
    console.log("正在请求数据...");
    const response = await axios.post("http://192.168.1.200:3001/api/judgeTask/pageList", {
      current,
      pageSize,
      sortField,
      sortOrder,
      taskName,
    });
    console.log("response.data.data", response.data.data);

    const newData = response.data.data.records;
    console.log("请求到的新数据:", newData);

    // 遍历返回的数据并更新 tableData
    newData.forEach((record, index) => {
      // 如果对应索引已有数据，更新指定字段；否则添加新数据
      if (tableData.value[index]) {
        tableData.value[index].taskName = record.task.taskName;  // 替换任务名称
        tableData.value[index].createTime = record.task.createTime; // 替换创建时间
      } else {
        // 添加新数据，保留默认值
        tableData.value.push({
          id: record.task.taskId || '',      // 任务ID
          taskName: record.task.taskName,   // 任务名称
          createTime: record.task.createTime, // 创建时间
          judgementModel: '',               // 默认值
          judgementRule: '',                // 默认值
          judgementMethod: '',              // 默认值
          judgementEffect: '',              // 默认值
          taskStatus: '',                   // 默认值
          actions: '编辑',                  // 操作按钮默认值
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

const taskForm = ref({
  id: 0,
  taskName: '',
  createTime: '',
  judgementRule: '',
  judgementModel: '',
  judgementEffect: '',
  judgementMethod: '',
  taskStatus: '',
});

// 编辑任务
const editTask = (task) => {
  taskForm.value = { ...task }; // 填充选中的任务数据到表单
  dialogVisible.value = true; // 打开对话框
};

// 提交任务
const submitTask = async () => {
  try {
    const taskData = {
      id: taskForm.value.id,
      taskName: taskForm.value.taskName || 'taskName',
      createTime: taskForm.value.createTime || '2024年xx月xx日',
      judgementRule: taskForm.value.judgementRule || '电子干扰',
      judgementModel: taskForm.value.judgementModel || '电子干扰',
      judgementEffect: taskForm.value.judgementEffect || '电子干扰',
      judgementMethod: taskForm.value.judgementMethod || '电子干扰',
      taskStatus: taskForm.value.taskStatus || '未开始',
      actions: '编辑',
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

// 删除任务
const deleteTask = async (row) => {
  try {
    // 发送请求删除数据
    const response = await axios.delete(
        `http://192.168.1.200:3001/judgeTask/delete/${row.taskId}`
    );
    console.log("删除任务成功", response.data);

    console.log("tableData.value", tableData.value);

    // 删除本地的数据
    const index = tableData.value.findIndex((item) => item.id === row.taskId);
    if (index !== -1) {
      // 使用 splice 删除该项，并将后面的项依次前移
      tableData.value.splice(index, 1);
      console.log("tableData.value", tableData.value);

    }
  } catch (err) {
    console.error("删除任务失败", err);
  }
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
  background: linear-gradient(to bottom, #091925, #2C415E);
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
