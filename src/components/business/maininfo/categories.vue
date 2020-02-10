<template>
  <div class="categories">
    <!-- 导入面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 导入卡片 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary" class="add-cata-btn" @click="addCate">添加分类</el-button>
      <!-- 使用第三方组件 树状列表 -->
      <table-tree
        :data="cataDatas"
        :columns="columns"
        border
        :show-row-hover="false"
        :expand-type="false"
        :selection-type="false"
        :show-index="true"
        index-text="#"
      >
        <!-- 作用域插槽获取有效数据 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 作用域插槽获取排序信息 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 作用域插槽获取操作信息 -->
        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editClick(scope.row)">编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row)"
          >删除</el-button>
        </template>
      </table-tree>
      <!-- 分页组件导入 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="urlInfos.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="urlInfos.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
    </el-card>
    <!-- 导入添加分类对话框 -->
    <el-dialog title="提示" :visible.sync="isShowToCate" width="50%" @close="closeAddCate">
      <!-- 添加分类内容 -->
      <el-form :model="addCatelists" :rules="rules" label-width="100px" ref="formref">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addCatelists.cate_name" @change="handleChange"></el-input>
        </el-form-item>
        <el-form-item label="父类名称">
          <!-- 级联选择器 -->
          <el-cascader
            ref="cascaderRef"
            class="cascader-el"
            expand-trigger="hover"
            :options="cateTypeLists"
            :props="props"
            v-model="selectLists"
            @change="handleChange"
            :change-on-select="true"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isShowToCate = false">取 消</el-button>
        <el-button type="primary" @click="setAddCates">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="提示" :visible.sync="isShowToEdit" width="50%">
      <!-- 显示索要编辑的对象信息 -->
      <el-form ref="form" :model="editDatas" label-width="80px">
        <el-form-item label="编辑名称:">
          <el-input v-model="editDatas.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowToEdit = false">取 消</el-button>
        <el-button type="primary" @click="setEditInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //请求分类列表的url数据
      urlInfos: {
        pagenum: 1,
        pagesize: 5
      },
      //获取的分类列表数据
      cataDatas: [],
      //获取的列表总条数
      total: null,
      //定义树状图数据绑定
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk"
        },
        {
          label: "排序",
          type: "template",
          template: "sort"
        },
        {
          label: "操作",
          type: "template",
          template: "operation"
        }
      ],
      //是否显示添加分类对话框
      isShowToCate: false,
      //是否显示编辑对话框
      isShowToEdit: false,
      //添加分类输入框验证规则
      rules: {
        cate_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      addCatelists: {
        cate_name: ""
      },
      //type=2的分类数据
      cateTypeLists: [],
      //选中的分类id
      selectLists: [],
      //props级联选择器展示内容
      props: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //添加分类请求数据处理
      postDatas: {
        cat_name: "",
        cat_pid: null,
        cat_level: null
      },
      //保存编辑对象信息
      editDatas: {},
      //保存当前编辑对象的id
      editId: ""
    };
  },
  created() {
    this.getCateDatas();
  },
  methods: {
    //发起请求分类列表数据
    async getCateDatas() {
      const { data: res } = await this.$axios.get("categories", {
        params: this.urlInfos
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取分类列表信息失败");
      this.cataDatas = res.data.result;
      this.total = res.data.total;
    },
    //每页显示条数
    handleSizeChange(page) {
      this.urlInfos.pagesize = page;
      // console.log(page);
      this.getCateDatas();
    },
    //当前显示的页面
    handleCurrentChange(currents) {
      this.urlInfos.pagenum = currents;
      this.getCateDatas();
    },
    //添加分类绑定点击事件,发起post请求
    async addCate() {
      //请求展示的分类数据
      this.getcateDatasByType();
      //打开对话框
      this.isShowToCate = true;
    },
    //获取type为2的分类数据
    async getcateDatasByType() {
      const { data: res } = await this.$axios.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取分类数据失败");
      this.cateTypeLists = res.data;
    },
    //对分类数据进行对准接口处理
    handleChange() {
      // console.log(this.selectLists);
      this.postDatas.cat_name = this.addCatelists.cate_name;
      if (this.selectLists.length === 0) {
        this.postDatas.cat_pid = 0;
        this.postDatas.cat_level = 0;
      } else {
        this.postDatas.cat_pid = this.selectLists[this.selectLists.length - 1];
        this.postDatas.cat_level = this.selectLists.length;
      }
      // console.log(this.postDatas);
    },
    //关闭添加分类对话框触发重置对话框方法
    closeAddCate() {
      this.$refs.formref.resetFields();
      this.selectLists = [];
    },
    //提交分类修改结果
    setAddCates() {
      this.$refs.formref.validate(async valid => {
        if (!valid) return this.$message.error("表单验证失败");
        const { data: res } = await this.$axios.post(
          "categories",
          this.postDatas
        );
        this.getCateDatas();
        this.isShowToCate = false;
      });
    },
    //点击编辑按钮
    async editClick(scope) {
      //保存当前编辑对象Id
      this.editId = scope.cat_id;
      //获取索要编辑锁展示的对应信息
      const { data: res } = await this.$axios.get("categories/" + scope.cat_id);
      if (res.meta.status !== 200)
        return this.$message.error("获取该对象信息失败");
      this.editDatas = res.data;
      //显示对话框
      this.isShowToEdit = true;
    },
    //点击确认编辑内容并发起数据请求
    async setEditInfo() {
      const { data: res } = await this.$axios.put("categories/" + this.editId, {
        cat_name: this.editDatas.cat_name
      });
      if (res.meta.status !== 200) return this.$message.error("编辑内容失败");
      this.$message.success("内容编辑成功");
      this.getCateDatas();
      this.isShowToEdit = false;
    },
    //点击删除对象信息
    async deleteCate(scope) {
      const isDelete = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      // console.log(isDelete);
      // 判断用户时候确认删除
      if (isDelete === "cancel") return this.$message.info("已取消删除");
      const { data: res } = await this.$axios.delete(
        "categories/" + scope.cat_id
      );
      this.$message.success("该商品删除成功");
      //重新加载列表
      this.getCateDatas();
    }
  }
};
</script>

<style>
.el-icon-success {
  color: rgb(30, 194, 30);
}
.el-icon-error {
  color: rgb(247, 47, 47);
}
.add-cata-btn {
  margin-bottom: 10px;
}
.categories {
  min-width: 998px;
}
.cascader-el {
  width: 100%;
}
</style>