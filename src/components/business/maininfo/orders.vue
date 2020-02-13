<template>
  <div class="orders">
    <!-- 导入面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 导入卡片 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <!-- 表格数据 -->
      <el-table :data="goodsLists" style="width: 100%" border>
        <el-table-column type="index" label="#" width="40"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="160">
          <template slot-scope="scope">{{scope.row.create_time | timeFilter}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="emidClick(scope.row)"></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showLogistics(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog title="修改地址" :visible.sync="isShowaddress" width="50%" @close="closeChangeCity">
      <!-- 表单部分 -->
      <el-form :rules="rules" :model="address" label-width="100px" ref="formRef">
        <el-form-item label="省市区/县" prop="city">
          <el-cascader
            class="cascader-width"
            expand-trigger="hover"
            :options="citydata"
            clearable
            v-model="address.city"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="cityInfo">
          <el-input v-model="address.cityInfo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowaddress = false">取 消</el-button>
        <el-button type="primary" @click="isShowaddress = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息对话框 -->
    <el-dialog title="物流进度" :visible.sync="isShowLogistics" width="50%">
      <!-- 导入时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in logisticsInfos"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from "@/assets/address/citydata.js";
export default {
  data() {
    return {
      //请求订单信息请求体数据
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      //请求的订单数据组
      goodsLists: [],
      //总条数
      total: 0,
      //是否显示编辑对话框
      isShowaddress: false,
      //表单验证
      rules: {
        city: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        cityInfo: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },
      //城市数据
      citydata,
      //地址绑定值
      address: {
        city: "",
        cityInfo: ""
      },
      //物流进度对话框的显示
      isShowLogistics: false,
      //物流信息数据
      logisticsInfos: []
    };
  },
  created() {
    this.getOrdersDatas();
  },
  methods: {
    //请求订单数据
    async getOrdersDatas() {
      const { data: res } = await this.$axios.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("订单数据获取失败");
      this.goodsLists = res.data.goods;
      this.total = res.data.total;
    },
    //监听编辑按钮点击
    emidClick(scope) {
      //显示对话框
      this.isShowaddress = true;
    },
    //监听修改城市信息对话框的关闭，清空对话框
    closeChangeCity() {
      this.$refs.formRef.resetFields();
      // console.log(typeof (this.$refs.formRef));
    },
    //监听显示物流进度按钮的点击
    async showLogistics(scope) {
      this.isShowLogistics = true;
      const { data: res } = await this.$axios.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200)
        return this.$message.error("获取物流信息失败");
      this.logisticsInfos = res.data;
    }
  }
};
</script>

<style>
.input-with-select {
  margin-bottom: 10px;
  width: 380px;
}
.cascader-width {
  width: 100%;
}
</style>