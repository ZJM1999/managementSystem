<template>
  <div class="users">
    <!-- 导入面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 导入卡片 -->
    <el-card class="box-card">
      <!-- 导入栅格格式 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 导入搜索框 -->
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" round>添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 导入表单 -->
      <el-table :data="lists" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <!-- 状态相关 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="rgb(64,158,255)"
              inactive-color="rgb(220,223,230)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- 操作相关 -->
        <el-table-column label="操作" width="176">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usersInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      lists: []
    };
  },
  created() {
    this.getUsersInfo();
  },
  methods: {
    async getUsersInfo() {
      const { data: res } = await this.$axios.get("/users", {
        params: this.usersInfo
      });
      this.lists = res.data.users;
    }
  }
};
</script>

<style>
.users {
  padding: 20px;
}
</style>