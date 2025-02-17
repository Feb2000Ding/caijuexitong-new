<template>
  <div class="rule-example-panel">
    <div class="panel-header">
      <h3 class="head-text">规则案例示意</h3>
      <div class="close-button" @click="closePanel">×</div>
    </div>
    <div class="panel-content">
     <div class="content-text">
       <ul>
         <li>目标类型：主体结构
           <ul>
             <li>指标组：主体结构指标组
               <ul>
                 <li>操作符：AND</li>
                 <li>指标：
                   <ul>
                     <li>出光范围
                       <ul>
                         <li>最小值：120，最大值：180，权重：1</li>
                         <li>最小值：180，最大值：240，权重：1.1</li>
                         <li>最小值：240，最大值：300，权重：1.2</li>
                         <li>最小值：300，最大值：500，权重：1.3</li>
                       </ul>
                     </li>
                     <li>倒靶功率密度
                       <ul>
                         <li>最小值：50，最大值：80，权重：1</li>
                         <li>最小值：80，最大值：120，权重：1.1</li>
                         <li>最小值：120，最大值：200，权重：1.2</li>
                         <li>最小值：200，最大值：1000，权重：1.3</li>
                       </ul>
                     </li>
                   </ul>
                 </li>
               </ul>
             </li>
             <li>最终指标：倒靶功率密度
               <ul>
                 <li>最小值：80，最大值：100，伤害等级：无效</li>
                 <li>最小值：100，最大值：120，伤害等级：致眩</li>
                 <li>最小值：120，最大值：140，伤害等级：致盲</li>
                 <li>最小值：140，最大值：160，伤害等级：</li>
               </ul>
             </li>
           </ul>
         </li>

         <li>目标类型：太阳能板
           <ul>
             <li>指标组：太阳能板指标组
               <ul>
                 <li>操作符：AND</li>
                 <li>指标：
                   <ul>
                     <li>出光范围
                       <ul>
                         <li>最小值：180，最大值：210，权重：1</li>
                         <li>最小值：210，最大值：240，权重：1.1</li>
                         <li>最小值：240，最大值：270，权重：1.2</li>
                         <li>最小值：270，最大值：300，权重：1.3</li>
                       </ul>
                     </li>
                     <li>倒靶功率密度
                       <ul>
                         <li>最小值：30，最大值：70，权重：1</li>
                         <li>最小值：70，最大值：100，权重：1.1</li>
                         <li>最小值：100，最大值：150，权重：1.2</li>
                         <li>最小值：150，最大值：800，权重：1.3</li>
                       </ul>
                     </li>
                   </ul>
                 </li>
               </ul>
             </li>
             <li>最终指标：倒靶功率密度
               <ul>
                 <li>最小值：80，最大值：100，伤害等级：无效</li>
                 <li>最小值：100，最大值：120，伤害等级：致眩</li>
                 <li>最小值：120，最大值：140，伤害等级：致盲</li>
                 <li>最小值：140，最大值：160，伤害等级：</li>
               </ul>
             </li>
           </ul>
         </li>

         <li>目标类型：光学器件
           <ul>
             <li>指标组：光学器件指标组
               <ul>
                 <li>操作符：AND</li>
                 <li>指标：
                   <ul>
                     <li>出光范围
                       <ul>
                         <li>最小值：80，最大值：100，权重：1</li>
                         <li>最小值：100，最大值：120，权重：1.1</li>
                         <li>最小值：120，最大值：140，权重：1.2</li>
                         <li>最小值：140，最大值：160，权重：1.3</li>
                       </ul>
                     </li>
                     <li>倒靶功率密度
                       <ul>
                         <li>最小值：0，最大值：10，权重：1</li>
                         <li>最小值：10，最大值：20，权重：1.1</li>
                         <li>最小值：20，最大值：30，权重：1.2</li>
                         <li>最小值：30，最大值：50，权重：1.3</li>
                         <li>最小值：50，最大值：100，权重：1.4</li>
                       </ul>
                     </li>
                   </ul>
                 </li>
               </ul>
             </li>
             <li>最终指标：倒靶功率密度
               <ul>
                 <li>最小值：80，最大值：100，伤害等级：无效</li>
                 <li>最小值：100，最大值：120，伤害等级：致眩</li>
                 <li>最小值：120，最大值：140，伤害等级：致盲</li>
                 <li>最小值：140，最大值：160，伤害等级：层裂</li>
               </ul>
             </li>
           </ul>
         </li>

         <li>目标类型：表面涂层
           <ul>
             <li>指标组：表面涂层指标组
               <ul>
                 <li>操作符：AND</li>
                 <li>指标：
                   <ul>
                     <li>出光范围
                       <ul>
                         <li>最小值：60，最大值：70，权重：1</li>
                         <li>最小值：70，最大值：80，权重：1.1</li>
                         <li>最小值：80，最大值：90，权重：1.2</li>
                         <li>最小值：90，最大值：100，权重：1.3</li>
                       </ul>
                     </li>
                     <li>倒靶功率密度
                       <ul>
                         <li>最小值：5，最大值：10，权重：1</li>
                         <li>最小值：10，最大值：15，权重：1.1</li>
                         <li>最小值：15，最大值：25，权重：1.2</li>
                         <li>最小值：25，最大值：50，权重：1.3</li>
                       </ul>
                     </li>
                   </ul>
                 </li>
               </ul>
             </li>
             <li>最终指标：倒靶功率密度
               <ul>
                 <li>最小值：80，最大值：100，伤害等级：无效</li>
                 <li>最小值：100，最大值：120，伤害等级：致眩</li>
                 <li>最小值：120，最大值：140，伤害等级：致盲</li>
                 <li>最小值：140，最大值：160，伤害等级：</li>
               </ul>
             </li>
           </ul>
         </li>
       </ul>

     </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits();

const closePanel = () => {
  emit('close');
};
</script>

<style scoped>
.rule-example-panel {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*background-color: white;*/
  /*border: 1px solid #ccc; !* 添加边框 *!*/
  min-width: 468px;
  z-index: 9999999;
}

.panel-header {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(11, 40, 71, 0.8);
  border-bottom: 1px solid #ccc;
}

.close-button {
  color: #01E3FF;
  font-size: 25px;
  font-style: normal;
  font-weight: 1200;
  right: 10px;
  top: 5px;
  position: absolute;
}

.head-text {
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  color: white;
  margin: 0;
}

.content-text {
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  color: white;
  text-align: left;
  padding: 10px;
}

.panel-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding: 10px;
  background-color: rgba(11, 40, 71, 0.8);
  border: 0.3px solid rgba(28, 117, 186, 1);
  width: 100%;
  height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.panel-content::-webkit-scrollbar {
  width: 8px;
}

.panel-content::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.panel-content::-webkit-scrollbar-track {
  background-color: transparent;
}

.panel-content p {
  margin: 0;
  padding: 0;
}

.panel-content button {
  margin-top: 15px;
  width: 120px;
  height: 32px;
  background-color: rgba(1, 64, 87, 1);
  border: none;
  border-radius: 4px;
  box-shadow: none;
  color: #A3C7EA;
  font-size: 14px;
}
</style>