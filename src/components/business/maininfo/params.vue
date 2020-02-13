<template>
  <div class="params">
    <!-- 导入面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 导入卡片 -->
    <el-card>
      <el-alert show-icon title="注意：只允许为三级分类修改相关参数" type="warning"></el-alert>
      <el-row>
        <el-col :span="3" class="change-cate">选择商品分类:</el-col>
        <el-col :span="8">
          <el-cascader
            expand-trigger="hover"
            :options="paramsLists"
            :props="props"
            v-model="goodsIds"
            @change="goodsChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 导入tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="tabActiveClick">
        <el-button
          type="primary"
          size="mini"
          class="btn-primary"
          @click="isShowToAdd = true"
          :disabled="goodsIds.length !== 3"
        >添加参数</el-button>
        <el-tab-pane label="动态参数" name="many">
          <!-- 动态参数表格 -->
          <el-table :data="manyDatas" style="width: 100%" border>
            <!-- 展开行 -->
            <el-table-column type="expand" width="50">
              <template slot-scope="scope">
                <!-- 展示tag数据 -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  class="tag-expand"
                  @close="closeTag(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 添加tag标签 -->
                <el-input
                  ref="saveTagInput"
                  class="input"
                  v-if="isShowInupt"
                  v-model="inputValue"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="50"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="modifyParams(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <!-- 静态参数表格 -->
          <el-table :data="onlyDatas" style="width: 100%" border>
            <!-- 展开行 -->
            <el-table-column type="expand" width="50">
              <template slot-scope="scope">
                <!-- 展示tag数据 -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  class="tag-expand"
                  @close="closeTag(index,scope.row)"
                >{{item}}</el-tag>
                <!-- 添加tag标签 -->
                <el-input
                  ref="saveTagInput"
                  class="input"
                  v-if="isShowInupt"
                  v-model="inputValue"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="50"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="modifyParams(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="isShowToAdd"
      width="50%"
      @close="closeAddFrom"
    >
      <!-- 添加属性对话框内容 -->
      <el-form ref="form" :model="addForm" :rules="rules" label-width="100px">
        <el-form-item :label="titleText" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isShowToAdd = false">取 消</el-button>
        <el-button type="primary" @click="addParamsClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog title="修改参数" :visible.sync="isShowToModify" width="50%" @close="closeAddFrom">
      <!-- 添加属性对话框内容 -->
      <el-form ref="form" :model="ModifyForm" :rules="rules" label-width="100px">
        <el-form-item :label="titleText" prop="new_cat_name">
          <el-input v-model="ModifyForm.new_cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isShowToModify = false">取 消</el-button>
        <el-button type="primary" @click="ModifyParamsClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取级联选择器商品列表数据
      paramsLists: [],
      //级联选择器选中的商品id数组
      goodsIds: [],
      //级联选择器的props属性，展示对应商品数据
      props: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //tabs标签处于活跃的一方对应的name
      activeName: "many",
      //存放当前选择的商品id
      activeId: "",
      //动态表单数据
      manyDatas: [],
      //静态表单数据
      onlyDatas: [],
      //添加属性对话框是否显示
      isShowToAdd: false,
      //表单输入框的绑定内容
      addForm: {
        cat_name: ""
      },
      //form表单规则
      rules: {
        cat_name: [{ required: true, message: "请输入内容", trigger: "blur" }],
        new_cat_name: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ]
      },
      //修改参数输入框的绑定内容
      ModifyForm: {
        new_cat_name: ""
      },
      //修改参数信息对话框的显示
      isShowToModify: false,
      //发起修改参数的数据请求说需要的信息
      urlInfo: {
        //分类id
        cat_id: "",
        //参数id
        attr_id: ""
      },
      //添加tag标签输入框绑定值
      inputValue: "",
      //展示tag标签,隐藏input输入框
      isShowInupt: false
    };
  },
  created() {
    this.getParamsDatas();
  },
  //添加属性对话框标题名称
  computed: {
    titleText() {
      return this.activeName === "many" ? "动态属性" : "静态属性";
    }
  },
  methods: {
    //请求级联选择器展示的商品数据
    async getParamsDatas() {
      const { data: res } = await this.$axios.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("商品列表数据获取失败");
      this.paramsLists = res.data;
    },
    //级联选择器选择变化触发的函数
    goodsChange() {
      this.activeId = this.goodsIds[this.goodsIds.length - 1];
      //但没有选择时return
      if (this.goodsIds.length === 0) return;
      //发起数据请求
      this.getTabsDatas();
    },
    //点击tabs标签页
    tabActiveClick() {
      //发起数据请求
      this.getTabsDatas();
    },
    //发起tabs标签页数据请求
    async getTabsDatas() {
      const { data: res } = await this.$axios.get(
        `categories/${this.activeId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) return this.$message.error("请选择商品分类");
      //将参数描述由字符串转成数组
      res.data.forEach(item => {
        if (item.attr_vals === "") return [];
        item.attr_vals = item.attr_vals.split(",");
      });

      //判断属于静态页面数据或动态页面数据
      if (this.activeName === "many") this.manyDatas = res.data;
      this.onlyDatas = res.data;
      // console.log(this.onlyDatas);
    },
    //重置对话框
    closeAddFrom() {
      this.$refs.form.resetFields();
    },
    //确认添加新数据，提交数据请求
    async addParamsClick() {
      const { data: res } = await this.$axios.post(
        `categories/${this.activeId}/attributes`,
        {
          attr_name: this.addForm.cat_name,
          attr_sel: this.activeName
        }
      );
      if (res.meta.status !== 201) return;
      this.$message.success("参数添加成功");
      //重新加载列表并关闭对话框
      this.getTabsDatas();
      this.isShowToAdd = false;
    },
    //商品参数修改
    modifyParams(scope) {
      const { cat_id, attr_id } = scope;
      //保存新参数名
      this.ModifyForm.new_cat_name = scope.attr_name;
      // console.log(scope);
      //保存请求需要的id
      this.urlInfo.cat_id = cat_id;
      this.urlInfo.attr_id = attr_id;
      //显示对话框
      this.isShowToModify = true;
    },
    //监听提交修改参数信息的点击,发起修改数据请求
    async ModifyParamsClick() {
      const { data: res } = await this.$axios.put(
        `categories/${this.urlInfo.cat_id}/attributes/${this.urlInfo.attr_id}`,
        {
          attr_name: this.ModifyForm.new_cat_name,
          attr_sel: this.activeName
        }
      );
      if (res.meta.status !== 200) return this.$message.error("参数修改失败");
      console.log(res);

      this.$message.success("参数修改成功");
      this.getTabsDatas();
      this.isShowToModify = false;
    },
    //监听删除按钮的点击
    async deleteParams(scope) {
      const isDelete = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      if (isDelete === "cancel") return this.$message.info("已取消删除");
      //确认删除 发起数据请求
      const { data: res } = await this.$axios.delete(
        `categories/${scope.cat_id}/attributes/${scope.attr_id}`
      );
      if (res.meta.status !== 200) return this.$message.error("参数删除失败");
      this.$message.success("删除成功");
      //刷新列表
      this.getTabsDatas();
    },
    //添加新标签的input输入框触发事件
    handleInputConfirm(scope) {
      //判断输入是否为空
      if (this.inputValue.length === 0) return;
      //判断原数组是否为空
      if (scope.attr_vals === "") {
        scope.attr_vals = [];
      }
      //将输入框的值添加到数组中
      scope.attr_vals.push(this.inputValue.trim());

      //发送数据请求保存提交修改参数
      this.putParams(scope);
      //显示按钮
      this.isShowInupt = false;
      //清空输入框的值
      this.inputValue = "";
    },
    //发送数据请求保存提交修改参数
    async putParams(scope) {
      const { data: res } = await this.$axios.put(
        `categories/${scope.cat_id}/attributes/${scope.attr_id}`,
        {
          attr_name: scope.attr_name,
          attr_sel: scope.attr_sel,
          attr_vals: scope.attr_vals.join(",")
        }
      );
      if (res.meta.status !== 200) return this.$message.error("数据保存失败");
    },
    //点击tag按钮显示input输入框
    showInput() {
      this.isShowInupt = true;
      //自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除tag标签
    closeTag(index, scope) {
      //删除数组上的数据
      scope.attr_vals.splice(index, 1);
      //请求最新数据
      this.putParams(scope);
    }
  }
};
</script>

<style>
.change-cate {
  line-height: 40px;
}
.btn-primary {
  margin-bottom: 10px;
}
.tag-expand {
  margin-right: 10px;
}
.input {
  width: 90px;
}
</style>