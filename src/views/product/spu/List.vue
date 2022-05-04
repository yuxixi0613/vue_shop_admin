<template>
  <div>
    <el-card>
      <CategorySelector
        :isShowList="isShowList"
        @changeCategory="changeCategory"
      ></CategorySelector>
    </el-card>
    <el-card style="margin-top: 20px">
      <!--这是列表内容 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="showAddSpuForm"
          :disabled="!cForm.category3Id"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="spuList">
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          >
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
                title="添加sku"
                @click="showAddSkuForm(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="showUpdateSpuForm(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看spu的sku列表"
              ></HintButton>
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除spu"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page="page"
          :page-sizes="[2, 5, 7]"
          :page-size="limit"
          layout="prev, pager, next, jumper , -> , sizes , total"
          :total="total"
        >
        </el-pagination>
      </div>

      <!-- 这是添加或修改spu的 -->
      <!--<SpuForm v-show="isShowSpuForm" ref="spu" :visible="isShowSpuForm" @update:visible="isShowSpuForm = $event" ></SpuForm> -->
      <!-- 
          父组件给子组件属性传递数据后面添加.sync子组件修改数据 
          需要分发事件 @click = $emit("update:属性名",要更新的数据) 
      -->
      <SpuForm
        v-show="isShowSpuForm"
        ref="spu"
        :visible.sync="isShowSpuForm"
      ></SpuForm>

      <!-- 这是添加sku的 -->
      <SkuForm v-show="isShowSkuForm"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./components/SpuForm.vue";
import SkuForm from "./components/SkuForm.vue";
export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      isShowList: true,

      isShowSpuForm: false,
      isShowSkuForm: false,

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
      } else {
        this.spuList = [];
      }
    },
    //获取spu的分页列表数据
    async getSpuList(page = 1) {
      this.page = page;
      try {
        const result = await this.$API.spu.getList(
          this.page,
          this.limit,
          this.cForm.category3Id
        );
        if (result.code === 20000 || result.code === 200) {
          // this.$message.success("获取spu的分页列表成功");
          this.spuList = result.data.records;
          this.total = result.data.total;
        } else {
          this.$message.error("获取spu的分页列表失败");
        }
      } catch (error) {
        this.$message.error("获取spu的分页列表失败");
      }
    },

    // 每页数量改变回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },

    //点击添加spu按钮
    showAddSpuForm() {
      this.isShowSpuForm = true;
      this.$refs.spu.getInitAddSpuFormData();
    },

    //点击修改spu
    showUpdateSpuForm(row) {
      this.isShowSpuForm = true;
      this.$refs.spu.getInitUpdateSpuFormData(row.id);
    },

    //点击添加sku按钮
    showAddSkuForm(row) {
      this.isShowSkuForm = true;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>