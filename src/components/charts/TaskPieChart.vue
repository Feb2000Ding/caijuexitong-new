<template>
  <div ref="taskPieChart" class="chart"></div>
</template>

<script setup>
import {onMounted, onBeforeUnmount, watch, ref} from 'vue';
import * as echarts from 'echarts';

const taskPieChart = ref(null); // 引用容器
let chartInstance = null;

// 接收父组件传递的任务数据
const props = defineProps({
  taskData: {
    type: Object,
    required: true
  }
});

// 更新图表选项的函数
function setChartOption(data) {
  return {
    color: [
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: 'rgba(35, 145, 255, 0.9)'
        }, {
          offset: 1, color: 'rgba(35, 145, 255, 0.3)'
        }],
        global: false
      },
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: 'rgba(17, 242, 241, 0.9)'
        }, {
          offset: 1, color: 'rgba(17, 242, 241, 0.3)'
        }],
        global: false
      }
    ],
    title: {
      text: '',
      left: 'center',
      top: '32%',
      textStyle: {
        color: '#fff',
        fontSize: 17,
        lineHeight: 20,
        align: 'center',
        fontFamily: '"Arial Normal", "Arial", sans-serif'  // 设置字体
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: true,
      orient: 'vertical',
      left: '40%',
      top: 'center',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 40,
      textStyle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        fontFamily: '"Arial Normal", "Arial", sans-serif',  // 设置字体
        rich: {
          a: {
            fontSize: 24,
            color: '#fff'
          },
          b: {
            color: '#02FDFF'
          }
        }
      },
      formatter: function (name) {
        let res = data.filter((item) => {
          return item.name === name;
        });
        let value = 0;
        if (res.length) {
          value = res[0].value;
        }
        return name + '{b|' + '-------' + '}' + '{a|' + value + '}';
      }
    },
    series: [
      {
        name: '',
        type: 'pie',
        center: ['20%', '50%'],
        radius: ['75%', '85%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  };
}

// 图表初始化
onMounted(() => {
  chartInstance = echarts.init(taskPieChart.value);
  chartInstance.setOption(setChartOption([
    {value: props.taskData.success, name: '裁决任务成功'},
    {value: props.taskData.failure, name: '裁决任务失败'}
  ]));
});

// 监听 taskData 变化并更新图表
watch(() => props.taskData, (newData) => {
  if (chartInstance) {
    chartInstance.setOption(setChartOption([
      {value: newData.success, name: '裁决任务成功'},
      {value: newData.failure, name: '裁决任务失败'}
    ]));
  }
});

// 在组件销毁时销毁图表实例
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 400px;
}
</style>
