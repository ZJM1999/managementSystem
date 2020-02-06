<template>
  <div class="home">
    <el-button type="info" @click="signOut">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    signOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<style>
</style>