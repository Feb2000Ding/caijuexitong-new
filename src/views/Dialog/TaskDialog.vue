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
          <input class="input-search" v-model="searchKeyword" placeholder="Try typing new..." />
          <button class="button" style="margin-right:20px" @click="searchTask">搜索</button>
          <el-button
              class="custom-button"
              size="mini"
              @click="deleteTask(selectedRow)"
          >
            删除
          </el-button>
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
                <!-- 第一列输入框 -->
                <div class="form-row multi-input">
                  <div class="form-column">
                    <label for="taskName" class="input-label">*任务名称</label>
                    <input v-model="taskForm.taskName" type="text" id="taskName" class="input-field" placeholder="请输入任务名称" />
                  </div>
                  <!-- 第二列输入框 -->
                  <div class="form-column">
                    <label for="taskNameXiangding" class="input-label">*想定任务名称</label>
                    <select v-model="taskForm.taskNameXiangding" id="taskNameXiangding" class="input-field">
                      <option value="电子干扰">电子干扰</option>
                      <option value="光学干扰">光学干扰</option>
                      <option value="通信干扰">通信干扰</option>
                      <option value="电子对抗">电子对抗</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-column">
                    <label for="createTime" class="input-label">*创建时间</label>
                    <input v-model="taskForm.createTime" type="text" id="createTime" class="input-field" placeholder="2024年xx月xx日" />
                  </div>
                </div>

                <!-- 默认添加一个裁决模型、效果模型和裁决规则 -->
                <div class="form-row multi-input">
                  <div class="form-column">
                    <label for="judgementModel" class="input-label">*裁决模型</label>
                    <select id="judgementModel" class="input-field">
                      <option value="电子干扰">电子干扰</option>
                      <option value="光学干扰">光学干扰</option>
                      <option value="通信干扰">通信干扰</option>
                      <option value="电子对抗">电子对抗</option>
                    </select>
                  </div>
                  <div class="form-column">
                    <label for="effectModel" class="input-label">*效果模型</label>
                    <select id="effectModel" class="input-field">
                      <option value="电子干扰">电子干扰</option>
                      <option value="光学干扰">光学干扰</option>
                      <option value="通信干扰">通信干扰</option>
                      <option value="电子对抗">电子对抗</option>
                    </select>
                  </div>
                  <div class="form-column">
                    <label for="judgementRule" class="input-label">*裁决规则</label>
                    <select  id="judgementRule" class="input-field">
                      <option value="电子干扰">电子干扰</option>
                      <option value="光学干扰">光学干扰</option>
                      <option value="通信干扰">通信干扰</option>
                      <option value="电子对抗">电子对抗</option>
                    </select>
                  </div>
                </div>

                <!-- 动态添加的裁决模型、效果模型、裁决规则 -->
                <div v-for="index in count" :key="index" class="form-row multi-input">
                  <div class="form-column">
                    <label :for="'judgementModel' + index" class="input-label">*裁决模型</label>
                    <select  :id="'judgementModel' + index" class="input-field">
                      <option value="电子干扰">电子干扰</option>
                      <option value="光学干扰">光学干扰</option>
                      <option value="通信干扰">通信干扰</option>
                      <option value="电子对抗">电子对抗</option>
                    </select>
                  </div>
                  <div class="form-column">
                    <label :for="'effectModel' + index" class="input-label">*效果模型</label>
                    <select  :id="'effectModel' + index" class="input-field">
                      <option value="电子干扰">电子干扰</option>
                      <option value="光学干扰">光学干扰</option>
                      <option value="通信干扰">通信干扰</option>
                      <option value="电子对抗">电子对抗</option>
                    </select>
                  </div>
                  <div class="form-column">
                    <label :for="'judgementRule' + index" class="input-label">*裁决规则</label>
                    <select  :id="'judgementRule' + index" class="input-field">
                      <option value="电子干扰">电子干扰</option>
                      <option value="光学干扰">光学干扰</option>
                      <option value="通信干扰">通信干扰</option>
                      <option value="电子对抗">电子对抗</option>
                    </select>
                  </div>
                </div>

                <!-- 控制动态生成的按钮 -->
                <button @click="increaseCount">添加更多</button>

                <!-- 裁决方式 -->
                <div class="form-row">
                  <label class="radio-label">裁决方式</label>
                  <div class="radio-group">
                    <label>
                      <input v-model="taskForm.judgementMethod" type="radio" value="自动裁决" /> 自动裁决
                    </label>
                    <label>
                      <input v-model="taskForm.judgementMethod" type="radio" value="手动裁决" /> 手动裁决
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 弹窗底部 -->
            <div class="dialog-footer">
              <button class="button" @click="dialogVisible = false">取消</button>
              <button class="button" @click="submitTask">保存</button>
            </div>
          </div>
        </div>
       <!--el-table-->
        <div class="table-container">
          <el-table
              :data="displayData"
              class="custom-table"
              :head-cell-style="{ height: '80px', lineHeight: '80px' }"
              :row-style="{ height: '55px' }"
              ref="multipleTableRef"
              :default-sort="{ prop: 'createTime', order: 'descending' }"
              @selection-change="handleSelectionChange"
              @sort-change="handleSortChange"
              row-key="id"
              @row-click="handleRowClick"
              style="width: 80%"
          >
            <el-table-column type="selection" width="60" />
            <el-table-column prop="taskName" label="任务名称" width="160" />
            <el-table-column prop="taskNameXiangding" label="想定任务名称" width="180" />
            <el-table-column
                prop="createTime"
                label="创建时间"
                width="180"
                sortable
                :sort-method="sortCreateTime"
                @sort-change="handleSortChange"
            />
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
                    @click="executeTask(scope.row)"
                    :disabled="scope.row.taskStatus === '已完成'"
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
import {defineProps, defineEmits, ref, onMounted, computed, toRaw } from 'vue';
import  { ElTable, ElTableColumn, ElPagination, ElButton  } from 'element-plus';
import axios from "axios";

