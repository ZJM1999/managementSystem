<template>
  <div class="home">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div class="logo" @click="goHome">
          <img src="@/assets/images/logo.jpg" alt />
          <span>后台管理系统</span>
        </div>
        <el-button class="sign-out" type="info" @click="signOut">退出</el-button>
      </el-header>
      <el-container>
        <!-- 左侧栏 -->
        <el-aside :width="isCollapse?'64px':'200px'">
          <div class="toggleBtn" @click="toggleClick">{{isCollapse?'展开':'收起'}}</div>
          <!-- elementUI导航 -->
          <el-menu
            background-color="rgb(50,55,68)"
            text-color="#fff"
            active-text-color="rgb(60,118,201)"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            ref="menu"
            :router="true"
          >
            <!-- 导航一 -->
            <el-submenu :index="item.id.toString()" v-for="item in lists" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span class="list-text">{{item.authName}}</span>
              </template>
              <!-- 二级导航 -->
              <el-menu-item :index="'/'+i.path" v-for="i in item.children" :key="i.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{i.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧栏 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lists: [],
      iconObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      isCollapse: false
    };
  },
  created() {
    this.getListDatas();
  },
  methods: {
    signOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getListDatas() {
      const { data: res } = await this.$axios.get("/menus");
      this.lists = res.data;
      this.status = res.meta.status;
    },
    toggleClick() {
      this.isCollapse = !this.isCollapse;
    },
    goHome() {
      this.$router.push("/home");
      this.isCollapse = "false";
    }
  }
};
</script>

<style>
.el-header {
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(66, 66, 66);
}
.el-aside {
  background-color: rgb(50, 55, 68);
}
.el-main {
  background-color: rgb(234, 237, 242);
}
.el-container {
  height: 100%;
}
.el-menu {
  border-right: 0;
}
.home {
  height: 100vh;
}
.logo img {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  margin-right: 10px;
}
.logo {
  color: #fff;
  display: flex;
  font-size: 25px;
  cursor: pointer;
  align-items: center;
}
.list-text {
  margin-left: 9px;
}
.toggleBtn {
  color: #fff;
  padding: 5px 0;
  cursor: pointer;
  text-align: center;
  background-color: rgb(72, 81, 100);
}
</style>