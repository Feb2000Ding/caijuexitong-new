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
          <button class="button" style="margin-right: 20px" @click="editTask1">添加规则</button>
<!--          <button class="button" style="margin-right: 20px; background-color: #C33333" @click="deleteTask">删除</button>-->
        </div>
        <!-- el-table -->
        <div class="table-container">
          <el-table :data="paginatedData" class="custom-table" :head-cell-style="{ height: '80px', lineHeight: '80px' }" :row-style="{ height: '55px' }" ref="multipleTableRef">
            <el-table-column type="selection" width="60" />
            <el-table-column prop="ruleName" label="规则名称" width="210" />
            <el-table-column prop="judgeModel" label="裁决模型" width="280" />
            <el-table-column prop="createTime" label="创建时间" width="250" />
<!--            <el-table-column prop="parameters" label="参数" width="700" />-->
            <!-- 缩略显示模式：显示部分内容 -->
            <el-table-column v-if="!isExpandedView" prop="parameters" label="参数" width="700">
              <template #default="scope">
                <div
                    class="text-container"
                    :style="{ height: scope.row.isExpanded ? 'auto' : '40px' }"
                >
                    <div
                        class="text-content"
                        @click="toggleExpand(scope.row)"
                    >
                      {{ scope.row.parameters }}
                    </div>
                </div>
              </template>
            </el-table-column>

            <!-- 展开显示模式：显示完整内容 -->
            <el-table-column
                v-if="isExpandedView"
                prop="parameters"
                label="参数"
                width="700"
            >
              <template #default="scope">
                <div class="expanded-content" @click="toggleExpand(scope.row)">
                  <p>{{ scope.row.parameters }}</p>
                  <!-- 提示消息 -->
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="actions" label="操作">
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
import {defineProps, defineEmits, ref, onMounted, computed, toRaw, watch} from 'vue';
import  { ElTable, ElTableColumn, ElPagination, ElButton,  ElTooltip  } from 'element-plus';
import axios from "axios";
import { useTaskStore } from '../../stores/counter.js';
// import {toRaw} from "vue/dist/vue";

const props = defineProps({
  isShow: Boolean,  // 控制弹窗显示与否
  ruleData: Object,  // 规则数据
  editModeMessage: String,  // 编辑模式信息
});

const emit = defineEmits(['update:isShow', 'openNewRuleDialog']);

const closeModal = () => {
  emit('update:isShow', false);
};

const ruleIds = [35,36,37]; // 示例：需要传递的规则 ID 数组

// 导出规则的方法
const exportRule = async () => {
  try {
    // 定义请求 URL 和参数
    const url = "http://192.168.8.184:3001/api/calRule/export";
    const params = {
      ruleIds: ruleIds.join(","), // 将数组转换为逗号分隔的字符串
    };

    // 发送 GET 请求
    const response = await axios.get(url, { params, responseType: "blob" });

    // 检查响应并处理结果
    if (response.status === 200) {
      const blob = new Blob([response.data], { type: "application/octet-stream" });
      const downloadUrl = window.URL.createObjectURL(blob);

      // 动态指定文件名
      const defaultFilename = "规则导出文件.xlsx";
      const filename = prompt("请输入保存的文件名：", defaultFilename);

      if (filename) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename; // 使用用户输入的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.log("用户取消了文件名输入");
      }

      // 释放 URL 对象
      window.URL.revokeObjectURL(downloadUrl);
    } else {
      console.error("导出失败：", response);
    }
  } catch (error) {
    console.error("请求出错：", error);
  }
};

// const toggleExpand = (row) => {
//   row.isExpanded = !row.isExpanded;
// }

// 控制是否切换到展开视图
const isExpandedView = ref(false);

// 切换参数列的视图
function toggleExpand(row) {
  isExpandedView.value = !isExpandedView.value;  // 切换视图显示方式
  console.log("isExpandedView.value", isExpandedView.value)
}

