<template>
  <div>
    <el-card>
      <CategorySelector
        @changeCategory="changeCategory"
        :isShowList="isShowList"
      ></CategorySelector>
    </el-card>

    <el-card style="margin-top: 20px">
      <div v-show="isShowList">
        <el-button
          :disabled="!cForm.category3Id"
          type="primary"
          icon="el-icon-plus"
          @click="showAddDiv"
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
            <template v-slot="{ row, $index }">
              <HintButton
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="修改"
                @click="showUpdateDiv(row)"
              ></HintButton>
              <el-popconfirm
                :title="`你确定要删除${row.attrName}吗?`"
                @onConfirm="deleteAttr(row)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  title="删除"
                ></HintButton>
              </el-popconfirm>
            </template>
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
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrForm.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="attrForm.attrValueList"
        >
          <el-table-column
            prop="prop"
            label="序号"
            width="80px"
            align="center"
            type="index"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template v-slot="{ row, $index }">
              <div>
                <el-input
                  placeholder="请输入属性值名称"
                  v-model="row.valueName"
                  size="mini"
                  v-if="row.isEdit"
                  :ref="$index"
                  @blur="toLook(row)"
                  @keyup.13.native="toLook(row)"
                ></el-input>
                <span
                  v-else
                  @click="toEdit(row, $index)"
                  style="display: block; width: 100%"
                >
                  {{ row.valueName }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                :title="`你确定要删除${row.valueName}吗？`"
                @onConfirm="attrForm.attrValueList.splice($index, 1)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="save"
          :disabled="!attrForm.attrValueList.length"
          >保存</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
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

      // isEdit:true    这个标识应该在属性值对象中去添加
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

      //清空数据并收集categoryId
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
        isEdit: true,
      });

      //自动获取焦点
      //在页面最近一次更新完成（即table多了一行）之后再调回调
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },

    //点击列表页的修改
    showUpdateDiv(row) {
      this.isShowList = false;

      //这里因为attrForm对象内部还有对象类型的数据(attrValueList)，因此需要深拷贝
      this.attrForm = cloneDeep(row);

      //

      this.attrForm.attrValueList.forEach((item) => {
        this.$set(item, "isEdit", false);
        // item.isEdit = false
      });
    },

    //点击span把span变成input
    toEdit(row, index) {
      row.isEdit = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },

    //失焦或回车的判断，且把input变为span
    toLook(row) {
      //判断为空的清空，则重置输入框
      if (row.valueName.trim() === "") {
        row.valueName = "";
        return;
      }
      //判断是否和已有的属性值重复
      let isRepeat = this.attrForm.attrValueList.some((item) => {
        // !!! 除去自身再去看有没有  否则一直是重复的
        if (row !== item) {
          return item.valueName === row.valueName;
        }
      });
      if (isRepeat) {
        this.$message.error("输入的属性值名称不能重复");
        row.valueName = "";
        return;
      }
      if (row.isEdit) {
        row.isEdit = false;
      }
    },

    //删除属性
    async deleteAttr(row) {
      try {
        const result = await this.$API.attr.delete(row.id);
        if (result.code === 20000 || result.code === 200) {
          this.$message.success("删除成功！");
          this.getAttrList();
        } else {
          this.$message.error("删除属性失败");
        }
      } catch (error) {
        this.$message.error("请求删除属性失败");
      }
    },

    //点击保存按钮
    async save() {
      //获取请求参数
      let attr = this.attrForm;

      //整理参数
      // a、属性值名称如果为空串，从属性值列表当中去除
      // b、属性值当中去除isEdit属性
      // c、属性值列表如果没有属性值，不发请求

      attr.attrValueList = attr.attrValueList.filter((item) => {
        delete item.isEdit;
        return item.valueName != "";
      });

      if (attr.attrValueList.length === 0) return;

      try {
        const result = await this.$API.attr.addOrUpdate(attr);
        if (result.code === 20000 || result.code === 200) {
          this.$message.success("保存成功！");
          this.isShowList = true;
          this.getAttrList();
        } else {
          this.$message.error("保存失败");
        }
      } catch (error) {
        this.$message.error("请求保存失败");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>