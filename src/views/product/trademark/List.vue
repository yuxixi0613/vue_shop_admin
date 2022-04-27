<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button></el-button>
    <el-table border style="width: 100%" :data="trademarkList" >
      <el-table-column
        prop="prop"
        label="序号"
        width="80"
        align="center"
        type="index"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
                            <!-- 
                                row,$index这两个名字是element-ui内部回传数据固定写好的
                                row代表当前遍历的这一项，遍历的数组当中的对象
                                $index代表遍历的这一项的下标
                             -->
          <template v-slot="{ row , $index}">
              <img :src="row.logoUrl" alt=" ">
          </template>
          
          
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
          <el-button type="warning" size="mini" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
      </el-table-column>
    </el-table>
    <el-pagination
        style="text-align:center"
        background

        @size-change="handleSizeChange"
        @current-change="getTrademarkList"

        layout="prev, pager, next, jumper, ->, total, sizes"

        :page-sizes="[3, 5, 10]"    

        :current-page="1" 
        :page-size="3"
        :total="0"
        :pager-count='7'
        >
    </el-pagination>
    <!-- 
        page-sizes这个属性可以让我们后期在页面取修改每页显示的数量
        这个属性数组当中第一项必须和page-size是一样的
        :page-sizes="[3, 5, 10]"  

        pager-count	页码按钮的数量，当总页数超过该值时会折叠  number  大于等于5且小于等于21的奇数  默认值7
     -->
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList() {
      try {
        const result = await this.$API.trademark.getPageList(
          this.page,
          this.limit
        );
        if (result.code === 20000 || result.code === 200) {
          this.trademarkList = result.data.records;
          this.total = result.data.total;
        } else {
          this.$message.error("获取品牌列表失败");
        }
      } catch (error) {
        this.$message.error("请求获取品牌列表失败");
      }
    },
    handleSizeChange(size) {},
    handleCurrentChange(page = 1) {},
  },
};
</script>

<style lang="sass" scoped>
</style>