// 获取简略文本
function getShortenedText(text) {
  const maxLength = 50;
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// 模拟表格数据
let tableData = ref([
  { id: 1, ruleName: 'xxxxxx方案1', createTime: '24-05-01 10:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 2, ruleName: 'xxxxxx方案2', createTime: '24-05-02 11:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 3, ruleName: 'xxxxxx方案3', createTime: '24-05-03 12:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 4, ruleName: 'xxxxxx方案4', createTime: '24-05-04 13:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 5, ruleName: 'xxxxxx方案5', createTime: '24-05-05 14:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 6, ruleName: 'xxxxxx方案6', createTime: '24-05-06 15:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 7, ruleName: 'xxxxxx方案7', createTime: '24-05-07 16:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 8, ruleName: 'xxxxxx方案8', createTime: '24-05-08 17:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 9, ruleName: 'xxxxxx方案9', createTime: '24-05-09 18:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 10, ruleName: 'xxxxxx方案10', createTime: '24-05-10 19:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 11, ruleName: 'xxxxxx方案11', createTime: '24-05-11 20:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 12, ruleName: 'xxxxxx方案12', createTime: '24-05-12 21:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 13, ruleName: 'xxxxxx方案13', createTime: '24-05-13 22:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 14, ruleName: 'xxxxxx方案14', createTime: '24-05-14 23:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 15, ruleName: 'xxxxxx方案15', createTime: '24-05-15 24:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 16, ruleName: 'xxxxxx方案16', createTime: '24-05-16 01:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 17, ruleName: 'xxxxxx方案17', createTime: '24-05-17 02:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 18, ruleName: 'xxxxxx方案18', createTime: '24-05-18 03:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 19, ruleName: 'xxxxxx方案19', createTime: '24-05-19 04:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' },
  // { id: 20, ruleName: 'xxxxxx方案20', createTime: '24-05-20 05:00', judgeModel: '电子干扰', parameters: '参数xx参数xxx参数xxxx', destroyLevel: '规则1', judgementMethod: '手动裁决', targetType: '效果模型1', finalLevel: '进行中', actions: '编辑' }
]);

// 格式化 parameters 字段（你可以修改这个函数来适应需要的格式）
const formatParameters = (targetTypes: any[]) => {
  let formattedParameters = "";

  targetTypes.forEach((target, targetIndex) => {
    if (targetIndex > 0) {
      formattedParameters += "\n"; // 每个目标类型之间换行
    }

    formattedParameters += `目标类型: ${target.targetType}\n`;

    target.groups.forEach((group: any) => {
      formattedParameters += `  指标组: ${group.groupName}\n`;

      group.indicators.forEach((indicator: any) => {
        const indicatorRanges = indicator.ranges.map((range: any) => {
          return `    ${indicator.indicatorName}: ${range.minValue} - ${range.maxValue} (权重: ${range.weight})`;
        }).join("\n");

        formattedParameters += indicatorRanges + "\n";
      });
    });
  });

  return formattedParameters;
};

// 请求表格数据的函数（如果需要从后端获取数据）
const fetchTableData = async () => {
  try {
    console.log("正在请求数据...");
    const response = await axios.post("http://192.168.8.184:3001/api/calRule/pageList", {
      current: 1,
      pageSize: 100,
    });

    const newData = response.data.data.records;
    tableData.value = [];

    // 定义一个映射对象来存储 ruleName 和 ruleId 的关系
    const ruleNameToIdMap = {};

    newData.forEach((record) => {
      const parameters = formatParameters(record.targetTypes);  // 格式化 parameters 字段

      // 将 ruleName 和 ruleId 存入映射对象
      ruleNameToIdMap[record.ruleName] = record.ruleId;

      tableData.value.push({
        id: record.id,
        ruleName: record.ruleName,
        judgeModel: record.modelName,
        createTime: record.createTime,
        parameters,
        destroyLevel: record.destroyLevel,
        judgementMethod: record.judgementMethod,
        targetType: record.targetType,
        finalLevel: record.finalLevel,
        actions: '编辑',
      });
    });

    // 将映射关系存储到组件的响应式变量或 Pinia store
    tableData.value.ruleNameToIdMap = ruleNameToIdMap;

    console.log("更新后的表格数据:", tableData.value);
  } catch (error) {
    console.error("请求数据失败:", error);
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
  model: '',        // 裁决模型
  addTime: '',      // 添加时间
  destroyLevel: '', // 毁伤等级
  targetType: '',   // 目标类型
  finalLevel: '进行中',
  actions: '编辑',
  damageLevels: [{ name: '', definition: 'level1' }],  // 毁伤等级列表
  conditions: [{ group: '', logic: 'AND', indicators: [{ minValue: '', maxValue: 'numeric', ranges: [] }] }], // 条件和指标列表
  ranges: [{ minValue: '', maxValue: '', destroyLevel: '' }],  // 范围
});

const type = ref('');
// 编辑任务
const editTask = (task) => {
  const taskStore = useTaskStore();
  taskStore.setTaskForm(task);
  taskForm.value = { ...task };
  // 获取选中行的 ruleName
  const ruleName = task.ruleName;
  console.log("ruleName",ruleName)

  // 获取对应的 ruleId
  const ruleId = tableData.value.ruleNameToIdMap[ruleName];
  console.log("ruleID",ruleId)

  // 使用 Pinia store 更新 ruleId
  taskStore.setRuleId(ruleId);
  // dialogVisible.value = true;
  // type.value = 'edit';
  emit('openNewRuleDialog1WithId', ruleId);
};

// 添加任务
const editTask1 = (task) => {
  // taskForm.value = { ...task }; // 填充选中的任务数据到表单
  // dialogVisible.value = true;  // 打开对话框
  type.value = 'add';
  emit('openNewRuleDialog', );
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
    console.log("要删除的项",tableData,tableData[row.id])
    console.log("要删除的任务对象:", row);  // 打印选中的任务对象
    console.log("要删除的任务ID:", row.id);  // 打印选中的任务的 id

    // 确认 tableData.value 和 row.id 是否匹配
    const index = tableData.value.findIndex(item => item.id === row.id);
    console.log("找到的索引:", index);  // 打印找到的索引，查看是否匹配正确

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
  if (props.isShow) {
    fetchTableData();
  }
});

