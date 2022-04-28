<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory"></CategorySelector>
    </el-card>

    <el-card style="margin-top: 20px">
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" @click="showAddDiv"
          >添加属性</el-button
        >

        <el-table style="width: 100%" border :data="attrList">
          <el-table-column
            label="序号"
            width="80px"
            align="center"
            type="index"
          >
          </el-table-column>

          <el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column>

          <el-table-column prop="prop" label="属性值列表" width="width">
            <template v-slot="{ row, $index }">
              <el-tag
                type="danger"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150px">
            <HintButton
              type="warning"
              size="mini"
              icon="el-icon-edit"
              title="修改"
            ></HintButton>
            <HintButton
              type="danger"
              size="mini"
              icon="el-icon-delete"
              title="删除"
            ></HintButton>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShowList">
        <el-form :inline="true">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrForm.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
        <el-table border style="width: 100%; margin: 20px 0" :data="attrForm.attrValueList">
          <el-table-column
            prop="prop"
            label="序号"
            width="80px"
            align="center"
            type="index"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      attrList: [],
      cForm: {},

      isShowList: true,

      attrForm: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    changeCategory(cForm) {
      this.cForm = cForm;
      if (cForm.category3Id) {
        this.getAttrList();
      } else {
        this.attrList = [];
      }
    },
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this.cForm;
      try {
        const result = await this.$API.attr.getList(
          category1Id,
          category2Id,
          category3Id
        );
        if (result.code === 20000 || result.code === 200) {
          this.attrList = result.data;
        } else {
          this.$message.error("获取平台属性列表失败");
        }
      } catch (error) {
        this.$message.error("请求获取平台属性列表失败");
      }
    },

    //点击添加属性
    showAddDiv() {
      this.isShowList = false;

      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryId: this.cForm.category3Id,
        categoryLevel: 3,
      };
    },

    //点击添加属性值
    addAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: 0,
        valueName: "", 
      })
    },
  },
};
</script>

<style lang="sass" scoped>
</style>