// 配置环境变量
// const apiUrl = process.env.VUE_APP_API_BASE_URL;

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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
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
    taskNameXiangding: '电子干扰',
    createTime: '24-05-20 19:30',
    judgementModel: '雷达反制',
    judgementRule: '规则20',
    judgementMethod: '自动裁决',
    judgementEffect: '效果模型20',
    taskStatus: '进行中',
    actions: '编辑',
  },
]);

// 查询表格内容
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
        tableData.value[index].taskName = record.task.taskName;
        tableData.value[index].createTime = record.task.createTime;
      } else {
        // 添加新数据，保留默认值
        tableData.value.push({
          id: record.task.taskId || '',
          taskName: record.task.taskName,
          createTime: record.task.createTime,
          judgementModel: '',
          judgementRule: '',
          judgementMethod: '',
          judgementEffect: '',
          taskStatus: '',
          actions: '编辑',
        });
      }
    });

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

// 搜索关键字
const searchKeyword = ref('');

// 计算分页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

// 计算总条数
const totalItems = computed(() => tableData.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// 计算过滤后的数据
const filteredData = computed(() => {
  console.log('Filtering data...');
  const filtered = tableData.value.filter(item => {
    return item.taskName.toLowerCase().includes(searchKeyword.value.toLowerCase());
  });
  return filtered;
});

// 处理分页变化
const handlePageChange = (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return; // 防止越界
  currentPage.value = newPage;
};

// 渲染的表格数据
const displayData = computed(() => {
  return filteredData.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
});

// 按日期排序
const sortCreateTime = (a, b) => {
  const dateA = new Date(a.createTime);
  const dateB = new Date(b.createTime);
  return dateA - dateB; // 升序排序
};

// 监听排序事件
const handleSortChange = ({ column, prop, order }) => {
  if (order === 'ascending') {
    tableData.value = [...tableData.value].sort(sortCreateTime); // 对表格数据进行排序
  } else if (order === 'descending') {
    tableData.value = [...tableData.value].sort((a, b) => sortCreateTime(b, a)); // 降序排序
  }
};

// 传递删除的任务行
const selectedTask = ref(null);

const handleSelectionChange = (selectedRows) => {
  // 保存选中的任务行
  selectedTask.value = selectedRows[0];  // 假设每次只选中一行任务
};

// 控制添加任务的对话框
const dialogVisible = ref(false);

const taskForm = ref({
  taskName: '',
  taskNameXiangding: '',
  createTime: '',
  judgementModel: '',
  effectModel: '',
  judgementRule: '',
  judgementMethod: '',
  judgementModels: [''],
  effectModels: [''],
  judgementRules: [''],
});

// 控制动态生成下拉框的数量
const count = ref(0);

// 增加动态生成的下拉框组数
const increaseCount = () => {
  count.value += 1;
};

// 添加裁决模型下拉框
const addJudgementModel = () => {
  taskForm.value.judgementModels.push({ value: '' });
};

// 添加效果模型下拉框
const addEffectModel = () => {
  taskForm.value.effectModels.push({ value: '' });
};

// 添加裁决规则下拉框
const addJudgementRule = () => {
  taskForm.value.judgementRules.push({ value: '' });
};

// 编辑任务
const editTask = (task) => {
  taskForm.value = { ...task }; // 填充选中的任务数据到表单
  dialogVisible.value = true; // 打开对话框
};

// 提交任务
const submitTask = async () => {
  try {
    console.log("原始数据:", toRaw(taskForm.value));

    // 构建请求体
    const taskData = {
      task: {
        createTime: taskForm.value.createTime || "yyyy-MM-dd HH:mm:ss", // 如果没有创建时间则使用默认时间
        taskId: taskForm.value.id || 0, // 新增时 id 为 0，修改时会有 id
        taskName: taskForm.value.taskName || "", // 任务名称
        // remark: taskForm.value.remark || "", // 备注
        // traceTaskCode: taskForm.value.traceTaskCode || "" // 追踪任务编码
      },
      taskRuleRelList: [
        {
          id: 0, // 可以根据实际情况填写
          taskId: taskForm.value.id || 0, // 新增时 id 为 0，修改时会有 id
          modelId: 0, // 根据需要填充
          modelType: "", // 根据需要填充
          judgeMode: "", // 根据需要填充
          ruleId: 0 // 根据需要填充
        }
      ]
    };

    // 判断是新增任务还是编辑任务
    const isNewTask = !taskForm.value.id;

    // 使用静态的 URL 配置
    const baseUrl = "http://192.168.1.200:3001"; // API 基本 URL

    // 设置请求的 URL
    const url = isNewTask
        ? `${baseUrl}/judgeTask/add` // 新增任务的接口 URL
        : `${baseUrl}/judgeTask/update`; // 修改任务的接口 URL

    const method = "POST"; // 使用 POST 方法

    // 发送请求
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: isNewTask ? "添加记录" : "修改记录", // 请求描述
        request: {
          method,
          body: {
            mode: "raw",
            raw: JSON.stringify(taskData), // 请求体
            options: {
              raw: {
                language: "json",
              },
            },
          },
          url: {
            raw: url, // 使用静态的 URL 地址
            protocol: "http",
            host: ["192.168.1.200"], // 静态设置主机地址
            port: "3001", // 静态设置端口
            path: [isNewTask ? "judgeTask" : "judgeTask", isNewTask ? "add" : "update"],
            query: [],
            variable: [],
          },
        },
        description: isNewTask ? "添加记录" : "修改记录", // 请求描述
      }),
    });

    const result = await response.json();

    if (response.ok) {
      // 成功处理：获取分页列表并更新表格数据
      console.log("任务处理成功");

      // 获取分页列表数据
      const pageListResponse = await fetch(`${baseUrl}/judgeTask/pageList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current: 0, // 页码
          pageSize: 10, // 每页大小
          sortField: "", // 排序字段
          sortOrder: "", // 排序顺序
          taskName: "", // 搜索条件
        }),
      });

      const pageListResult = await pageListResponse.json();

      if (pageListResponse.ok) {
        // 更新表格数据
        tableData.value = pageListResult.items || [];
      } else {
        console.error("分页列表请求失败", pageListResult);
      }

      // 关闭对话框并清空表单
      dialogVisible.value = false;
      taskForm.value = {}; // 清空表单
    } else {
      // 错误处理：例如展示错误信息
      console.error("请求失败", result);
    }
  } catch (error) {
    console.error("保存任务失败", error);
  }
};

// const submitTask = async () => {
//   try {
//     console.log("原始数据:", toRaw(taskForm.value));
//
//     const taskData = {
//       id: taskForm.value.id || Date.now(), // 如果没有 id，自动生成一个唯一 id
//       taskName: taskForm.value.taskName || "taskName",
//       taskNameXiangding: taskForm.value.taskNameXiangding || "电子干扰",
//       createTime: taskForm.value.createTime || "2024年xx月xx日",
//       judgementRule: taskForm.value.judgementRule || "电子干扰",
//       judgementModel: taskForm.value.judgementModel || "电子干扰",
//       judgementEffect: taskForm.value.effectModel || "电子干扰",
//       judgementMethod: taskForm.value.judgementMethod || "电子干扰",
//       taskStatus: taskForm.value.taskStatus || "未开始",
//       actions: "编辑",
//     };
//
//     const existingIndex = tableData.value.findIndex(
//         (item) => item.id === taskForm.value.id
//     );
//
//     if (existingIndex !== -1) {
//       // 编辑任务：更新数据但保持位置不变
//       tableData.value[existingIndex] = taskData;
//     } else {
//       // 添加任务：插入到第一个位置
//       tableData.value.unshift(taskData);
//     }
//
//     // 触发 Vue 的响应式更新
//     tableData.value = [...tableData.value];
//
//     // 重置表单并关闭对话框
//     dialogVisible.value = false;
//     taskForm.value = {};
//   } catch (err) {
//     console.error("保存任务失败", err);
//   }
// };

// 关闭添加任务的对话框
const handleDialogClose = () => {
  taskForm.value = {
    id: 0,
    taskName: "",
    taskNameXiangding: "",
    createTime: "",
    judgementRule: "",
    judgementModel: "",
    judgementEffect: "",
    judgementMethod: "",
    taskStatus: "",
  };
  dialogVisible.value = false;
};

const selectedRow = ref<any>(null);  // 用来保存选中的行

// 当点击表格行时更新选中的行
const handleRowClick = (row: any) => {
  selectedRow.value = row;
  console.log("selectedRow.value", selectedRow.value)
};

// 删除任务
const deleteTask = async (row: any) => {
  if (row) {
    const index = tableData.value.findIndex(item => item.id === row.id);
    if (index !== -1) {
      console.log("tableData",tableData)
      tableData.value.splice(index, 1);  // 从数据中删除该行
    }
    console.log("selectedRow.value", selectedRow.value)
    selectedRow.value = null;  // 清空选中的行

  }
  // if (!row) {
  //   console.error('没有传入有效的行数据');
  //   return;
  // }
  // const taskId = row.id; // 获取任务ID
  // console.log("要删除的任务ID:", taskId);
  // try {
  //   // 发送请求删除数据
  //   // const response = await axios.delete(
  //   //     `http://192.168.1.200:3001/judgeTask/delete/${row.taskId}`
  //   // );
  //   // console.log("删除任务成功", response.data);
  //   // 删除本地数据
  //   const index = tableData.value.findIndex(item => item.id === taskId);
  //   if (index !== -1) {
  //     tableData.value.splice(index, 1); // 删除对应任务项
  //     console.log("删除后的数据:", tableData.value);
  //   } else {
  //     console.log("未找到要删除的任务");
  //   }
  // } catch (err) {
  //   console.error("删除任务失败", err);
  // }
};

// 执行按钮
const executeTask = (row) => {
  const taskIndex = tableData.value.findIndex((task) => task.id === row.id);
  if (taskIndex !== -1) {
    tableData.value[taskIndex].taskStatus = "已完成";
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
  background: linear-gradient(to bottom, rgba(9, 25, 37, 0.75), rgba(44, 65, 94, 0.75));
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
  background-color: rgb(21, 89, 151);
}

.form-container {
  width: 70%;
  margin: 0 auto;
}

.form-row {
  display: flex; /* 将 label 和 input 放在同一行 */
  align-items: center; /* 垂直对齐 */
  margin-bottom: 15px;
  gap: 5px; /* 给 label 和 input 之间设置一个间距 */
}

.form-column {
  flex: 1;
  margin-right: 20px;
}

.form-row.multi-input .form-column {
  flex-basis: 48%; /* 确保两列输入框有间距 */
}

/* label 放到输入框的左边 */
.input-label {
  font-size: 16px;
  color: #fff;
  margin-right: 5px; /* 给 label 和 input 之间留出5px */
  text-align: left; /* 对齐到左边 */
  display: block; /* 使 label 和输入框可以并排显示 */
  width: 100px; /* 给 label 设置固定宽度 */
  white-space: nowrap;
}

/* 输入框样式 */
.input-field {
  background-color: #000;
  color: #fff;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-grow: 1;
  min-width: 100px;
  width: 70%; /* 确保输入框充满剩余的空间 */
}

/* radio-group 样式 */
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

::v-deep .el-table__header-wrapper {
  position: relative;
  z-index: 10000;
}

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
