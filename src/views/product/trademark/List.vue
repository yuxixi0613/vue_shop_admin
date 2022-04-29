<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >
    <!-- 这里的data必须传一个数组，会遍历给每一个列一份 -->
    <el-table border style="width: 100%; margin: 20px 0" :data="trademarkList">
      <el-table-column
        prop="prop"
        label="序号"
        width="80px"
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
        <template v-slot="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 80px; height: 60px" />
        </template>
      </el-table-column>

      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{ row, $index }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: center"
      background
      @current-change="getTrademarkList"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper, ->, total, sizes"
      :page-sizes="[3, 5, 10]"
      :current-page="page"
      :page-size="limit"
      :total="total"
      :pager-count="7"
    >
    </el-pagination>
    <!-- 
        page-sizes这个属性可以让我们后期在页面取修改每页显示的数量
        这个属性数组当中第一项必须和page-size是一样的
        :page-sizes="[3, 5, 10]"  

        pager-count	页码按钮的数量，当总页数超过该值时会折叠  number  大于等于5且小于等于21的奇数  默认值7
     -->

    <!-- 添加或者修改的界面dialog -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="tmForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    let validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("tmName必须在2-10之间"));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,

      dialogFormVisible: false,

      // imageUrl: "",

      tmForm: {
        tmName: "",
        logoUrl: "",
      },

      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { validator: validateTmName, trigger: "change" },
        ],

        logoUrl: [
          { required: true, message: "请选择LOGO图片", trigger: "change" }
        ]
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page;
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
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },

    // upload默认的两个函数
    // 上传成功的回调
    handleAvatarSuccess(res, file) {
      // 这个东西是本地的图片路径，不是上传成功的图片网络路径（上传成功返回的服务器地址）
      // this.tmForm.logoUrl = URL.createObjectURL(file.raw);
      this.tmForm.logoUrl = res.data || file.response.data;
    },

    // 上传图片之前回调
    // 上传限定
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 点击添加按钮显示添加的dialog对话框
    showAddDialog() {
      this.dialogFormVisible = true;

      // 在每次点击的时候把之前tmform当中的数据清空
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },

    // 点击修改按钮显示修改的dialog，其实和添加是同一个，只是这个里面有数据回显
    showUpdateDialog(row) {
      this.dialogFormVisible = true;
      this.tmForm = { ...row };
    },

    addOrUpdateTrademark() {
      //validate是组件对象上的一个方法，里面参数是一个回调函数，回调函数的参数valid是验证结果
      this.$refs.tmForm.validate(async (valid) => {
        if (valid) {
          // 获取请求参数
          let trademark = this.tmForm;
          try {
            const result = await this.$API.trademark.addOrUpdate(trademark);
            if (result.code === 20000 || result.code === 200) {
              this.$message.success(trademark.id ? "修改成功" : "添加成功");
              // 关闭dialog
              this.dialogFormVisible = false;
              // 发请求获取最新数据
              this.getTrademarkList(trademark.id ? this.page : 1);
            } else {
              this.$message.error(
                trademark.id ? "修改品牌失败" : "添加品牌失败"
              );
            }
          } catch (error) {
            this.$message.error(
              trademark.id ? "请求修改品牌失败" : "请求添加品牌失败"
            );
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    deleteTrademark(row) {
      console.log(row.tmName);
      this.$confirm(`你确定要删除${row.tmName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const result = await this.$API.trademark.remove(row.id);
            if (result.code === 20000 || result.code === 200) {
              this.$message({
                type: "success",
                message: "删除品牌成功!",
              });

              // 删除的时候要判断当前页数据有多少条，大于一条最终还是停留在当前页，如果不大于1，
              // 那么最终要去到前一页
              this.getTrademarkList(
                this.trademarkList.length > 1 ? this.page : this.page - 1
              );
            } else {
              this.$message.error("删除品牌失败");
            }
          } catch (error) {
            this.$message.error("请求删除品牌失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>