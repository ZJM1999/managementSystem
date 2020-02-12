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
        <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="120">
          <template slot-scope="scope">{{scope.row.add_time | timeFilter}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
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
      //表格数据
      tableDatas: [],
      //商品列表请求体数据
      goodsQuestInfos: {
        query: "",
        pagenum: 1,
        pagesize: 10
      }
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
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("商品列表获取失败");
      this.tableDatas = res.data.goods;
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