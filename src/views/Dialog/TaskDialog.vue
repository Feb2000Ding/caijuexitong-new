<template>
  <!-- 裁决任务管理弹窗-->
  <div v-if="isShow" class="task-modal-overlay">
    <div class="task-modal">
      <!--头部-->
      <div class="task-modal-header" v-drag>
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
          <button class="button" style="margin-left: 10px;" @click="editTask1">添加任务</button>
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
          <div
              class="custom-dialog"
              :style="dialogStyle"
              v-drag
          >
            <div
                class="dialog-header"
            >
              <span class="header-title">添加裁决任务</span>
              <button class="close-button" @click="dialogVisible = false">X</button>
            </div>
            <div class="dialog-content">
              <div class="form-container">
                <div class="form-row multi-input">
                  <div class="form-column">
                    <label for="taskName" class="input-label">*任务名称</label>
                    <input v-model="taskForm.taskName" type="text" id="taskName" class="input-field" placeholder="请输入任务名称" @input="checkTaskName" />
                    <span v-if="taskForm.taskNameError" class="error-message" style="color:white; font-size:16px; margin-left: 16px;">
                    {{ taskForm.taskNameError }}
                    </span>
                  </div>
                  <!--                  <div class="form-column">-->
                  <!--                    <label for="taskNameXiangding" class="input-label">*想定任务名称</label>-->
                  <!--                    <select v-model="taskForm.taskNameXiangding" id="taskNameXiangding" class="input-field">-->
                  <!--                      <option value="电子干扰">电子干扰</option>-->
                  <!--                      <option value="光学干扰">光学干扰</option>-->
                  <!--                      <option value="通信干扰">通信干扰</option>-->
                  <!--                      <option value="电子对抗">电子对抗</option>-->
                  <!--                    </select>-->
                  <!--                  </div>-->
                </div>

                <div class="form-row">
                  <div class="form-column">
                    <label for="createTime" class="input-label">*创建时间</label>
                    <input v-model="taskForm.createTime" type="text" id="createTime" class="input-field" placeholder="2024年xx月xx日" />
                  </div>
                </div>

                <hr class="divider" />

                <div v-for="(item, idx) in count" :key="idx">
                  <div class="form-row multi-input">
                    <div class="form-column">
                      <label :for="'judgementModel' + idx" class="input-label">*裁决模型</label>
                      <select :id="'judgementModel' + idx" class="input-field" v-model="taskForm.judgementModels[idx]" @change="onJudgementModelChange(idx)">
                        <option v-for="model in judgementModelOptions" :key="model.modelId" :value="model.modelId">{{ model.modelName }}</option>
                      </select>
                    </div>
                    <div class="form-column">
                      <label :for="'effectModel' + idx" class="input-label">*效果模型</label>
                      <select :id="'effectModel' + idx" class="input-field" v-model="taskForm.effectModels[idx]">
                        <option v-for="effect in effectModelOptions[idx]" :key="effect.effectId" :value="effect.effectId">{{ effect.effectName }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-row multi-input">
                    <div class="form-column">
                      <label :for="'judgementRule' + idx" class="input-label">*裁决规则</label>
                      <select :id="'judgementRule' + idx" class="input-field" v-model="taskForm.judgementRules[idx]">
                        <option v-for="rule in calculationRuleOptions[idx]" :key="rule.ruleId" :value="rule.ruleId">{{ rule.ruleName }}</option>
                      </select>
                    </div>
                    <div class="form-column">
                      <label class="radio-label">裁决方式</label>
                      <div class="radio-group">
                        <label>
                          <input type="radio" v-model="taskForm.judgementMethods[idx]" value="自动裁决" /> 自动裁决
                        </label>
                        <label>
                          <input type="radio" v-model="taskForm.judgementMethods[idx]" value="手动裁决" /> 手动裁决
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="add-button" @click="increaseCount">+</button>
<!--                <button class="add-button" @click="decreaseCount">-</button>-->
              </div>
            </div>

            <!-- 弹窗底部 -->
            <div class="dialog-footer">
              <button class="button" @click="dialogVisible = false">取消</button>
              <button class="button" @click="submitTask">确认</button>
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
            <el-table-column prop="taskName" label="任务名称" width="200" />
            <!--            <el-table-column prop="taskNameXiangding" label="想定任务名称" width="180" />-->
            <el-table-column
                prop="createTime"
                label="创建时间"
                width="180"
                sortablef
                :sort-method="sortCreateTime"
                @sort-change="handleSortChange"
            />
            <el-table-column prop="judgementModel" label="裁决模型" width="180" />
            <el-table-column prop="judgementRule" label="裁决规则" width="180" />
            <el-table-column prop="judgementMethod" label="裁决方式" width="180" />
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
            <el-table-column prop="actions" label="操作" >
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
import {defineProps, defineEmits, ref, onMounted, computed, toRaw, reactive} from 'vue';
import  { ElTable, ElTableColumn, ElPagination, ElButton  } from 'element-plus';
import axios from "axios";
import { useTaskStore } from '../../stores/counter.js';
import { API_BASE_URL } from '../../apiConfig.js';

// 配置环境变量
// const apiUrl = process.env.VUE_APP_API_BASE_URL;

const isTaskDialogVisible = ref(false);  // 控制任务执行弹窗显示
const taskDialogMessage = ref('');  // 弹窗内容

// 关闭弹窗
const closeTaskDialog = () => {
  isTaskDialogVisible.value = false;  // 关闭弹窗
};

const props = defineProps({
  isShow: Boolean
});

const emit = defineEmits(['update:isShow','openNewRuleDialog', 'taskCompleted']);

const closeModal = () => {
  emit('update:isShow', false);
};

// 弹窗位置
const dialogStyle = ref({
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  position: 'absolute',
});

// 自定义拖拽指令
const dragDirective = {
  mounted(el: HTMLElement) {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let intervalId: number | null = null; // 存储定时器的ID

    // 鼠标按下时记录初始位置
    el.addEventListener('mousedown', (e: MouseEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      isDragging = true;

      // 打印初始位置
      console.log(`初始位置: left=${el.style.left}, top=${el.style.top}`);

      // 启动定时器，0.5秒打印一次位置
      intervalId = setInterval(() => {
        if (isDragging) {
          // 打印当前位置
          console.log(`当前位置: left=${el.style.left}, top=${el.style.top}`);
        }
      }, 500); // 每500ms打印一次
    });

    // 鼠标移动时更新元素的位置
    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (isDragging) {
        const left = e.clientX - offsetX;
        const top = e.clientY - offsetY;
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
      }
    });

    // 鼠标释放时停止拖动
    document.addEventListener('mouseup', () => {
      isDragging = false;
      if (intervalId !== null) {
        // 停止定时器
        clearInterval(intervalId);
        intervalId = null;
      }
    });
  },
};

