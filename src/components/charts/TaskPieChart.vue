<template>
  <div ref="taskPieChart" class="chart"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import * as echarts from 'echarts'

const taskPieChart = ref(null);
let chartInstance = null;

function setChartOption() {
  let data = [
    { value: 1930, name: '裁决任务成功' },
    { value: 650, name: '裁决任务失败' }
  ]

  return {
    color: [
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: 'rgba(35, 145, 255, 0.9)' // 0% 处的颜色
        }, {
          offset: 1, color: 'rgba(35, 145, 255, 0.3)' // 100% 处的颜色
        }],
        global: false // 缺省为 false
      },
      {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: 'rgba(17, 242, 241, 0.9)' // 0% 处的颜色
        }, {
          offset: 1, color: 'rgba(17, 242, 241, 0.3)' // 100% 处的颜色
        }],
        global: false // 缺省为 false
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
        align: 'center'
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
        })
        let value = 0
        if (res.length) {
          value = res[0].value
        }
        return name + '{b|' + '----' + '}' + '{a|' + value + '}';
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
  }
}

onMounted(() => {
  chartInstance = echarts.init(taskPieChart.value);
  chartInstance.setOption(setChartOption())
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>