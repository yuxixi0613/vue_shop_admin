<template>
  <div>
    <el-card>
      <CategorySelector
        :isShowList="isShowList"
        @changeCategory="changeCategory"
      ></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px">
      <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
      <el-table style="width: 100%" border :data="spuList">
        <el-table-column label="序号" width="80px" type="index" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称" width="width">
        </el-table-column>
        <el-table-column prop="description" label="SPU描述" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template v-slot="{ row, $index }" }}>
            <HintButton
              type="success"
              icon="el-icon-plus"
              size="mini"
            ></HintButton>
            <HintButton
              type="warning"
              icon="el-icon-edit"
              size="mini"
            ></HintButton>
            <HintButton
              type="info"
              icon="el-icon-info"
              size="mini"
            ></HintButton>
            <HintButton
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></HintButton>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[3, 5, 10]"
        :page-size="limit"
        layout=" sizes, prev, pager, next, jumper,total"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Spu",
  data() {
    return {
      isShowList: true,

      page: 1,
      limit: 2,
      total: 0,
      cForm: {},

      //请求获取spu的分页列表数据
      spuList: [],
    };
  },
  methods: {
    changeCategory(cForm) {
      this.cForm = cForm;
      //当拿到category3Id发请求
      if (cForm.category3Id) {
        this.getSpuList();
      }
    },
    //获取spu的分页列表数据
    async getSpuList() {
      try {
        const result = await this.$API.spu.getList(
          this.page,
          this.limit,
          this.cForm.category3Id
        );
        if (result.code === 20000 || result.code === 200) {
          this.$message.success("获取spu的分页列表成功");
          this.spuList = result.data.records;
          this.total = result.data.total;
        } else {
          this.$message.error("获取spu的分页列表失败");
        }
      } catch (error) {
        this.$message.error("获取spu的分页列表失败");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>