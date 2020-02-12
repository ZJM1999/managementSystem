<template>
  <div class="add">
    <!-- 导入面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 导入卡片 -->
    <el-card class="box-card">
      <!-- 消息提示 -->
      <el-alert title="添加商品信息" type="info" show-icon center></el-alert>
      <!-- 步骤条 -->
      <el-steps class="step-style" :active="activeId - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- form表单包裹 -->
      <el-form
        :model="goodsForm"
        label-position="top"
        :rules="rules"
        ref="ruleFormRef"
        label-width="100px"
      >
        <!-- 标签页导入 -->
        <el-tabs
          :before-leave="tabLeave"
          v-model="activeId"
          tab-position="left"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 基本信息内容模块 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_name">
              <!-- 级联选择器 -->
              <el-cascader
                expand-trigger="hover"
                :options="cateLists"
                :props="props"
                v-model="goodsForm.goods_cat"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 商品参数主要信息 -->
            <el-form-item v-for="(i,x) in this.cateDatas" :key="x" :label="i.attr_name">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="i.attr_vals">
                <el-checkbox border v-for="(item,index) in i.attr_vals" :key="index" :label="item"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 商品属性内容 -->
            <el-form-item
              :label="item.attr_name"
              v-for="(item,index) in this.onlyLists"
              :key="index"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 商品图片上传 -->
            <el-upload
              :action="imgUploadUrl"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :on-preview="handleView"
              multiple
              :limit="3"
              list-type="picture"
              :headers="headerInfo"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog title="预览" :visible.sync="isShowView" width="50%">
      <img :src="viewUrl" alt class="view-img" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowView = false">取 消</el-button>
        <el-button type="primary" @click="isShowView = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //步骤条活跃id
      activeId: "0",
      //级联选择器数据列表
      cateLists: [],
      //form表单验证规则
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ]
      },
      //表单数据
      goodsForm: {
        goods_name: "",
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_cat: [],
        pics: []
      },
      //级联选择器显示内容
      props: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //复选框组展示数据
      cateDatas: [],
      //保存商品属性数据
      onlyLists: [],
      //图片上传url
      imgUploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      //手动设置图片上传请求头
      headerInfo: { Authorization: sessionStorage.getItem("token") },
      //预览图片url
      viewUrl: "",
      //显示预览图片对话框
      isShowView: false
    };
  },
  created() {
    this.getCateDatas();
  },
  methods: {
    //获取级联选择器要展示的数据
    async getCateDatas() {
      const { data: res } = await this.$axios.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("级联选择器数据列表获取失败");
      this.cateLists = res.data;
      // console.log(res);
    },
    //监听tab离开的事件
    tabLeave() {
      if (this.activeId === "0" && this.goodsForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    //监听tab点击分别发起对应请求
    async tabClick() {
      //判断发起商品参数数据请求
      if (this.activeId === "1" && this.goodsForm.goods_cat.length === 3) {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("数据列表获取失败");
        //for循环取出每一项的attr_vals，转成数组
        res.data.forEach(item => (item.attr_vals = item.attr_vals.split(",")));
        this.cateDatas = res.data;
      }
      //判断发起商品属性数据请求
      if (this.activeId === "2" && this.goodsForm.goods_cat.length === 3) {
        const { data: res2 } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        // console.log(res2);
        this.onlyLists = res2.data;
      }
    },
    //获取上传图片服务器返回的response
    handleSuccess(response) {
      // console.log(response);
      const picObj = { pic: response.data.tmp_path };
      this.goodsForm.pics.push(picObj);
      // console.log(this.goodsForm.pics);
    },
    //移除图片钩子
    handleRemove(file, fileList) {
      // console.log(file);
      //取出删除文件的临时路径
      const url = file.response.data.tmp_path;
      //查询数组对应的一项返回index
      const index = this.goodsForm.pics.findIndex(item => item.pic === url);
      //根据index删除对应项
      this.goodsForm.pics.splice(index, 1);
      // console.log(this.goodsForm.pics);
    },
    //点击弹出预览图片对话框
    handleView(file) {
      // console.log(file);
      this.viewUrl = file.response.data.url;
      //显示预览对话框
      this.isShowView = true;
    }
  },

  computed: {
    //获取三级分类id
    cateId() {
      if (this.goodsForm.goods_cat.length === 3) {
        return this.goodsForm.goods_cat[2];
      }
    }
  }
};
</script>

<style>
.el-step__title {
  font-size: 11px;
}
.step-style {
  margin: 10px 0 20px;
}
.view-img {
  width: 100%;
}
</style>