// 注册指令
defineExpose({
  directives: {
    drag: dragDirective
  }
});

// 模拟表格数据
let tableData = ref([
  // {
  //   taskId: 1,
  //   taskName: 'xxxxxx方案1',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-01 10:00',
  //   judgementModel: '电子干扰',
  //   judgementRule: '规则1',
  //   judgementMethod: '手动裁决',
  //   judgementEffect: '效果模型1',
  //   taskStatus: '进行中',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 2,
  //   taskName: 'xxxxxx方案2',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-02 11:00',
  //   judgementModel: '雷达反制',
  //   judgementRule: '规则2',
  //   judgementMethod: '自动裁决',
  //   judgementEffect: '效果模型2',
  //   taskStatus: '未开始',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 3,
  //   taskName: 'xxxxxx方案3',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-03 12:00',
  //   judgementModel: '电子干扰',
  //   judgementRule: '规则3',
  //   judgementMethod: '手动裁决',
  //   judgementEffect: '效果模型3',
  //   taskStatus: '已完成',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 4,
  //   taskName: 'xxxxxx方案4',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-04 13:00',
  //   judgementModel: '通信拦截',
  //   judgementRule: '规则4',
  //   judgementMethod: '手动裁决',
  //   judgementEffect: '多个效果模型',
  //   taskStatus: '进行中',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 5,
  //   taskName: 'xxxxxx方案5',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-05 14:00',
  //   judgementModel: '雷达反制',
  //   judgementRule: '规则5',
  //   judgementMethod: '自动裁决',
  //   judgementEffect: '效果模型5',
  //   taskStatus: '未开始',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 6,
  //   taskName: 'xxxxxx方案6',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-06 15:00',
  //   judgementModel: '电子干扰',
  //   judgementRule: '规则6',
  //   judgementMethod: '手动裁决',
  //   judgementEffect: '效果模型6',
  //   taskStatus: '已完成',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 7,
  //   taskName: 'xxxxxx方案7',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-07 16:00',
  //   judgementModel: '通信拦截',
  //   judgementRule: '规则7',
  //   judgementMethod: '自动裁决',
  //   judgementEffect: '效果模型7',
  //   taskStatus: '进行中',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 8,
  //   taskName: 'xxxxxx方案8',
  //   createTime: '24-05-08 17:00',
  //   judgementModel: '雷达反制',
  //   judgementRule: '规则8',
  //   judgementMethod: '手动裁决',
  //   judgementEffect: '效果模型8',
  //   taskStatus: '已完成',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 9,
  //   taskName: 'xxxxxx方案9',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-09 18:00',
  //   judgementModel: '电子干扰',
  //   judgementRule: '规则9',
  //   judgementMethod: '手动裁决',
  //   judgementEffect: '效果模型9',
  //   taskStatus: '未开始',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 10,
  //   taskName: 'xxxxxx方案10',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-10 19:00',
  //   judgementModel: '通信拦截',
  //   judgementRule: '规则10',
  //   judgementMethod: '自动裁决',
  //   judgementEffect: '效果模型10',
  //   taskStatus: '已完成',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 11,
  //   taskName: 'xxxxxx方案11',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-11 10:30',
  //   judgementModel: '雷达反制',
  //   judgementRule: '规则11',
  //   judgementMethod: '手动裁决',
  //   judgementEffect: '多个效果模型',
  //   taskStatus: '进行中',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 12,
  //   taskName: 'xxxxxx方案12',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-12 11:30',
  //   judgementModel: '电子干扰',
  //   judgementRule: '规则12',
  //   judgementMethod: '自动裁决',
  //   judgementEffect: '效果模型12',
  //   taskStatus: '未开始',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 13,
  //   taskName: 'xxxxxx方案13',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-13 12:30',
  //   judgementModel: '通信拦截',
  //   judgementRule: '规则13',
  //   judgementMethod: '手动裁决',
  //   judgementEffect: '效果模型13',
  //   taskStatus: '已完成',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 14,
  //   taskName: 'xxxxxx方案14',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-14 13:30',
  //   judgementModel: '雷达反制',
  //   judgementRule: '规则14',
  //   judgementMethod: '自动裁决',
  //   judgementEffect: '效果模型14',
  //   taskStatus: '进行中',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 15,
  //   taskName: 'xxxxxx方案15',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-15 14:30',
  //   judgementModel: '电子干扰',
  //   judgementRule: '规则15',
  //   judgementMethod: '手动裁决',
  //   judgementEffect: '效果模型15',
  //   taskStatus: '未开始',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 16,
  //   taskName: 'xxxxxx方案16',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-16 15:30',
  //   judgementModel: '通信拦截',
  //   judgementRule: '规则16',
  //   judgementMethod: '自动裁决',
  //   judgementEffect: '效果模型16',
  //   taskStatus: '已完成',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 17,
  //   taskName: 'xxxxxx方案17',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-17 16:30',
  //   judgementModel: '雷达反制',
  //   judgementRule: '规则17',
  //   judgementMethod: '手动裁决',
  //   judgementEffect: '多个效果模型',
  //   taskStatus: '进行中',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 18,
  //   taskName: 'xxxxxx方案18',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-18 17:30',
  //   judgementModel: '电子干扰',
  //   judgementRule: '规则18',
  //   judgementMethod: '自动裁决',
  //   judgementEffect: '效果模型18',
  //   taskStatus: '未开始',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 19,
  //   taskName: 'xxxxxx方案19',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-19 18:30',
  //   judgementModel: '通信拦截',
  //   judgementRule: '规则19',
  //   judgementMethod: '手动裁决',
  //   judgementEffect: '效果模型19',
  //   taskStatus: '已完成',
  //   actions: '编辑',
  // },
  // {
  //   taskId: 20,
  //   taskName: 'xxxxxx方案20',
  //   taskNameXiangding: '电子干扰',
  //   createTime: '24-05-20 19:30',
  //   judgementModel: '雷达反制',
  //   judgementRule: '规则20',
  //   judgementMethod: '自动裁决',
  //   judgementEffect: '效果模型20',
  //   taskStatus: '进行中',
  //   actions: '编辑',
  // },
]);

