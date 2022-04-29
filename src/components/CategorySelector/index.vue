<template>
  <el-form :inline="true" :model="cForm" :disabled="!isShowList">
    <el-form-item label="一级分类">
      <!-- select当中的v-model收集的是选中的option的value的值 -->
      <el-select
        v-model="cForm.category1Id"
        placeholder="请选择"
        @change="handlerCategory1"
      >
        <!-- change事件回调参数是：目前的选中值 -->
        <el-option
          :label="c1.name"
          :value="c1.id"
          v-for="c1 in category1List"
          :key="c1.id"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="二级分类">
      <!-- select当中的v-model收集的是选中的option的value的值 -->
      <el-select
        v-model="cForm.category2Id"
        placeholder="请选择"
        @change="handlerCategory2"
      >
        <!-- change事件回调参数是：目前的选中值 -->
        <el-option
          :label="c2.name"
          :value="c2.id"
          v-for="c2 in category2List"
          :key="c2.id"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="三级分类">
      <!-- select当中的v-model收集的是选中的option的value的值 -->
      <el-select
        v-model="cForm.category3Id"
        placeholder="请选择"
        @change="handlerCategory3"
      >
        <!-- change事件回调参数是：目前的选中值 -->
        <el-option
          :label="c3.name"
          :value="c3.id"
          v-for="c3 in category3List"
          :key="c3.id"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CategorySelector",
  props:['isShowList'],
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],

      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    // 获取1级分类的数据列表
    async getCategory1List() {
      try {
        const result = await this.$API.category.getCategory1();
        if (result.code === 20000 || result.code === 200) {
          this.category1List = result.data;
        } else {
          this.$message.error("获取一级分类列表失败");
        }
      } catch (error) {
        this.$message.error("请求获取一级分类列表失败");
      }
    },
    // 当选中1级分类的时候，选中值发生改变事件的回调
    async handlerCategory1(category1Id) {
      // 选中1级清空23级
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      this.category2List = []
      this.category3List = []

      // 选中1级，触发自定义事件
      this.$emit("changeCategory", this.cForm);

      //发请求 请求获取二级的分类列表
      try {
        const result = await this.$API.category.getCategory2(category1Id);
        if (result.code === 20000 || result.code === 200) {
          this.category2List = result.data;
        } else {
          this.$message.error("获取二级分类列表失败");
        }
      } catch (error) {
        this.$message.error("获取二级分类列表失败");
      }
    },

    // 当选中2级分类的时候，选中值发生改变事件的回调
    async handlerCategory2(category2Id) {
      // 选中2级清空3级
      this.cForm.category3Id = "";
      this.category3List = [];

      // 选中2级，触发自定义事件
      this.$emit("changeCategory", this.cForm);
      try {
        const result = await this.$API.category.getCategory3(category2Id);
        if (result.code === 20000 || result.code === 200) {
          this.category3List = result.data;
        } else {
          this.$message.error("获取三级分类列表失败");
        }
      } catch (error) {
        this.$message.error("请求获取三级分类列表失败");
      }
    },

    // 当选中3级分类的时候，选中值发生改变事件的回调
    handlerCategory3(category3Id) {
      // 选中3级，触发自定义事件
      this.$emit("changeCategory", this.cForm);
    },
  },
  mounted() {
    this.getCategory1List();
  },
};
</script>

<style lang="scss" scoped>
</style>