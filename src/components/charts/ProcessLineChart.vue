<template>
  <div ref="lineChart" class="chart"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import * as echarts from 'echarts'

const lineChart = ref(null);
let chartInstance = null;

function setChartOption(value) {
  let xLabel = ['12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00'];
  let dataArr = [
    {
      name: '通信干扰',
      data: [3500, 4300, 4140, 4680, 4350, 3470, 3800]
    },
    {
      name: '电子干扰',
      data: [2500, 3300, 2140, 2680, 3350, 2470, 2800]
    },
    {
      name: '光学干扰',
      data: [1500, 2300, 2240, 1180, 1350, 1470, 2600]
    }
  ]

  let seriesData = dataArr.map((item, index) => {
    return {
      name: item.name,
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: item.data,
      lineStyle: {
        width: 2
      },
    }
  })

  return {
    color: ['#2391FF', '#5AD8A6', '#FFC328'],
    tooltip: {
      show: true,
      trigger: 'axis',
      textStyle: {
        fontSize: 12,
      },
    },
    legend: {
      show: true,
      left: 'right',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 10,
      textStyle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
      },
    },
    grid: {
      show: false,
      top: 40,
      left: 20,
      right: 30,
      bottom: 10,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        textStyle: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 12,
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)',
          width: 1,
          type:'solid'
        }
      },
      data: xLabel,
    },
    yAxis: {
      type: 'value',
      name: '单位：个数',
      nameTextStyle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)',
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 12
        }
      },
    },
    series: seriesData
  }
}

onMounted(() => {
  chartInstance = echarts.init(lineChart.value);
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