watch(() => props.isShow, (newVal) => {
  if (newVal) {
    fetchTableData();
  }
});
</script>

<style scoped>
.task-modal {
  /*width: 60vw;*/
  /*height: 60vh;*/
  /*background: linear-gradient(to bottom, rgba(9, 25, 37, 0.75), rgba(44, 65, 94, 0.75));*/
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
  justify-content: flex-start;
  height: 100%;
  padding: 0 20px;
  padding-bottom: 20px;
  background: linear-gradient(to bottom, rgba(9, 25, 37, 0.75), rgba(44, 65, 94, 0.75));
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
  /*max-width: calc(100% );*/
  margin: 15px 15px;
  box-sizing: border-box;
  padding-bottom: 20px;
  flex-grow: 1;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
}

.table-container::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.custom-table {
  width: 100% !important;
}

::v-deep.el-table {
  width: 100% !important;
}

.text-container {
  transition: height 0.3s ease-in-out;
  overflow: hidden;
  height: 40px;
  display: block;
}

.text-container.expanded {
  height: auto;
}

.text-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  max-width: 100%;
}

.text-content.expanded {
  white-space: normal;
  word-wrap: break-word;
  max-width: 700px;
  line-height: 20px;
}

.text-content {
  max-width: 680px;
  height: 20px;
  line-height: 20px;
  display: block;
}

.text-content.expanded {
  max-width: 700px;
  line-height: normal;
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
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  /*margin-top: 20px;*/
  /*margin-bottom: 15px;*/
  /*display: flex;*/
  /*justify-content: center;*/
  /*align-items: center;*/
  /*bottom: 0;*/
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
