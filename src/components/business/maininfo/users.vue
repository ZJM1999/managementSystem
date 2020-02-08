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
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="usersInfo.query"
            clearable
            @change="getSearch"
          >
            <el-button slot="append" icon="el-icon-search" @click="getSearch"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" round @click="addUsers">添加用户</el-button>
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
              @change="switchChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- 操作相关 -->
        <el-table-column label="操作" width="176">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="changeUserInfo(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="usersInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- dialog对话框导入 -->
    <el-dialog title="添加用户" :visible.sync="isShow" width="50%" @close="closeDialog">
      <!-- 注册内容 -->
      <el-form :model="formDatas" :rules="rules" ref="ruleref" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formDatas.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formDatas.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formDatas.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="formDatas.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 确认和取消 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 导入操作用户对话框 -->
    <el-dialog title="修改信息" :visible.sync="isShowToChange" width="50%" @close="closeChangeDialog">
      <!-- 修改的主要信息 -->
      <el-form ref="formref" :rules="rules" :model="formInfo" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="formInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="formInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 确认和取消 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowToChange = false">取 消</el-button>
        <el-button type="primary" @click="determineInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //自定义表单验证邮箱和手机号
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (regEmail.test(value)) return callback();
      callback(new Error("请输入有效的邮箱"));
    };
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3456789]\d{9}$/;
      if (regMobile.test(value)) return callback();
      callback(new Error("请输入有效的手机号"));
    };
    return {
      //显示用户默认样式
      usersInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      lists: [],
      total: null,
      isShow: false,
      isShowToChange: false,
      //添加用户的注册信息
      formDatas: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加用户对话框的表单验证
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 10, message: "长度在 5 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //修改用户的信息
      formInfo: {
        username: "",
        email: "",
        mobele: ""
      },
      id: null
    };
  },
  created() {
    this.getUsersInfo();
  },
  mounted() {
    this.watchEnter();
  },
  methods: {
    //获取列表和总条数
    async getUsersInfo() {
      const { data: res } = await this.$axios.get("/users", {
        params: this.usersInfo
      });
      this.lists = res.data.users;
      this.total = res.data.total;
    },
    //每页条数
    handleSizeChange(val) {
      this.usersInfo.pagesize = val;
      this.getUsersInfo();
    },
    //当前页数
    handleCurrentChange(val) {
      this.usersInfo.pagenum = val;
      this.getUsersInfo();
    },
    //搜索框
    getSearch() {
      this.getUsersInfo();
    },
    //搜索框请求数据
    async switchChange(state) {
      let id = state.id;
      let mg = state.mg_state;
      const { data: res } = await this.$axios.put(
        "users/" + id + "/state/" + mg
      );
      if (res.meta.status !== 200) {
        this.usersInfo.mg_state = !this.usersInfo.mg_state;
        this.$message.error("用户状态改变失败");
        return;
      }
      this.$message({
        message: "用户状态改变成功",
        type: "success"
      });
    },
    addUsers() {
      this.isShow = true;
    },
    //关闭对话框重置表单
    closeDialog() {
      this.$refs.ruleref.resetFields();
    },
    closeChangeDialog() {
      this.$refs.formref.resetFields();
    },
    //确定添加新用户，发起数据请求
    addUserInfo() {
      this.$refs.ruleref.validate(async valid => {
        if (!valid) return this.$message.error("表单校验失败");
        const { data: res } = await this.$axios.post("/users", this.formDatas);
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加用户失败");
        this.$message({
          message: "新用户添加成功",
          type: "success"
        });
        this.isShow = false;
        this.getUsersInfo();
      });
    },
    //修改用户信息
    async changeUserInfo(id) {
      const { data: res } = await this.$axios.get("/users/" + id);
      //对象的解构
      this.formInfo = res.data;
      //显示对话框
      this.isShowToChange = true;
      //保存当前修改的id值
      this.id = id;
    },
    //确认提交修改用户信息，发起put请求服务器数据更新
    determineInfo() {
      this.$refs.formref.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          "/users/" + this.id,
          this.formInfo
        );
        if (res.meta.status !== 200) return this.$message.error("信息更新失败");
        this.$message({
          message: "信息修改成功",
          type: "success"
        });
        //更新页面列表
        this.getUsersInfo();
        //关闭对话框
        this.isShowToChange = false;
      });
    },
    //监听回车键
    watchEnter() {
      // console.log(this)
      //绑定键盘回车键触发登陆按钮
      const _this = this;
      document.onkeydown = function(v) {
        if (v.keyCode === 13) _this.determineInfo();
      };
    },
    //删除用户
    async deleteUser(id) {
      const isDelete = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      //判断是否发送请求
      if (isDelete === "cancel") return this.$message.error("已取消删除");
      const { data: res } = await this.$axios.delete("/users/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除用户失败");
      this.$message.success("删除成功");
      //重新获取用户列表
      this.getUsersInfo();
    }
  }
};
</script>

<style>
</style>