const tableDataRecords = ref([]);

// 下拉框选项
const judgementModels = ref([]);  // 裁决模型选项
const effectModels = ref([]);     // 效果模型选项
const judgementRules = ref([]);   // 裁决规则选项

// // 查询任务名是否重复
// const checkTaskNameDuplicate = (existingTaskNames) => {
//   // 获取输入框的任务名称
//   const taskName = taskForm.taskName.trim().toLowerCase();
//
//   // 检查任务名称是否重复
//   if (existingTaskNames.includes(taskName)) {
//     taskForm.taskNameError = '任务名称不能重复';
//   } else {
//     taskForm.taskNameError = '';
//   }
// };

const existingTaskNames = ref([]);

// 查询表格内容
const fetchTableData = async (
    taskName = "",
    current = 0,
    pageSize = 100,
    sortField = "",
    sortOrder = ""
) => {
  try {
    console.log("正在请求数据...");

    //请求体
    const response = await axios.post(`http://192.168.43.234:3001/api/judgeTask/pageList`, {
      current,
      pageSize,
      sortField,
      sortOrder,
      taskName,
    });

    console.log("response.data.data", response.data.data);

    tableDataRecords.value = response.data.data.records;
    console.log("tableDataRecords.value", tableDataRecords.value)

    const existingTaskNames = tableDataRecords.value.map(record => record.task.taskName.toLowerCase());
    // checkTaskNameDuplicate(existingTaskNames);
    console.log("existingTaskNames",existingTaskNames)

    const newData = response.data.data.records;
    console.log("response.data.data.records:", newData);

    // judgementModels.value = response.data.judgementModels || [];
    // effectModels.value = response.data.effectModels || [];
    // judgementRules.value = response.data.judgementRules || [];
    //
    // console.log("裁决模型选项：", judgementModels.value);
    // console.log("效果模型选项：", effectModels.value);
    // console.log("裁决规则选项：", judgementRules.value);

    // 裁决方式的映射
    const judgeModeMap = {
      auto: '自动裁决',
      manual: '手动裁决',
    };

    // 遍历返回的数据并更新 tableData
    newData.forEach((record, index) => {
      const judgementModel = (record.taskRuleRelVOList || [])
          .map(rule => rule.modelName)
          .filter(item => item)
          .join('; ') || '';

      const judgementRule = (record.taskRuleRelVOList || [])
          .map(rule => rule.ruleName)
          .filter(item => item)
          .join('; ') || '';

      const judgementMethod = (record.taskRuleRelVOList || [])
          .map(rule => judgeModeMap[rule.judgeMode])
          .filter(item => item)
          .join('; ') || '';

      const judgementEffect = (record.taskRuleRelVOList || [])
          .map(rule => rule.effectName)
          .filter(item => item)
          .join('; ') || '';


      if (tableData.value[index]) {
        tableData.value[index].taskId = record.task.id || tableData.value[index].taskId;
        tableData.value[index].taskName = record.task.taskName || tableData.value[index].taskName;
        // tableData.value[index].taskNameXiangding = record.task.remark || tableData.value[index].taskNameXiangding;
        tableData.value[index].createTime = record.task.createTime || tableData.value[index].createTime;
        tableData.value[index].taskStatus = record.task.status || tableData.value[index].taskStatus;


        tableData.value[index].judgementModel = judgementModel || tableData.value[index].judgementModel;
        tableData.value[index].judgementRule = judgementRule || tableData.value[index].judgementRule;
        tableData.value[index].judgementMethod = judgementMethod || tableData.value[index].judgementMethod;
        tableData.value[index].judgementEffect = judgementEffect || tableData.value[index].judgementEffect;
      } else {

        tableData.value.push({
          id: record.task.taskId || '',
          taskName: record.task.taskName || '',
          taskNameXiangding: record.task.remark || '',
          createTime: record.task.createTime || '',
          judgementModel: judgementModel || '光能模型',
          judgementRule: judgementRule || '',
          judgementMethod: judgementMethod || '',
          judgementEffect: judgementEffect || '',
          taskStatus: record.task.status || '',
          actions: '编辑',
        });
      }
    });

    // 如果返回数据少于本地默认数据长度，保留原有数据项，未更新的数据保持原样
    if (newData.length < tableData.value.length) {
      tableData.value.splice(newData.length);
    }

    console.log("更新后的表格数据:", tableData.value);
  } catch (err) {
    console.error("请求数据失败:", err);
  }
};

