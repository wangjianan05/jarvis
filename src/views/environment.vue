<!--
 * @Description: 环境管理
 * @Author: your name
 * @Date: 2019-07-16 18:21:04
 * @LastEditTime: 2019-08-22 09:07:04
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb" style="margin-top:20px">
      <el-breadcrumb-item :to="{ path: '/service' }"> <i class="CHIoT iconhome"></i><span style="color:#237AE4"> 首页</span></el-breadcrumb-item>
      <el-breadcrumb-item>{{envInfo.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="env_body">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="left_info_box">
            <el-row>
              <el-col :span="18">
                <h2>基本信息</h2>
              </el-col>
              <el-col :span="6">
                <span class="edit_dialog" @click="editSer()">编辑</span>
              </el-col>
            </el-row>            
            <label class="mt20">名称</label>
            <p>{{envInfo.name}}</p>
            <label>描述</label>
            <p>{{envInfo.description}}</p>
            <label>最后更新时间</label>
            <p>{{envInfo.createTime}}</p>
          </div>
        </el-col>
        <el-col :span="20">
          <div class="table_body">
            <div class="table_search">
              <label>环境管理</label>
              <el-button class="el_btn add" @click="add()" size="mini">+添加</el-button>
              <el-input
                placeholder="请输入环境名称"
                class="searchKey"
                v-model="name">
                <i slot="suffix" class="el-input__icon CHIoT iconsearch" @click="searchSer()"></i>
              </el-input>
            </div>
            <template>
              <el-table
                :data="tableData"
                height="670px"
                stripe
                style="width: 100%">
                <el-table-column
                  prop="name"
                  label="环境名">
                  <template slot-scope="scope">
                    <span class="serve_name" @click="detail(scope.row)">{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  sortable
                  label="最后更新时间">
                  <template slot-scope="scope">
                  <span style="color:#8893A9">{{scope.row.createTime}}</span>
                </template>
                </el-table-column>
                <el-table-column
                  prop="status"
                  label="启用/禁用">
                  <template slot-scope="scope">
                    <!-- 是否启用 -->
                    <span v-if="scope.row.status === true" style="color:#8490A6">
                      <span class="status_title"><label style="color:#6FBD4B">●</label> 已启用&nbsp;&nbsp;&nbsp;</span>
                      <img src="../assets/Switch1.png" class="switch_img" @click="changeSwitch(scope.row)">
                      <!-- <el-switch
                        v-model="scope.row.status"
                        :active-value="true"
                        :inactive-value="false"
                        @change="changeSwitch(scope.row)">
                      </el-switch> -->
                    </span>
                    <span v-else-if="scope.row.status === false"  style="color:#8490A6">
                      <span class="status_title"><label style="color:#8490A6">●</label> 未启用&nbsp;&nbsp;&nbsp;</span>
                      <img src="../assets/Switch2.png" class="switch_img" @click="changeSwitch(scope.row)">
                      <!-- <el-switch
                        v-model="scope.row.status"
                        :active-value="true"
                        :inactive-value="false"
                        @change="changeSwitch(scope.row)">
                      </el-switch> -->
                    </span>
                  </template>
                </el-table-column>

                <el-table-column
                  fixed="right"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button @click="detail(scope.row)" type="default" class="btn_default" size="small"><i class="CHIoT iconview"></i> 详情</el-button>
                    <el-button @click="edit(scope.row)" type="default" class="btn_default" size="small"><i class="CHIoT iconeditor"></i> 编辑</el-button>
                    <el-button @click="del(scope.row)" type="default" class="btn_default" size="small"><i class="CHIoT icondelete"></i> 删除</el-button>
                    <!-- <el-button @click="goParams(scope.row)" type="primary" size="small">配置管理</el-button> -->
                    <!-- <el-button @click="detail(scope.row)" size="small">详情</el-button> -->
                    <!-- <el-button @click="edit(scope.row)" type="success" size="small">编辑</el-button> -->
                    <!-- <el-button @click="del(scope.row)" type="warning" size="small">删除</el-button> -->
                  </template>
                </el-table-column>
                <div slot="empty" class="table_empty">
                  <div class="text">
                    当前筛选条件下您还没有任何环境管理信息,请
                    <span @click="add()" class="add_btn">立即添加</span>
                  </div>
                </div>
              </el-table>
            </template>
          </div>
          <div class="pagination_block">
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
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <elinput
        :inputConfig = inputConfigName
        @getContent = blurName
        @changeContent = changeName
        maxlength="20"
      ></elinput>
      <elinput
        :inputConfig = inputConfigDes
        maxlength="50"
      ></elinput>
      <el-row :gutter="10" class="mt20">
        <el-col :span="3" class="label">
          <label class="configParams">参数配置</label>
        </el-col>
        <el-col :span="10">
          <el-select v-model="paramsForm.type" placeholder="请选择" class="config_params_sel">
            <el-option :value="1" label=".properties"></el-option>
            <el-option :value="2" label=".yml"></el-option>
          </el-select>
        </el-col>
        <el-col :span="11">
          <label class="preview" @click="confirm()" v-show="chooseId"><i class="CHIoT iconpublic"></i>&nbsp;<span> 预览</span></label>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mt20">
        <el-col :span="3">
          <span style="color:#fff">配置内容</span>
        </el-col>
        <el-col :span="21" v-loading="textLoading">
          <el-input v-model="paramsForm.content" type="textarea" class="content" placeholder="请输入参数信息"></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
      <el-dialog
        width="50%"
        title="配置详情"
        :visible.sync="innerVisible"
        append-to-body>
        <el-table
          :data="tableDataParams"
          stripe
          height="500"
          style="width: 100%">
          <el-table-column
            prop="key"
            :show-overflow-tooltip="true"
            label="配置项Key">
          </el-table-column>
          <el-table-column
            prop="value"
            :show-overflow-tooltip="true"
            label="配置项Value">
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button  type="primary" @click="innerVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <el-dialog
      title="环境设置详情"
      class="details_dialog"
      :visible.sync="dialogDetailVisible"
      :close-on-click-modal="false"
      width="945px"
      :before-close="handleClose">
      <ul class="detail_ul">
        <li>
          <label>环境名:</label><span>{{info.name}}</span>
        </li>
         <li>
          <label>启用状态:</label>
          <span v-if="info.status" class="enble">● 启用</span>
          <span v-else class="disable">● 禁用</span>
        </li>
        <li>
          <label>密钥:</label><span>
            <el-input :type="isShowPwd === true?'password':'text'" v-model="info.secretKey" class="detail_ul_pwd" readonly></el-input>
            &nbsp;&nbsp;&nbsp;
            <el-button
                type="text"
                class="under_line"
                v-clipboard:copy="info.secretKey"
                v-clipboard:success="clipboardSuccess"
              >复制</el-button>
              <el-button
                class="under_line"
                @click="showPassword"
                type="text"
              >{{isShowPwd?'显示':'隐藏'}}</el-button>
          </span>
        </li>
        <li>
          <label>最后更新时间:</label><span>{{info.createTime}}</span>
        </li>
        <li style="width:100%">
          <label>环境描述:</label><span style="height:auto">{{info.description}}</span>
        </li>
      </ul>
      <div class="table_box">
        <div class="detail_table_left">配置参数</div>
        <div class="detail_table">
          <el-table
            :data="tableDataParams"
            stripe
            height="500"
            style="width: 100%">
            <el-table-column
              prop="key"
              :show-overflow-tooltip="true"
              label="配置项Key">
            </el-table-column>
            <el-table-column
              prop="value"
              :show-overflow-tooltip="true"
              label="配置项Value">
            </el-table-column>
          </el-table>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDetailVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
       <el-dialog
      title="编辑微服务"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
      width="40%"
      :before-close="handleClose">
      <elinput
        :inputConfig = inputConfigSerName
        @getContent = blurSerName
        @changeContent = changeSerName
        maxlength="20"
      ></elinput>
      <elinput
        :inputConfig = inputConfigSerDes
        maxlength="50"
      ></elinput>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSer">确 定</el-button>
        <el-button @click="dialogEditVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog
      title="参数配置"
      :visible.sync="dialogParamsVisible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form label-width="100px" :model="paramsForm" :rules="dataRuleParam" ref="paramsForm">
        <el-form-item label="文件格式">
          <el-radio-group v-model="paramsForm.type">
            <el-radio :label="1">.properties</el-radio>
            <el-radio :label="2">.yml</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配置内容" prop="content" v-loading="textLoading">
          <el-input v-model="paramsForm.content" type="textarea" class="content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBtn()">保 存</el-button>
        <el-button type="success" @click="confirm()">预 览</el-button>
        <el-button @click="dialogParamsVisible = false">关 闭</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import elinput from '@/components/input'
// import { Promise } from 'q'
export default {
  data () {
    return {
      envInfo: {
        name: '',
        description: '',
        createTime: ''
      },
      chooseId: null,
      environmentId: null,
      chooseStatus: false,
      textLoading: false,
      isShowPwd: true,
      name: '',
      tableData: [],
      tableDataParams: [],
      title: '',
      dialogVisible: false,
      dialogEditVisible: false,
      dialogDetailVisible: false,
      dialogParamsVisible: false,
      innerVisible: false,
      form: {
        name: '',
        description: '',
        microserviceId: null
      },
      info: {
        name: '-',
        description: '-',
        secretKey: '-',
        status: '-',
        createTime: '-'
      },
      paramsForm: {
        type: 1,
        content: ''
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      inputConfigName: {
        labelWidth: 3,
        inputWidth: 10,
        warningWidth: 11,
        labelName: '环境名称',
        isRequire: true,
        type: 'text',
        placeholder: '请输入',
        borderColor: '#DCDFE6',
        warningInfo: '',
        value: '',
        status: true
      },
      inputConfigDes: {
        labelWidth: 3,
        inputWidth: 10,
        warningWidth: 11,
        labelName: '描述',
        isRequire: false,
        type: 'textarea',
        placeholder: '请输入描述信息，文字限长50个字符',
        borderColor: '#DCDFE6',
        warningInfo: '',
        value: '',
        status: true
      },
      inputConfigSerName: {
        labelWidth: 5,
        inputWidth: 13,
        warningWidth: 6,
        labelName: '微服务名称',
        isRequire: true,
        type: 'text',
        placeholder: '请输入',
        borderColor: '#DCDFE6',
        warningInfo: '',
        value: '',
        status: true
      },
      inputConfigSerDes: {
        labelWidth: 5,
        inputWidth: 13,
        warningWidth: 6,
        labelName: '描述',
        isRequire: false,
        type: 'textarea',
        placeholder: '请输入描述信息，文字限长50个字符',
        borderColor: '#DCDFE6',
        warningInfo: '',
        value: '',
        status: true
      }
    }
  },

  components: {
    elinput
  },

  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: '请输入环境名称', trigger: ['blur', 'change'] },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: ['blur', 'change'] }
        ]
      }
    },
    dataRuleParam () {
      return {
        content: [
          { required: true, message: '请输入配置内容', trigger: 'blur' }
        ]
      }
    },

  },

  created () {
    this.form.microserviceId = this.$route.query.id
    this.getEnvDetails()
  },

  mounted () {
    this.searchSer()
  },

  methods: {
    /**
     * @Description: 环境名称失去焦点
     * @Author: WangJiaNan
     * @Date: 2019-08-08 14:37:53
     */
    blurName (val) {
      this.checkOldName(val, 'blur')
    },
    /**
     * @Description: 环境名称改变值
     * @Author: WangJiaNan
     * @Date: 2019-08-08 14:37:53
     */
    changeName (val) {
      this.checkOldName(val, 'change')
    },
    /**
     * @Description: 环境名称验证
     * @Author: WangJiaNan
     * @Date: 2019-08-08 14:37:53
     */
    checkOldName (val, type) {
      if (val) {
        this.inputConfigName.warningInfo = ''
        if (type === 'blur') {
          this.inputConfigName.borderColor = '#DCDFE6'
        } else {
          this.inputConfigName.borderColor = '#409EFF'
        }
        this.inputConfigName.status = true
      } else {
        this.inputConfigName.warningInfo = '请输入名称'
        this.inputConfigName.borderColor = '#FF0014'
        this.inputConfigName.status = false
      }
      this.inputConfigName.value = val
    },
     /**
     * @Description: 微服务名称失去焦点
     * @Author: WangJiaNan
     * @Date: 2019-08-08 14:37:53
     */
    blurSerName (val) {
      this.checkOldName(val, 'blur')
    },
    /**
     * @Description: 微服务名称改变值
     * @Author: WangJiaNan
     * @Date: 2019-08-08 14:37:53
     */
    changeSerName (val) {
      this.checkOldSerName(val, 'change')
    },
    /**
     * @Description: 微服务名称验证
     * @Author: WangJiaNan
     * @Date: 2019-08-08 14:37:53
     */
    checkOldSerName (val, type) {
      if (val) {
        this.inputConfigSerName.warningInfo = ''
        if (type === 'blur') {
          this.inputConfigSerName.borderColor = '#DCDFE6'
        } else {
          this.inputConfigSerName.borderColor = '#409EFF'
        }
        this.inputConfigSerName.status = true
      } else {
        this.inputConfigSerName.warningInfo = '请输入名称'
        this.inputConfigSerName.borderColor = '#FF0014'
        this.inputConfigSerName.status = false
      }
      this.inputConfigSerName.value = val
    },
    getEnvDetails () {
      let _this = this
      this.chooseId = this.$route.query.id
      var obj = {
        params: {
          id: this.chooseId
        },
        url: this.$urlConfig.serviceAdd + '/'

      }
      this.$api.get(obj).then(function (res) {
        if (res.code === '200') {
          _this.envInfo = res.data
          _this.envInfo.createTime = _this.$moment(_this.envInfo.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
      })
    },
    showPassword () {
      this.isShowPwd = !this.isShowPwd
    },
    /**
     * @Description: 返回微服务管理
     * @Author: WangJiaNan
     * @Date: 2019-07-17 10:50:27
     */
    back () {
      this.$router.push({ path: '/service' })
    },
    /**
     * @Description: 搜索列表
     * @Author: WangJiaNan
     * @Date: 2019-07-17 08:37:51
     */
    searchSer () {
      this.currentPage = 1
      this.loadTable()
    },
    loadTable () {
      let _this = this
      var obj = {
        params: {
          name: this.name
        },
        url: this.$urlConfig.environmentPage + '/' + this.currentPage + '/' + this.pageSize + '/' + this.form.microserviceId

      }
      this.$api.getParams(obj).then(function (res) {
        if (res.code === '200') {
          _this.tableData = res.data.list
          _this.total = res.data.count
          _this.tableData.forEach((item, index) => {
            item.createTime = _this.$moment(item.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')
          })
        }
      })
    },
    /**
     * @Description: 配置管理
     * @Author: WangJiaNan
     * @Date: 2019-07-17 11:17:28
     */
    goParams (val) {
      let _this = this
      var obj = {
        url: this.$urlConfig.environmentParams + '/' + val.id
      }
      this.environmentId = val.id
      this.$api.get(obj).then(function (res) {
        if (res.code === '200') {
          if (res.data) {
            _this.paramsForm.type = res.data.config.type
            _this.paramsForm.content = res.data.config.content
          } else {
            _this.paramsForm.type = 1
            _this.paramsForm.content = ''
          }
          // _this.dialogParamsVisible = true
        }
      })
    },
    /**
     * @Description:查看详情
     * @Author: WangJiaNan
     * @Param: {obj}val:选中行的数据对象
     * @Date: 2019-07-17 10:49:46
     */
    detail (val) {
      let _this = this
      var obj = {
        url: this.$urlConfig.environmentOpt + '/' + val.id
      }
      this.$api.get(obj).then(function (res) {
        console.log(res)
        if (res.code === '200') {
          _this.info = res.data
          _this.info.createTime = _this.$moment(_this.info.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')
          _this.tableDataParams = []
          var obj = {
            url: _this.$urlConfig.environmentParams + '/' + val.id
          }
          _this.$api.get(obj).then(function (res) {
            if (res.code === '200') {
              let newData = res.data.configResult
              for (let i in newData) {
                _this.tableDataParams.push({
                  key: i,
                  value: newData[i]
                })
              }
            }
          })
        }
      })
      this.dialogDetailVisible = true
    },
    /**
     * @Description: 删除环境
     * @Author: WangJiaNan
     * @Date: 2019-07-17 09:19:40
     */
    del (val) {
      // let _this = this
      let content = '确定要执行删除操作吗？'
      let _this = this
      this.$utils.confirm(this, content).then(() => {
        let obj = {
          url: this.$urlConfig.environmentOpt + '/' + val.id
        }
        this.$api.deleteWithBody(obj).then(function (res) {
          if (res.code === '205') {
            _this.$message({
              type: 'success',
              message: '删除成功'
            })
            _this.searchSer()
          }
        })
      })
    },
    handleClose () {
      this.dialogVisible = false
      this.dialogDetailVisible = false
      this.dialogParamsVisible = false
    },
    add () {
      this.title = '添加环境配置'
      this.inputConfigName.value = ''
      this.inputConfigDes.value = ''
      this.inputConfigName.warningInfo = ''
      this.inputConfigName.borderColor = '#DCDFE6'
      this.paramsForm = {
        type: 1,
        content: ''
      }
      this.chooseId = null
      this.dialogVisible = true
    },
    edit (val) {
      this.title = '修改环境配置'
      this.chooseId = val.id
      let _this = this
      var obj = {
        url: this.$urlConfig.environmentOpt + '/' + val.id
      }
      this.$api.get(obj).then(function (res) {
        if (res.code === '200') {
          _this.inputConfigName.value = res.data.name
          _this.inputConfigDes.value = res.data.description
          _this.chooseStatus = res.data.status
          _this.inputConfigName.status = true
          _this.inputConfigName.warningInfo = ''
          _this.inputConfigName.borderColor = '#DCDFE6'
          _this.goParams(val)
        }
      })
      this.dialogVisible = true
    },
    /**
     * @Description:启用禁用事件
     * @Author: WangJiaNan
     * @Param: {obj} val:表格某一行的数据
     * @Date: 2019-07-08 19:19:56
     */
    changeSwitch (val) {
      let _this = this
      if (val.status === true) {
        // val.status = true
        let content = '是否确认要禁用该环境?'
        this.$utils.confirm(this, content).then(() => {
          var obj = {
            params: {
              id: val.id,
              name: val.name,
              microserviceId: this.form.microserviceId,
              description: val.description,
              status: false
            },
            url: this.$urlConfig.environmentOpt

          }
          this.$api.putWithBody(obj).then(function (res) {
            if (res.code === '200') {
              _this.$message.success('禁用成功')
              val.status = false
            }
          })
        })
      } else {
        // val.status = false
        let content = '是否确认要启用该环境?'
        this.$utils.confirm(this, content).then(() => {
          var obj = {
            params: {
              id: val.id,
              microserviceId: this.form.microserviceId,
              name: val.name,
              description: val.description,
              status: true
            },
            url: this.$urlConfig.environmentOpt

          }
          this.$api.putWithBody(obj).then(function (res) {
            if (res.code === '200') {
              _this.$message.success('启用成功')
              val.status = true
            }
          })
        })
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.loadTable()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.loadTable()
    },
    /**
     * @Description: 表单提交
     * @Author: WangJiaNan
     * @Date: 2019-07-18 09:33:36
     */
    submit () {
      if (this.inputConfigName.status && this.paramsForm.content) {
        let _this = this
        if (this.chooseId) { // 编辑
          var obj = {
            params: {
              id: this.chooseId,
              name: this.inputConfigName.value,
              microserviceId: this.form.microserviceId,
              description: this.inputConfigDes.value,
              status: this.chooseStatus
            },
            url: this.$urlConfig.environmentOpt

          }
          this.$api.putWithBody(obj).then(function (res) {
            if (res.code === '200') {
              _this.environmentId = res.data.id
              _this.searchSer()
              _this.submitParam()
            }
          })
        } else { // 新增
          var objs = {
            params: {
              name: this.inputConfigName.value,
              microserviceId: this.form.microserviceId,
              description: this.inputConfigDes.value
            },
            url: this.$urlConfig.environmentOpt
          }
          this.$api.post(objs).then(function (res) {
            if (res.code === '200') {
              // 添加成功后获取Id
              _this.environmentId = res.data.id
              _this.searchSer()
              _this.submitParam()
            }
          })
        }
      } else if (!this.paramsForm.content) {
        this.$message.error('参数信息不可为空')
        return false
      }
    },
    /**
     * @Description:拷贝成功
     * @Author: WangJiaNan
     * @Date: 2019-07-18 14:55:58
     */
    clipboardSuccess (e) {
      this.$message.success('复制成功')
      console.log(e, e.text)
    },
    hideDiage () {
      this.textLoading = false
      this.dialogParamsVisible = false
    },
    /**
     * @Description:修改配置
     * @Author: WangJiaNan
     * @Date: 2019-07-19 11:28:58
     */
    submitParam () {
      this.submitBtn(this.hideDiage)
    },
    /**
     * @Description:参数保存方法
     * @Author: WangJiaNan
     * @Date: 2019-08-12 15:54:14
     */
    submitBtn (callback) {
      let _this = this
      this.textLoading = true
      var obj = {
        params: {
          environmentId: this.environmentId,
          type: this.paramsForm.type,
          content: this.paramsForm.content
        },
        url: this.$urlConfig.optParams
      }
      this.$api.putWithBody(obj).then(function (res) {
        if (res.code === '205') {
          _this.$message.success('保存成功')
          _this.textLoading = false
          _this.dialogVisible = false
          _this.searchSer()
          callback()
        } else if (res.code === '1090004' || res.code === '1090005') {
          _this.textLoading = false
          _this.$message.error(res.msg)
          if (!_this.chooseId) {
            _this.dialogVisible = false
          }
        }
      })
    },
    /**
     * @Description:确认配置效果弹窗
     * @Author: WangJiaNan
     * @Date: 2019-07-19 13:45:04
     */
    confirm () {
      if (this.chooseId) { // 编辑
        if (this.paramsForm.content) {
          let _this = this
          this.tableDataParams = []
          var obj = {
            url: this.$urlConfig.environmentParams + '/' + this.environmentId
          }
          this.$api.get(obj).then(function (res) {
            if (res.code === '200') {
              let newData = res.data.configResult
              for (let i in newData) {
                _this.tableDataParams.push({
                  key: i,
                  value: newData[i]
                })
              }
            }
          })
          this.innerVisible = true
        } else {
          this.$message.error('参数信息不能为空')
        }
      } else { // 添加
        if (this.paramsForm.content) {
          if (this.inputConfigName.value) {

          } else {
            this.$message.error('环境名称不能为空')
          }
        } else {
          this.$message.error('参数信息不能为空')
        }
      }
    },
    /**
     * @Description: 编辑微服务弹窗
     * @Author: WangJiaNan
     * @Date: 2019-08-16 15:01:38
     */
    editSer(){
      this.inputConfigSerName.value = this.envInfo.name
      this.inputConfigSerName.status = true
      this.inputConfigSerDes.value = this.envInfo.description
      this.inputConfigSerName.warningInfo = ''
      this.inputConfigSerName.borderColor = '#DCDFE6'
      this.dialogEditVisible = true
    },
    /**
     * @Description: 修改微服务提交
     * @Author: WangJiaNan
     * @Date: 2019-08-16 15:04:35
     */
    submitSer(){
      let _this = this
      var obj = {
        params: {
          id: this.chooseId,
          name: this.inputConfigSerName.value,
          description: this.inputConfigSerDes.value
        },
        url: this.$urlConfig.serviceAdd
      }
      this.$api.putWithBody(obj).then(function (res) {
        if (res.code === '200') {
          _this.$message.success('修改成功')
          _this.dialogEditVisible = false
          _this.getEnvDetails()
        }
      })
    }
  }
}

</script>
<style lang='stylus' scoped>
.mt20
  margin-top:20px;
.btn_default
  background:rgba(255,255,255,1);
  box-shadow:0px 1px 1px 0px rgba(0,0,0,0.1);
  border-radius:3px;
  font-size 12px
  color #8893A9
  .CHIoT
    font-size 12px
.btn_default:hover
  color #237AE4
  border-color #237AE4
.status_title
  float left
  margin-top 5Px
.switch_img
  margin-top 5Px
  float left
  cursor pointer
.breadcrumb, .iconhome
  font-size 14px
.enble
  color #3dd06a !important
.disable
  color #e06262 !important
.opt_dia
  margin-top 10px
  .chintBlue
    margin-left 10px
.el-icon-view
  cursor pointer
.myicon
  font-size 30px
>>>.el-textarea__inner
  height 58Px
.title
  background #fff
  border-radius 10px
  padding 20px
  .title_top
    padding-bottom 20px
    overflow hidden
    border-bottom 2px solid #F4F4F4
    .myicon
      float left
      font-size 40px
      color #005bac
      cursor pointer
    img
      width 43px
      float left
    label
      float left
      font-size 30px
      font-weight 500
      margin-left 30px
.table_body
  border-radius 10px
  padding 20px
  background #fff
  .table_search
    .add
      color #fff
      background #237AE4
      margin-left 25px
      padding 8px 25px
    .searchKey
      float right
      width 296px
.detail_ul
  overflow hidden
  padding 20px
  background #F9FBFE
  li
    padding 10px 0
    width 50%
    float left
    font-size 14Px
    label
      color #6B798E
      width 100Px
      float left
      text-align right
      padding-right 10Px
      height 30Px
      line-height 30Px
    span
      color #121212
      padding-left 10px
      float left
      height 30Px
      line-height 30Px
      width:300Px;
    .detail_ul_pwd
      width 40%
      display inline-block
      >>>.el-input__inner
        border none
        height: 30Px;
        padding-left:0;
        background: #f9fbfe;
        color: #121212;
.pagination_block
  margin-top 10px
  float right
.chintBlue
  color #237AE4
.el-breadcrumb
  font-size 14px
  margin-bottom 20px
.left_info_box
  background:rgba(255,255,255,1);
  box-shadow:0px 1px 2px 0px rgba(0,0,0,0.1);
  border-radius:4px;
  padding 20px
  h2
    font-size 18px
  label
    font-size:14px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(132,144,166,1);
    line-height:42px;
    display:block;
    height:42px;
  p
    border-bottom:1px solid #F6F6F6;
    padding-bottom:10px;
    font-size:14px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(18,18,18,1);
    line-height:20Px;
.serve_name:hover
  text-decoration:underline
  color #237AE4
.iconsearch:hover
  cursor pointer
  color #237AE4
.configParams
  font-size:14px;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:rgba(18,18,18,1);
  float right
  margin-top 4px
.config_params_sel
  width 100%
  >>>.el-input__inner
    height 30Px
    border-color: #DCDFE6;
.preview
  float right
  color #237AE4
  cursor pointer
  margin-top 3px
  margin-right 10px
  >span:hover
    text-decoration:underline
.content
  >>>.el-textarea__inner
    height 324Px
.under_line
  text-decoration: underline;
.details_dialog
  >>>.el-dialog__body
    padding 0
.table_box
  overflow hidden
  .detail_table_left
    text-align right
    padding 33Px 20Px
    float left
    width 80Px
    font-size:14px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(18,18,18,1);
    line-height:20px;
  .detail_table
    padding 20Px
    float left
    width:780Px;
.table_empty
  background:rgba(252,252,252,1);
  border:1px solid rgba(208,216,220,1);
  .add_btn
    text-decoration underline
    color #237AE4
    cursor pointer
.edit_dialog
  font-size 14px
  text-decoration underline
  color #237ae4
  cursor pointer 
  text-align right
  display block
</style>
