<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-29 15:34:36
 * @LastEditTime: 2019-12-03 22:05:44
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="body">
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="选择平台">
        <el-select v-model="form.platformValue" placeholder="请选择平台">
          <el-option
            v-for="item in platform"
            :key="item.id"
            :label="item.dbName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择电站">
        <el-input placeholder="请输入电站名称" v-model="form.plantName" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="table_body" v-loading="tableLoading">
      <el-table
        :data="tableData"
        border
        height="750px"
        style="width: 100%">
        <el-table-column
          prop="plantName"
          label="电站名称">
        </el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="showUnit(scope.row)" type="primary" size="small"><i class="el-icon-zoom-in"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="pagination_block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        background
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total">
      </el-pagination>
    </div> -->
    <el-dialog
      width="50%"
      title="单元列表"
      :visible.sync="innerVisible"
      append-to-body>
      <el-table
        v-loading="unitTableLoading"
        :data="unitTable"
        stripe
        height="500"
        style="width: 100%">
        <el-table-column
          prop="unit"
          :show-overflow-tooltip="true"
          label="单元SN">
        </el-table-column>
        <el-table-column
          prop="deviceName"
          :show-overflow-tooltip="true"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="addr"
          :show-overflow-tooltip="true"
          label="设备地址">
        </el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="del(scope.row)" type="danger" size="small" plain><i class="el-icon-delete"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="innerVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading:false,
      innerVisible:false,
      tableLoading:false,
      unitTableLoading:false,
      chooseSn:'',
      form:{
        plantName:'正泰',
        platformValue:1,
      },
      platform:[],
      tableData:[],
      unitTable:[],
      currentPage: 1,
      pageSize: 10,
      total: 0,
    }
  },

  components: {},

  computed: {},

  created () {
    this.getdbList()
    
  },

  mounted () {},

  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.loadTable()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.loadTable()
    },
    getdbList(){
      let _this = this
      var objs = {
        url: this.$urlConfig.dblist
      }
      this.$api.get(objs).then(function (res) {
        if (res.code === '0') {
          _this.platform = res.data
          console.log(res)
          _this.loadTable()
        }
      })
    },
    // 搜索单元列表
    search(){
      this.currentPage = 1
      this.loadTable()
    },
    loadTable(){
      let _this = this
      this.tableLoading = true
      var objs = {
        params: {
          databaseNo: this.form.platformValue,
          plantName: this.form.plantName
        },
        url: this.$urlConfig.delList
      }
      this.$api.post(objs).then(function (res) {
        if (res.code === '0') {
          // 添加成功后获取Id
          _this.tableData = res.data
          _this.tableLoading = false
        }
      })
    },
    // 搜索电站
    remoteMethod(query){
      if (query !== '') {
        this.loading = true;
      }
    },
    showUnit(row){
      this.chooseSn = row.plantNo
      this.innerVisible = true
      let _this = this
      var objs = {
        params: {
          databaseNo: this.form.platformValue,
          plantSn: row.plantNo
        },
        url: this.$urlConfig.devList
      }
      this.unitTableLoading = true
      this.$api.post(objs).then(function (res) {
        if (res.code === '0') {
          // 添加成功后获取Id
          _this.unitTable = res.data
          _this.unitTableLoading = false
        }
      })
    },
    del(row){
      let content = '确定要执行删除操作吗？'
      let _this = this
      this.$utils.confirm(this, content).then(() => {
        var objs = {
          params: {
            addr: row.addr,
            databaseNo: this.form.platformValue,
            plantSn:_this.chooseSn,
            unit:row.unit
          },
          url: this.$urlConfig.delMax
        }
        this.$api.post(objs).then(function (res) {
          if (res.code === '0') {
            _this.$message.success('删除成功')
          }
        })
      })
    }
  }
}

</script>
<style lang='stylus' scoped>
.body
  padding 20px
</style>
