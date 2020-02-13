<template>
  <div class="goods">
    <!-- 导入面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 导入卡片 -->
    <el-card class="box-card">
      <!-- 导入搜索框 -->
      <el-input
        placeholder="请输入内容"
        @change="inputChange"
        v-model="goodsQuestInfos.query"
        clearable
        class="input-with-select"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
      </el-input>
      <el-button type="primary" @click="addGoodsClick">添加商品</el-button>
      <!-- 插入表格 -->
      <el-table :data="tableDatas" style="width: 100%">
        <el-table-column type="index" label="#" width="40"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="480"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="80"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量(kg)" width="80"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="120">
          <template slot-scope="scope">{{scope.row.add_time | timeFilter}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="emidClick(scope.row)"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteClick(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsQuestInfos.pagenum"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="goodsQuestInfos.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 编辑商品信息对话框 -->
    <el-dialog title="编辑信息" :visible.sync="isShowToEmid" width="50%">
      <!-- 编辑商品内容 -->
      <el-form :model="emidForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="emidForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="emidForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="emidForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isShowToEmid = false">取 消</el-button>
        <el-button type="primary" @click="submitEmid">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表格数据
      tableDatas: [],
      //商品总页数
      total: null,
      //商品列表请求体数据
      goodsQuestInfos: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      //是否对话框
      isShowToEmid: false,
      //编辑商品会话框显示内容
      emidForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0
      },
      //编辑商品信息规则
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ]
      },
      //处于编辑的商品id
      goodsId: ""
    };
  },
  created() {
    this.getGoodsDatas();
  },
  methods: {
    //请求商品列表数据
    async getGoodsDatas() {
      const { data: res } = await this.$axios.get("/goods/", {
        params: this.goodsQuestInfos
      });
      if (res.meta.status !== 200)
        return this.$message.error("商品列表获取失败");
      this.tableDatas = res.data.goods;
      this.total = res.data.total;
    },
    //每页展示条数改变
    handleSizeChange(page) {
      this.goodsQuestInfos.pagesize = page;
      this.getGoodsDatas();
    },
    //当前显示页面的改变
    handleCurrentChange(current) {
      this.goodsQuestInfos.pagenum = current;
      this.getGoodsDatas();
    },
    //监听搜索按钮的点击
    searchClick() {
      this.getGoodsDatas();
    },
    //监听搜索框内容改变
    inputChange() {
      this.getGoodsDatas();
    },
    //监听添加商品按钮的点击
    addGoodsClick() {
      this.$router.push("/goods/add");
    },
    //监听编辑按钮的点击
    emidClick(scope) {
      //显示对话框
      this.isShowToEmid = true;
      this.emidForm = scope;
      this.goodsId = scope.goods_id;
    },
    //提交编辑商品信息
    async submitEmid() {
      //关闭对话框
      this.isShowToEmid = false;
      //提交修改的信息
      const { data: res } = await this.$axios.put(
        "/goods/" + this.goodsId,
        this.emidForm
      );
    },
    //删除商品
    async deleteClick(scope) {
      const isDelete = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      if (isDelete === "cancel") return this.$message.info("已取消删除");
      const { data: res } = await this.$axios.delete("goods/" + scope.goods_id);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getGoodsDatas();
    }
  }
};
</script>

<style>
.input-with-select {
  width: 300px;
  margin-right: 20px;
}
.cell {
  font-size: 10px;
}
</style>