<template>
    <div class="not-found">
        <div class="error-code">403</div>
        <div class="error-message">您没有权限访问该页面</div>
      <router-link to="/" class="back-link">
        返回首页
      </router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  };
  </script>
  
  <style scoped>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    background-color: #f8f9fa;
    color: #333;
  }
  
  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #C02430;
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
  
  .back-link {
    display: inline-block;
    background-color: #C02430;
    color: #fff;
    padding: 0.8rem 2rem;
    border-radius: 30px;
    text-decoration: none;
    transition: background-color 0.3s;
  }
  
  .back-link:hover {
    background-color: #9a1c27;
  }
  </style>
  