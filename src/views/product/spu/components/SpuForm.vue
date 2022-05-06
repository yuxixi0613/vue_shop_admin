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
          :placeholder="
            unSelectSaleAttrList.length
              ? `还有${unSelectSaleAttrList.length}未选择`
              : '没有啦!!!'
          "
        >
          <el-option
            :label="unSelectSaleAttr.name"
            :value="`${unSelectSaleAttr.id}:${unSelectSaleAttr.name}`"
            v-for="unSelectSaleAttr in unSelectSaleAttrList"
            :key="unSelectSaleAttr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          :disabled="!unSelectSaleAttrIdName"
          >添加销售属性</el-button
        >
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
            <template v-slot="{ row, $index }">
              <el-tag
                :key="saleAttrValue.id"
                v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ saleAttrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.isEdit"
                v-model="row.saleAttrValueName"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150px">
            <template v-slot="{ row, $index }">
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除销售属性"
                @click="spuInfo.spuSaleAttrList.splice($index, 1)"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <!-- 
          父组件给子组件属性传递数据后面添加.sync子组件修改数据 
          需要分发事件 @click = $emit("update:属性名",要更新的数据) 
        -->
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      spuId: "",
      category3Id: "",

      dialogImageUrl: "",
      dialogVisible: false,

      spuInfo: {
        category3Id: "",
        description: "",
        spuName: "",
        tmId: "",
        // id: 0,
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   isChecked: "string",
          //   saleAttrName: "string",
          //   saleAttrValueName: "string",
          //   spuId: 0,
          // },
          //   ],
          // },
        ]
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
    // 点击属性值当中的添加按钮
    showInput(row) {
      // row.isEdit = true; //这样添加的不是响应式，是错误的
      this.$set(row, "isEdit", true);
      this.$set(row, "saleAttrValueName", "");
      // 点击按钮变为input旧添加这个属性，防止后面v-model不输入的时候出现bug
      // 不输入是没有相应属性，获取的是undefined，trim的时候报错，这样去写没问题

      // this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },

    //input失焦或回车确认
    handleInputConfirm(row) {
      //解构
      let { saleAttrValueName, baseSaleAttrId } = row;

      //判断不能为空
      if (saleAttrValueName.trim() === "") {
        row.saleAttrValueName = "";
        row.isEdit = false;
        return;
      }

      //判断添加的属性值名称是否已经添加有重复的了
      let isRepeat = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName === saleAttrValueName;
      });

      //若已重复，则清空并变为button
      if (isRepeat) {
        row.saleAttrValueName = "";
        row.isEdit = false;
        return;
      }

      //创建一个对象并push进属性值名称列表中
      let obj = { saleAttrValueName, baseSaleAttrId };
      row.spuSaleAttrValueList.push(obj);
      //清空input输入的数据
      row.saleAttrValueName = "";
      //input变为button
      row.isEdit = false;
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //上传成功的回调
    handleSuccess(res, file, fileList) {
      this.spuImageList = fileList;
      // console.log(this.spuImageList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 点击添加销售属性
    addSaleAttr() {
      // 把收集的数据变为销售属性对象结构
      let [baseSaleAttrId, saleAttrName] =
        this.unSelectSaleAttrIdName.split(":");
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spuInfo.spuSaleAttrList.push(obj);

      //清空数据
      this.unSelectSaleAttrIdName = "";
    },

    // 点击保存按钮
    async save() {
      // 1.获取请求参数
      let {category3Id,spuInfo,spuImageList} = this
      // 2、整理参数
      // 1>、整理category3Id  
      spuInfo.category3Id = category3Id

      // 2、整理图片数据结构
      // 需要的格式
      //   id: 0,
      //   imgName: "string",
      //   imgUrl: "string",
      //   spuId: 0,
      // 你目前的格式
      //  老的图片  有name和url也有imgName和imgUrl 都是对的
      //  新的图片  只有name和url  url还是错的
      spuInfo.spuImageList = spuImageList.map((item) => {
        return {
          id: item.id,
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data,
          spuId: this.spuId,
        };
      });
      // 3.发请求
      try {
        const result = await this.$API.spu.addUpdate(spuInfo);
        if (result.code === 20000 || result.code === 200) {
          this.$message.success("保存成功");
          // 跳转到列表列
          this.$emit("update:visible", false);
          // 想办法让父组件重新请求列表数据，分页列表数据又得看是添加还是修改，因为停留的页码不一样
          // 需要给父组件传递数据，告知父组件是怎么成功返回的,在父组件进行发请求
          // 自定义事件
          this.$emit("backSuccess", spuInfo.id);

          //清空data的数据
          this.resetData();
        } else {
          this.$message.error("保存失败");
        }
      } catch (error) {
        this.$message.error("请求保存失败");
      }

      // 4.成功干啥

      // 5.失败干啥
    },

    // 清空data的数据
    resetData() {
      Object.assign(this._data, this.$options.data());
    },

    // 点击取消按钮
    cancle() {
      this.$emit("update:visible", false);
      this.resetData();
    },

    // 获取添加spu的初始化数据
    async getInitAddSpuFormData(category3Id) {
      this.category3Id = category3Id;
      // 获取所有的品牌列表
      //  http://192.168.20.104:9529/dev-api/admin/product/baseTrademark/getTrademarkList
      const result3 = await this.$API.trademark.getList();
      if (result3.code === 20000 || result3.code === 200) {
        this.trademarkList = result3.data;
      }
      // 获取所有的销售属性列表
      //  http://192.168.20.104:9529/dev-api/admin/product/baseSaleAttrList
      const result4 = await this.$API.spu.getSaleAttrList();
      if (result4.code === 20000 || result4.code === 200) {
        this.baseSaleAttrList = result4.data;
      }
    },

    // 获取修改spu的初始化数据
    async getInitUpdateSpuFormData(spuId) {
      this.spuId = spuId;
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