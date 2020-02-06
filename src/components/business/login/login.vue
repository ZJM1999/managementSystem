<template>
  <div class="login-container">
    <div class="login-content">
      <!-- 头像 -->
      <div class="login-img">
        <img src="@/assets/images/timg.jpg" alt />
      </div>
      <!-- 输入框部分 -->
      <el-form
        label-width="80px"
        class="el-form"
        :rules="loginRules"
        ref="loginFormRef"
        :model="loginDatas"
      >
        <el-form-item label="用户名" prop="username">
          <el-input prefix-icon="el-icon-s-custom" v-model="loginDatas.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginDatas.password" type="password"></el-input>
        </el-form-item>

        <el-form-item class="sign-reset">
          <el-button type="primary" @click="signClick">登录</el-button>
          <el-button type="info" @click="resetFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginDatas: {
        username: "admin",
        password: "123456"
      },
      //登陆框输入规则
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    // console.log(this)
    //绑定键盘回车键触发登陆按钮
    const _this = this;
    document.onkeydown = function(v) {
      if (v.keyCode === 13) _this.signClick();
    };
  },
  methods: {
    //验证表单
    resetFrom() {
      // console.log(this)
      this.$refs.loginFormRef.resetFields();
    },
    signClick() {
      //登陆前预验证
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.post("login", this.loginDatas);
        if (res.meta.status !== 200) return this.$message.error("登陆失败");
        this.$message({
          message: "登陆成功",
          type: "success"
        });
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    }
  }
};
</script>

<style lang='less' scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background-color: #2b4b6b;
}
.login-content {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  //定位
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .login-img {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    border: 8px solid transparent;
    background-color: #fff;
    box-shadow: 0 0 10px #eee;
    //定位
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
.el-form {
  padding-top: 80px;
  padding-right: 20px;

  .sign-reset {
    padding-left: 200px;
  }
}
</style>