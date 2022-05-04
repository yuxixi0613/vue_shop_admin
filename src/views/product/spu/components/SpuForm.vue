<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          rows="4"
          v-model="spuInfo.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          v-model="unSelectSaleAttrIdName"
          :placeholder="`还有${unSelectSaleAttrList.length}未选择`"
        >
          <el-option
            :label="unSelectSaleAttr.name"
            :value="unSelectSaleAttr.id"
            v-for="unSelectSaleAttr in unSelectSaleAttrList"
            :key="unSelectSaleAttr.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table border style="width: 100%" :data="spuInfo.spuSaleAttrList">
          <el-table-column
            prop="prop"
            label="序号"
            type="index"
            align="center"
            width="80px"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150px">
          </el-table-column>

          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template v-slot="{ rwo, $index }">
              <el-tag
                :key="saleAttrValue.id"
                v-for="saleAttrValue in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >添加</el-button
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150px">
            <HintButton
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></HintButton>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">保存</el-button>
        <!-- 
          父组件给子组件属性传递数据后面添加.sync子组件修改数据 
          需要分发事件 @click = $emit("update:属性名",要更新的数据) 
        -->
        <el-button @click="$emit('update:visible', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: "",

      dialogImageUrl: "",
      dialogVisible: false,

      spuInfo: {
        // category3Id: "",
        // description: "",
        // spuName: "",
        // tmId: "",
        // spuImageList: [],
        // spuSaleAttrList: [],
      },
      spuImageList: [],
      trademarkList: [],

      baseSaleAttrList: [],
      unSelectSaleAttrIdName: "",
    };
  },
  computed: {
    //计算生成 未选择的销售属性列表
    unSelectSaleAttrList() {
      return this.baseSaleAttrList.filter((item) => {
        return this.spuInfo.spuSaleAttrList.every((item1) => {
          return item1.saleAttrName !== item.name;
        });
      });
    },
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleSuccess() {},
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 获取添加spu的初始化数据
    getInitAddSpuFormData() {},

    // 获取修改spu的初始化数据
    async getInitUpdateSpuFormData(spuId) {
      // 根据id获取SPU详情信息
      // http://192.168.1.6:9529/dev-api/admin/product/getSpuById/2
      const result = await this.$API.spu.get(spuId);
      if (result.code === 20000 || result.code === 200) {
        this.spuInfo = result.data;
      }

      // 获取指定SPU的id对应的图片列表
      // http://192.168.1.6:9529/dev-api/admin/product/spuImageList/2
      const result2 = await this.$API.sku.getSpuImageList(spuId);
      if (result2.code === 20000 || result2.code === 200) {
        let imgList = result2.data;
        imgList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = imgList;
      }

      // 获取所有的品牌列表
      // http://192.168.1.6:9529/dev-api/admin/product/baseTrademark/getTrademarkList
      const result3 = await this.$API.trademark.getList();
      if (result3.code === 20000 || result3.code === 200) {
        this.trademarkList = result3.data;
      }

      // 获取所有的销售属性列表
      // http://192.168.1.6:9529/dev-api/admin/product/baseSaleAttrList
      const result4 = await this.$API.spu.getSaleAttrList();
      if (result4.code === 20000 || result4.code === 200) {
        this.baseSaleAttrList = result4.data;
      }
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
<style lang="scss" scoped>
</style>