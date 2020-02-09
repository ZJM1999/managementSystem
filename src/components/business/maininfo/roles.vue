<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 卡片 -->
    <el-card>
      <!-- 表格内容 -->
      <el-table :data="roleLists" style="width: 100%">
        <!-- 展开所有权限 -->
        <el-table-column type="expand" width="60">
          <template slot-scope="scope">
            <!-- 左边1列  一级权限的渲染 -->
            <el-row
              :class="['row-bottom',index1 == 0?'row-top':'']"
              v-for="(item1,index1) in scope.row.children"
              :key="index1"
            >
              <el-col :span="5">
                <el-tag closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 右边两列 -->
              <el-col :span="19">
                <!-- 二级权限的渲染 -->
                <el-row
                  v-for="(item2,index2) in item1.children"
                  :key="index2"
                  :class="['row-bottom']"
                >
                  <el-col :span="6">
                    <el-tag closable type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限的渲染  第三次for循环是给标签循环-->
                  <el-col :span="18">
                    <el-tag
                      @close="closeTag(scope.row,item3.id)"
                      closable
                      type="warning"
                      v-for="(item3,index3) in item2.children"
                      :key="index3"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 设置对应index值 -->
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="290">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRights(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="提示" :visible.sync="isRights" width="50%" @close="closeRights">
      <!-- 树形控件 -->
      <el-tree
        :data="treeLists"
        :props="treeRights"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checkedKeys"
        ref="tree"
      ></el-tree>
      <span slot="footer">
        <el-button @click="isRights = false">取 消</el-button>
        <el-button type="primary" @click="setRightsBuyId">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleLists: [],
      rightId: null,
      isRights: false,
      //树形控件数据
      treeLists: [],
      treeRights: {
        children: "children",
        label: "authName"
      },
      //默认选中的复选框
      checkedKeys: []
    };
  },
  created() {
    this.getRoleDatas();
  },
  methods: {
    //获取角色列表数据
    async getRoleDatas() {
      const { data: res } = await this.$axios.get("roles/");
      if (res.meta.status !== 200) return this.$message.error("获取列表失败");
      this.roleLists = res.data;
    },
    //请求删除角色权限数据
    async closeTag(scope, itemId) {
      const isDelete = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      if (isDelete === "cancel") return this.$message.info("已取消删除");
      const { data: res } = await this.$axios.delete(
        `roles/${scope.id}/rights/${itemId}`
      );
      if (res.meta.status !== 200) return this.$message.error("取消权限失败");
      this.$message.success("权限取消成功");
      //重新加载列表不折叠
      scope.children = res.data;
    },
    //获取展示tree型数据
    async setRights(scope) {
      //保存当前用户id
      this.rightId = scope.id;
      const { data: res } = await this.$axios.get("rights/tree");
      console.log(res);
      this.treeLists = res.data;
      //获取默认选中状态
      this.getChecked(scope, this.checkedKeys);
      //点击弹出对话框
      this.isRights = true;
    },
    //确定分配权限
    async setRightsBuyId() {
      let keys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ].join(",");
      // console.log(keys);
      const { data: res } = await this.$axios.post(
        `roles/${this.rightId}/rights`,
        {
          rids: keys
        }
      );
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("权限修改失败");
      this.$message.success("权限修改成功");
      this.getRoleDatas();
      this.isRights = false;
    },
    //定义递归函数获取默认选中状态
    getChecked(node, arr) {
      if (!node.children) return arr.push(node.id);
      node.children.forEach(item => this.getChecked(item, arr));
    },
    //监听分配权限对话框关闭清除默认选中数组
    closeRights() {
      this.checkedKeys = [];
    }
  }
};
</script>

<style>
.row-bottom {
  border-bottom: 1px solid #eee;
}
.row-top {
  border-top: 1px solid #eee;
}
.el-tag {
  margin: 5px;
}
</style>