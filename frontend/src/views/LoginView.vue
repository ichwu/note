<template>
  <div class="login-container">
    <a-row type="flex" justify="center" align="center" style="height: 100vh;">
      <a-col :xs="22" :sm="16" :md="12" :lg="8">
        <form @submit.prevent="onSubmit">
          <a-input v-model="loginForm.username" placeholder="Username" />
          <a-input v-model="loginForm.password" placeholder="Password" type="password" />
          <a-button type="primary" htmlType="submit" long>Login</a-button>
        </form>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const loginForm = reactive({
  username: '',
  password: ''
});

const onSubmit = () => {
  // 登录逻辑
  console.log(loginForm);
};
</script>

<style scoped lang="sass"></style>