const checkTaskName = () => {
  // 如果输入的任务名称与现有任务名称重复，设置错误信息
  console.log(777777777777777777777777)
  if (existingTaskNames.value.includes(taskForm.taskName)) {
    console.log('存在')
    taskForm.taskNameError = '任务名称已存在';
  } else {
    taskForm.taskNameError = ''; // 没有重复时清除错误信息
    console.log("不存在")
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
    // 先确保 item.taskName 不是 undefined 或 null，并且是字符串
    return item.taskName && typeof item.taskName === 'string'
        ? item.taskName.toLowerCase().includes(searchKeyword.value.toLowerCase())
        : false; // 如果 taskName 不合法，则过滤掉该项
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

const taskForm = reactive({
  taskName: '',
  taskNameError: '',
  createTime: '',
  judgementModels: [] as string[],
  effectModels: [] as string[][],
  judgementRules: [] as string[],
  judgementMethods: [] as string[],
});

const judgementModelOptions = ref<string[]>([]); // 裁决模型的下拉选项
const effectModelOptions = ref<any[][]>([]); // 每个裁决模型对应的效果模型选项
const calculationRuleOptions = ref<any[][]>([]); // 每个裁决模型对应的裁决规则选项
const modelNameToIdMap = ref({}); // 存储裁决模型名称到 modelId 的映射
const ruleNameToIdMap = ref({}); // 存储规则名称到 ruleId 的映射

// 获取裁决任务选项
const fetchJudgementModels = async () => {
  try {
    const response = await axios.post('http://192.168.43.234:3001/api/judgeModel/pageList', {
      current: 0,
      pageSize: 100,
      sortField: '',
      sortOrder: '',
      modelName: '', // 可以根据需要传入 modelName 来筛选
      modelType: ''  // 可以根据需要传入 modelType 来筛选
    });

    if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
      // 提取 modelName 并赋值给下拉框
      judgementModelOptions.value = response.data.data.records.map((item) => ({
        modelId: item.modelId,
        modelName: item.modelName
      }));
      console.log("JudgementModels", response.data,  judgementModelOptions.value) ;

      // 创建映射关系：modelName -> modelId
      modelNameToIdMap.value = response.data.data.records.reduce((map, item) => {
        map[item.modelName] = item.modelId;
        return map;
      }, {});
      console.log("modelNameToIdMap.value", modelNameToIdMap.value);
    }
  } catch (error) {
    console.error("获取裁决模型失败:", error);
  }
};

const ruleRecords = ref([]);

// const ruleNameToIdMap = ref({});

// 获取效果模型和裁决规则
const fetchEffectModelsAndRules = async (modelName, index) => {
  try {
    const response = await axios.get('http://192.168.43.234:3001/api/judgeModel/getInfo', {
      params: {
        modelName: modelName
      }
    });

    if (response.data && response.data.data) {
      const { effectModels, calculationRules } = response.data.data;

      // 更新对应的效果模型和裁决规则
      effectModelOptions.value[index] = effectModels.map((effect) => ({
        effectId: effect.effectId,
        effectName: effect.effectName
      })) || [];

      calculationRuleOptions.value[index] = calculationRules.map((rule) => ({
        ruleId: rule.ruleId,
        ruleName: rule.ruleName
      })) || [];

      // 创建映射关系：ruleName -> ruleId
      ruleNameToIdMap.value[modelName] = calculationRules.reduce((map, rule) => {
        map[rule.ruleName] = rule.ruleId;
        return map;
      }, {});
      console.log("ruleNameToIdMap.value", ruleNameToIdMap.value);
    }
  } catch (error) {
    console.error("获取效果模型和裁决规则失败:", error);
  }
};

// 当裁决模型切换时触发效果模型和裁决规则选项的更新
const onJudgementModelChange = (index: number) => {
  const modelName = judgementModelOptions.value.find(model => model.modelId === taskForm.judgementModels[index])?.modelName;
  if (modelName) {
    fetchEffectModelsAndRules(modelName, index);
  }
};

// 控制动态生成下拉框的数量
const count = ref(1);

// 增加动态生成的下拉框组数
const increaseCount = () => {
  count.value++; // 增加组数
  taskForm.judgementModels.push('');  // 为每组裁决模型新增空项
  taskForm.effectModels.push('');     // 为每组效果模型新增空数组
  taskForm.judgementRules.push('');   // 为每组裁决规则新增空项
  taskForm.judgementMethods.push(''); // 为每组裁决方式新增空项
};

let endPoint = ref('');

// 编辑任务
const editTask = async (task) => {
  console.log("taskForm", taskForm);
  endPoint.value = 'update';

  const taskId = task.id || task.taskId;

  try {
    const response = await axios.get(`http://192.168.43.234:3001/api/judgeTask/view/${taskId}`);

    if (response.data.code === 0) {
      const taskData = response.data.data.task;
      const taskRuleRelVOList = response.data.data.taskRuleRelVOList;

      // 将任务详情信息赋值到表单
      Object.assign(taskForm, taskData);

      // 解析任务关联的裁决模型、效果模型和裁决规则
      taskForm.judgementModels = taskRuleRelVOList.map(item => item.modelName); // 使用 modelName 而不是 modelId
      taskForm.effectModels = taskRuleRelVOList.map(item => item.effectId);
      taskForm.judgementRules = taskRuleRelVOList.map(item => item.ruleId);
      taskForm.judgementMethods = taskRuleRelVOList.map(item => item.judgeMode);
      console.log("taskForm", taskForm)

      count.value = taskForm.judgementModels.length;

      // 动态获取效果模型和裁决规则
      for (let index = 0; index < taskForm.judgementModels.length; index++) {
        const modelName = taskForm.judgementModels[index];
        await fetchEffectModelsAndRules(modelName, index); // 根据模型名称获取下拉框选项
      }

      dialogVisible.value = true;
      console.log("taskForm", taskForm);
    } else {
      console.error('Error fetching task details:', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching task details:', error);
  }
};

// 添加
const editTask1 = (task) => {
  endPoint.value = 'add';

  // 初始化 taskForm 数据
  taskForm.judgementModels = task.judgementModel ? [task.judgementModel] : [''];
  taskForm.effectModels = task.judgementEffect ? [task.judgementEffect] : [''];
  taskForm.judgementRules = task.judgementRule ? [task.judgementRule] : [''];
  taskForm.judgementMethods = task.judgementMethod ? [task.judgementMethod] : [''];

  const now = new Date();
  const formattedDate = now.getFullYear() + '-' +
      (now.getMonth() + 1).toString().padStart(2, '0') + '-' +
      now.getDate().toString().padStart(2, '0') + ' ' +
      now.getHours().toString().padStart(2, '0') + ':' +
      now.getMinutes().toString().padStart(2, '0') + ':' +
      now.getSeconds().toString().padStart(2, '0');

  // 默认设置创建时间
  taskForm.createTime = formattedDate;

  // 更新count，确保表单项数量与数据一致
  count.value = taskForm.judgementModels.length;

  // 打开对话框
  dialogVisible.value = true;
};

// 提交任务
const submitTask = async () => {
  try {
    checkTaskName();
    if (taskForm.taskNameError) {
      // 如果任务名称已存在，阻止提交并显示错误
      console.error('任务名称已存在');
      return;
    }

    const newTaskData = {
      task: {
        taskId: '',
        createTime: taskForm.createTime || new Date().toLocaleString(),
        taskName: taskForm.taskName,
        remark: '默认',
        traceTaskCode: '101',
      },
      taskRuleRelList: []
    };

    // 裁决方式映射
    const judgeMethodMapping = {
      "手动裁决": "manual",
      "自动裁决": "auto"
    };

    // 遍历 taskForm 中的裁决模型、裁决规则等，填充 taskRuleRelList
    for (let i = 0; i < taskForm.judgementModels.length; i++) {
      const modelName = taskForm.judgementModels[i];
      const ruleId = taskForm.judgementRules[i];
      const judgeMethod = taskForm.judgementMethods[i];
      const judgeEffect = taskForm.effectModels[i];

      // 获取裁决模式
      const validJudgeMode = judgeMethodMapping[judgeMethod] || "manual";  // 选择裁决方式

      // 将 ruleId 和 modelId 等数据推送到 taskRuleRelList
      newTaskData.taskRuleRelList.push({
        modelId: modelName,  // 使用 modelName（裁决模型名称）直接传递
        modelType: judgeEffect,  // 裁决效果模型
        judgeMode: validJudgeMode,  // 裁决方式
        ruleId: ruleId  // 直接传递 ruleId
      });
      console.log("newTaskData.taskRuleRelList", newTaskData.taskRuleRelList);
    }

    console.log("taskForm.value.taskName ", taskForm.taskName);

    // 判断是新增任务还是编辑任务
    const endpoint = endPoint.value;
    console.log("endPoint", endPoint);
    console.log("typeof endPoint.value:", typeof endPoint.value);
    const method = taskForm.taskName ? 'POST' : 'POST';
    console.log("tableDataRecords", tableDataRecords.value);

    if (endPoint.value === 'update') {
      console.log(11111111111111111);
      // 将 tableDataRecords.value 转换为数组
      const records = Array.from(tableDataRecords.value);
      let foundTask = null;
      for (let i = 0; i < records.length; i++) {
        if (records[i].task.taskName === taskForm.taskName) {
          foundTask = records[i];
          break;
        }
      }
      if (foundTask) {
        newTaskData.task.taskId = foundTask.task.taskId;
        console.log("taskId", newTaskData.task.taskId);
        delete newTaskData.task.createTime;
      } else {
        console.error('未找到对应的任务');
        return;
      }
    }

    if (endpoint === 'add') {
      delete newTaskData.task.taskId;
    }

    // 提交任务数据
    const response = await fetch(`http://192.168.43.234:3001/api/judgeTask/${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTaskData)
    });

    const result = await response.json();
    if (response.ok) {
      console.log('任务保存成功', result);
      dialogVisible.value = false;
      fetchTableData();
    } else {
      // 当后端返回的响应不是200时弹出提示框
      console.error('任务保存失败', result);
      alert('任务保存失败，请重新输入');
    }
  } catch (error) {
    console.error('提交任务时发生错误', error);
    alert('发生错误，请稍后再试');
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
    // taskNameXiangding: "",
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
const executeTask = async (row) => {
  const taskName = row.taskName;  // 获取选中的任务名称

  // 先请求任务列表
  try {
    const response = await axios.post('http://192.168.43.234:3001/api/judgeTask/pageList', {
      current: 1,  // 这里的 current 和 pageSize 可以根据需要设置
      pageSize: 10,
      sortField: '',  // 可按需传入
      sortOrder: '',  // 可按需传入
      taskName: taskName,  // 用 taskName 进行筛选
    });

    // 假设返回的数据结构是： response.data.data.records
    const tasks = response.data.data.records;
    console.log("tasks", tasks)

    // 在任务列表中找到对应的任务
    const task = tasks.find((item) => item.task.taskName === taskName);

    if (task) {
      // 延迟 0.5 秒后发送事件
      setTimeout(() => {
        emit('taskCompleted', row);  // 发送任务完成事件
        emit('update:isShow', false);  // 关闭显示对话框

        // 准备请求体并发送到后端
        setTimeout(async () => {
          try {
            const requestData = {
              task: {
                createTime: task.task.createTime,  // 从获取到的任务数据中填充
                taskName: task.task.taskName,
                remark: task.task.remark || '',
                traceTaskCode: task.task.traceTaskCode || '101',  // 默认值或从任务中提取
              },
              taskRuleRelList: task.taskRuleRelVOList.map((model, index) => ({
                modelId: model.modelId,  // 假设 taskRuleRelVOList 是任务中的数组
                modelType: model.modelType || '',  // 如果有 modelType 字段
                judgeMode: model.judgeMode || 'manual',  // 如果有 judgeMode 字段
                ruleId: model.ruleId || 1,  // 默认 ruleId
              })),
            };

            // 发送 POST 请求到后端
            const executeResponse = await axios.post('http://192.168.43.234:3001/api/judgeTask/execute', requestData);
            if (executeResponse.status === 200) {
              console.log('请求成功', executeResponse.data);
              const responseData = executeResponse.data;
              console.log("responseData", responseData)
              const fromValue = executeResponse.data.data.from;
              console.log("fromValue", fromValue)
              const taskStore = useTaskStore();
              taskStore.setFrom(fromValue);
              taskStore.setResponseData(responseData);

              // 显示自定义弹窗
              taskDialogMessage.value = `任务执行成功! 返回数据: ${fromValue}`;
              console.log("taskDialogMessage", taskDialogMessage.value)
              isTaskDialogVisible.value = true;
              console.log("isTaskDialogVisible.value", isTaskDialogVisible.value)
              emit('taskExecuted', { fromValue, responseData });

              // 延迟 2 秒后更新任务状态为已完成
              setTimeout(() => {
                const taskIndex = tableData.value.findIndex((task) => task.id === row.id);
                if (taskIndex !== -1) {
                  tableData.value[taskIndex].taskStatus = '已完成';
                }
              }, 2000); // 延迟2秒更新任务状态

            } else {
              console.error('请求失败', executeResponse.data);
            }
          } catch (error) {
            console.error('执行任务时发生错误', error);
          }
        }, 500);  // 延迟500ms发送请求

      }, 500);  // 延迟500ms后发送 emit 事件

    } else {
      console.error('未找到对应的任务');
    }

  } catch (error) {
    console.error('获取任务列表时发生错误', error);
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
  fetchJudgementModels();
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
  position: fixed;
  /*z-index: 1000;*/
  height:80%;
  width:70%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-direction: column;
}

.task-modal-header {
  cursor: move;
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
  /*position: fixed;*/
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
}

.custom-dialog {
  background: white;
  width: 70%;
  height: 50%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dialog-header {
  height: 40px;
  background: linear-gradient(to bottom, #0F5B9D, #498ED7);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 10px;
}

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
}

.dialog-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: rgb(21, 89, 151);
}

.add-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid rgb(2, 253, 255);
  background-color: transparent;
  color: transparent;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  position: relative;
}

.add-button::before,
.add-button::after {
  content: "";
  position: absolute;
  background-color: rgb(2, 253, 255);
  width: 60%;
  height: 2px;
}

.add-button::before {
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
}

.add-button::after {
  transform: translate(-50%, -50%) rotate(90deg);
  top: 50%;
  left: 50%;
}

.add-button:hover {
  background-color: rgba(2, 253, 255, 0.2);
}

.add-button:active {
  background-color: rgba(2, 253, 255, 0.4);
}

.form-container {
  width: 70%;
  margin: 0 auto;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 5px;
}

.form-column {
  flex: 1;
  margin-right: 20px;
}

.form-row.multi-input .form-column {
  flex-basis: 48%;
}

.divider {
  border: none;
  height: 0.5px;
  width: 100%;
  background-color: white;
  margin-top: 40px;
  margin-bottom: 20px;
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
  border-radius: 6px;
  flex-grow: 1;
  min-width: 100px;
  width: 70%;
  outline: none;
}

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
  padding: 0 20px;
  box-sizing: border-box;
}

::v-deep.el-table {
  width: 100% !important;
}

.custom-table {
  width: 100% !important;
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

::v-deep .el-table .el-table__header th::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid transparent;
  background: linear-gradient(to center, rgba(27, 136, 215, 1), rgba(27, 136, 215, 0));
  z-index: -1;
  margin: -2px;
  border-radius: inherit;
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

/*!* 遮罩层样式 *!*/
/*.overlay {*/
/*  position: fixed;*/
/*  height: 500px;*/
/*  width: 500px;*/
/*  top: 0;*/
/*  left: 0;*/
/*  right: 0;*/
/*  bottom: 0;*/
/*  background: white;*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*  z-index: 1000;  !* 保证弹窗在最前面 *!*/
/*}*/

/*!* 弹窗样式 *!*/
/*.modal {*/
/*  background-color: white;*/
/*  padding: 20px;*/
/*  border-radius: 8px;*/
/*  width: 600px;*/
/*  max-height: 80%;*/
/*  overflow-y: auto;*/
/*  text-align: left;*/
/*  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);*/
/*  z-index: 1001;*/
/*}*/

/*!* 弹窗标题样式 *!*/
/*h3 {*/
/*  margin-bottom: 20px;*/
/*  font-size: 20px;*/
/*  font-weight: bold;*/
/*  color: #333;*/
/*}*/

/*!* 弹窗消息内容样式 *!*/
/*p {*/
/*  font-size: 16px;*/
/*  color: #555;*/
/*  margin-bottom: 20px;*/
/*}*/

/*!* 列表项样式 *!*/
/*.json-data ul {*/
/*  list-style-type: none;*/
/*  padding: 0;*/
/*}*/

/*.json-data li {*/
/*  margin-bottom: 10px;*/
/*}*/

/*.json-data li strong {*/
/*  color: #333;*/
/*  font-weight: 600;*/
/*}*/

/*!* 按钮样式 *!*/
/*.buttons {*/
/*  text-align: center;*/
/*  margin-top: 20px;*/
/*}*/

/*.buttons button {*/
/*  padding: 10px 20px;*/
/*  border: none;*/
/*  background-color: #007BFF;*/
/*  color: white;*/
/*  cursor: pointer;*/
/*  border-radius: 5px;*/
/*  font-size: 16px;*/
/*}*/

/*.buttons button:hover {*/
/*  background-color: #0056b3;*/
/*}*/
</style>
