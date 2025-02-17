<template>
  <div>
    <h1>WebSocket 测试</h1>
    <div v-if="connectionStatus">连接已建立</div>
    <div v-else>等待连接...</div>
    <button @click="sendMessage">发送消息</button>
    <div>接收到的消息：{{ receivedMessage }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      socket: null,
      connectionStatus: false,
      receivedMessage: ''
    };
  },
  mounted() {
    // 创建 WebSocket 连接
    this.socket = new WebSocket('ws://192.168.43.234:3001/api/ws/judge/standard');

    // 监听连接成功事件
    this.socket.onopen = () => {
      console.log('WebSocket 连接已建立');
      this.connectionStatus = true;
    };

    // 监听接收到的消息
    this.socket.onmessage = (event) => {
      console.log('接收到消息:', event.data);
      this.receivedMessage = event.data;
    };

    // 监听连接关闭事件
    this.socket.onclose = () => {
      console.log('WebSocket 连接已关闭');
      this.connectionStatus = false;
    };

    // 监听错误事件
    this.socket.onerror = (error) => {
      console.log('WebSocket 发生错误:', error);
    };
  },
  methods: {
    sendMessage() {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send('Hello, server!');
      } else {
        console.log('WebSocket 连接未建立');
      }
    }
  }
};
</script>

<style scoped>
/* 你可以在这里添加样式 */
</style>