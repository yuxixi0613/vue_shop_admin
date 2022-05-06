<template>
  <div>
    <el-form ref="form" label-width="100px">
      <el-form-item label="SPU名称">{{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input
          placeholder="重量(千克)"
          type="number"
          v-model="skuInfo.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          placeholder="规格描述"
          rows="4"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form">
          <el-form-item
            :label="attr.attrName"
            label-width="100px"
            v-for="attr in attrList"
            :key="attr.id"
          >
            <el-select v-model="attr.attrIdValueId" placeholder="请选择">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="100px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              v-model="saleAttr.saleAttrIdValueId"
              placeholder="请选择"
            >
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            prop="prop"
            label="label"
            type="selection"
            width="55px"
          >
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template v-slot="{ row, $index }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 80px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{ row, $index }">
              <el-button
                v-if="row.isDefault === '0'"
                type="primary"
                size="mini"
                @click="setDefault(row, spuImageList)"
                >设为默认</el-button
              >
              <el-tag v-else type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { sku } from "@/api";
export default {
  name: "SkuForm",
  data() {
    return {
      spu: {},

      attrList: [],
      spuSaleAttrList: [],
      spuImageList: [],

      skuImageList: [], //这个才是用来收集用户选中的spu图片，形成sku的图片列表
      skuInfo: {
        category3Id: "",
        price: "",
        skuAttrValueList: [],
        skuDefaultImg: "",
        skuDesc: "",
        skuImageList: [],
        skuName: "",
        skuSaleAttrValueList: [],
        spuId: "",
        tmId: "",
        weight: "",
      },
    };
  },
  methods: {
    async getInitAddSkuFormData(spu, category1Id, category2Id) {
      // console.log(spu);
      this.spu = spu;
      // http://192.168.1.6:9529/dev-api/admin/product/attrInfoList/3/16/87
      // 平台属性
      let promise1 = this.$API.attr.getList(
        category1Id,
        category2Id,
        spu.category3Id
      );

      // http://192.168.1.6:9529/dev-api/admin/product/spuSaleAttrList/4439
      // 销售属性值列表
      let promise2 = this.$API.sku.getSpuSaleAttrList(spu.id);

      // http://192.168.1.6:9529/dev-api/admin/product/spuImageList/4439
      // spu图片列表
      let promise3 = this.$API.sku.getSpuImageList(spu.id);

      try {
        const result = await Promise.all([promise1, promise2, promise3]);
        // console.log(result);
        this.attrList = result[0].data;
        this.spuSaleAttrList = result[1].data;

        let spuImageList = result[2].data;
        spuImageList.forEach((item) => {
          item.isDefault = "0";
        });
        this.spuImageList = spuImageList;
      } catch (error) {
        // this.$message.error(error.message);
      }
    },

    // 选择sku图片的事件回调
    handleSelectionChange(val) {
      this.skuImageList = val;
    },

    // 点击取消
    cancle() {
      this.$emit("update:visible", false);
      this.resetData();
    },

    // 点击保存
    async save() {
      // 获取请求参数
      let { spu, skuImageList, attrList, spuSaleAttrList, skuInfo } = this;

      // 整理参数
      // 1、整理父组件传递过来的spu当中的三个
      skuInfo.spuId = spu.id;
      skuInfo.tmId = spu.tmId;
      skuInfo.category3Id = spu.category3Id;

      // 2、整理收集的图片列表（选中的那个图片列表），数据格式要和最终的格式比对
      // 最终要的
      // imgName: "string",
      // imgUrl: "string",
      // isDefault: "string",
      // spuImgId: 0,
      // 我们现在有的
      // id:13001
      // imgName:null
      // imgUrl:null
      // isDefault:"0"
      // spuId:5349

      skuInfo.skuImageList = skuImageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.spuId,
        };
      });

      // 3、整理平台属性和销售属性
      // 	用数组的reduce方法快速搞定
      skuInfo.skuAttrValueList = attrList.reduce((prev, item) => {
        if (item.attrIdValueId) {
          let [attrId, valueId] = item.attrIdValueId.split(":");
          let obj = { attrId, valueId };
          prev.push(obj);
        }
        return prev;
      }, []);

      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdValueId) {
          let [saleAttrId, saleAttrValueId] = item.saleAttrIdValueId.split(":");
          let obj = { saleAttrId, saleAttrValueId };
          prev.push(obj);
        }
        return prev;
      }, []);

      // 发请求
      try {
        const result = await this.$API.sku.addUpdate(skuInfo);
        console.log(result);
        if (result.code === 20000 || result.code === 200) {
          this.$message.success("保存sku成功");
          this.$emit("update:visible", false);
          this.resetData();
        }
      } catch (error) {}
    },

    // 清空data数据
    resetData() {
      Object.assign(this._data, this.$options.data());
    },

    // 点击设为默认按钮
    setDefault(row, spuImageList) {
      spuImageList.forEach((item) => {
        item.isDefault = "0";
        row.isDefault = "1";
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>