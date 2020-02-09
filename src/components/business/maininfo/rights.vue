<template>
  <div class="rights">
    <!-- 面包屑导入 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片部分 -->
    <el-card>
      <!-- 导入table表单 -->
      <el-table :data="rightLists" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
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
      rightLists: []
    };
  },
  created() {
    this.getRightDatas();
  },
  methods: {
    //请求权限列表
    async getRightDatas() {
      const { data: res } = await this.$axios.get("rights/list");
      this.rightLists = res.data;
    }
  }
};
</script>

<style>
</style>