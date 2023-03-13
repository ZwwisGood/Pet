<template>
    <div class="animated animate__fadeIn">
        <el-card style="margin-bottom:5px">
            <div class="query-form">
                <el-form ref="form" :inline="true" :model="goods">
                    <el-form-item label="商品名称" prop="petName">
                        <el-input v-model="goods.goodsName" placeholder="请输入商品名称" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select clearable v-model="goods.goodsStatus" placeholder="商品状态">
                            <el-option value="上架">上架</el-option>
                            <el-option value="下架">下架</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="库存" prop="goodsStock">
                        <div style="width:400px;display:flex">
                            <el-input onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number"
                                v-model="goods.num1">
                                <template #prepend>大于等于</template>
                            </el-input>
                            <el-input onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number"
                                v-model="goods.num2">
                                <template #prepend>小于等于</template>
                            </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="销量">
                        <div style="width:400px;display:flex">
                            <el-input onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number"
                                v-model="goods.stock1">
                                <template #prepend>大于等于</template>
                            </el-input>
                            <el-input onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number"
                                v-model="goods.stock2">
                                <template #prepend>小于等于</template>
                            </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleQuery"><i class="el-icon-search"></i>&nbsp查询</el-button>
                        <el-button type="danger" @click="handleReset('form')"><i
                                class="el-icon-close"></i>&nbsp重置</el-button>
                        <el-button type="success" @click="refresh"><i class="el-icon-refresh-left"></i>&nbsp刷新</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <div class="table">
            <el-card>
                <el-button type="primary" @click="handleCreate"><i class="el-icon-plus"></i>添加商品</el-button>
                <el-button type="danger" @click="handleDeleteMany"><i class="el-icon-delete"></i>批量删除</el-button>
                <el-table style="width:100%" :data="goodsList">
                    <el-table-column type="selection" />
                    <el-table-column align="center" v-for="item in columns" :key="item.prop" :prop="item.prop"
                        :sortable="item.label == '更新时间' || item.label == 'ID'" :label="item.label" :width="item.width"
                        :formatter="item.formatter" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template #default="scope">
                            <el-tag v-if="scope.row.goodsStatus == '上架'" type="success">上架</el-tag>
                            <el-tag v-else type="danger">下架</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="商品图片" width="100">
                        <template #default="scope">
                            <el-image style="width: 50px;height: 50px"
                                :src="scope.row.goodsImg ? scope.row.goodsImg[0] : ''"
                                :preview-src-list="scope.row.goodsImg" :zoom-rate="1.2" :initial-index="1" fit="contain" />
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="250">
                        <template #default="scope">
                            <el-button type="primary" :disabled="scope.row.status == '已领养'" @click=""><i
                                    class="el-icon-edit"></i>编辑</el-button>
                            <el-button type="success"><i class="el-icon-upload2"></i>上架</el-button>
                            <el-popconfirm placement="top" title="确定删除该商品吗?" confirm-button-text="确定"
                                cancel-button-text="关闭" @confirm="del(scope.row)">
                                <template #reference>
                                    <el-button type="danger"><i class="el-icon-close"></i>下架</el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <!-- <el-drawer v-model="drawer" :title="`申请领养 ${petName} 的用户列表`" size="35%">
                <el-table style="100%" :data="list">
                    <el-table-column align="center" type="expand">
                        <template #default="props">
                            <div>
                                <h4>用户ID: {{ props.row.user[0].userId }}</h4>
                                <h4>身份证号: {{ props.row.idCard }}</h4>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" v-for="item in listColumns" :key="item.prop" :prop="item.prop"
                        :sortable="item.label == '申请时间'" :label="item.label" :width="item.width" :formatter="item.formatter"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" label="领养">
                        <template #default="scope">
                            <el-button type="primary" size="small" @click="addAdopter(scope.row)">给TA领养</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-drawer> -->
        </div>

        <el-dialog @closed="handleClose" top="5vh" width="35%" :title="action == 'edit' ? '编辑' : '新增'" v-model="showModal">
            <el-form ref="dialogForm" :model="petForm" label-width="80px" :rules="rules">
                <el-form-item label="宠物名" prop="petName">
                    <el-input v-model="petForm.petName" placeholder="请输入宠物名" />
                </el-form-item>
                <el-form-item label="种类" prop="petType">
                    <el-input v-model="petForm.petType" placeholder="请输入类型" />
                </el-form-item>
                <el-form-item label="性别" prop="petSex">
                    <el-radio-group v-model="petForm.petSex">
                        <el-radio label="公">公</el-radio>
                        <el-radio label="母">母</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄" prop="petAge">
                    <el-input v-model="petForm.petAge" placeholder="请输入年龄" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="petForm.remark" placeholder="请输入备注" />
                </el-form-item>
                <!-- 上传图片 -->
                <el-form-item label="宠物图片">
                    <el-upload :on-remove="handleRemove" v-model:file-list="fileList" multiple ref="upload" action=""
                        list-type="picture-card" :limit="3" :on-exceed="handleExceed" :before-remove="beforeRemove"
                        :before-upload="handleBeforeUpload" :on-change="handleOnChange" accept=".png,.jpg,.jpeg"
                        :http-request="upload">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit()">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <div class="pag">
            <el-pagination class="pagination" background layout="total, prev, pager, next, jumper" :total="pager.total"
                :current-page="pager.pageNum" :page-size="pager.pageSize" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>
   
<script>
import utils from '../utils/utils'
import _ from 'lodash'

export default {
    name: 'Adopt',
    data() {
        return {
            goods: {
                num1: null,
                num2: null,
                stock1: null,
                stock2: null,
            },
            action: 'add',
            fileList: [],


            petName: '',
            petId: 0,
            action: 'add',
            mode: [], //存放图片
            petForm: {},
            showModal: false,
            rules: {
                petName: [
                    { required: true, message: '请输入宠物名', trigger: 'blur' },
                ],
                petType: [
                    { required: true, message: '请输入种类', trigger: 'blur' },
                ],
                petSex: [
                    { required: true, message: '请选择性别', trigger: 'blur' },
                ],
                remark: [
                    { message: '请输入备注', trigger: 'blur' },
                ],
                petAge: [
                    { message: '请输入年龄', trigger: 'blur' },
                ],
            },
            drawer: false,
            list: [],
            petId: -1,
            listColumns: [
                // {
                //     width: 40,
                //     prop: 'userId',
                //     label: 'ID',
                // },
                {
                    width: 80,
                    prop: 'name',
                    label: '申请人姓名',
                },
                {
                    width: 100,
                    prop: 'phone',
                    label: '电话',
                },
                {
                    prop: 'applyTime',
                    label: '申请时间',
                    formatter: (row, column, value) => {
                        return utils.formateDate(new Date(value))
                    }
                },
            ],
            goodsList: [
                {
                    goodsId: 1,
                    goodsName: '商品1',
                    goodsType: '类型1',
                    goodsPrice: 100.00,
                    goodsDesc: '描述1描述1描述1描述1描述1描述1描述1',
                    goodsStatus: '上架',
                    goodsStock: 999,
                    goodsSales: 100,
                    updateTime: '2023-03-12 13:00:00',
                    goodsImg: [
                        'https://img0.baidu.com/it/u=1391154107,900911934&fm=253&fmt=auto&app=138&f=JPEG?w=543&h=500',
                        'https://img1.baidu.com/it/u=2033139256,46248154&fm=253&fmt=auto&app=138&f=JPEG?w=480&h=480'
                    ]
                }
            ],
            pager: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            columns: [
                {
                    width: 58,
                    label: "ID",
                    prop: "goodsId",
                },
                {
                    label: "商品名",
                    prop: "goodsName",
                },
                {
                    label: "商品类型",
                    prop: "goodsType",
                },
                {
                    label: "价格",
                    prop: "goodsPrice"
                },
                {
                    label: "商品描述",
                    prop: "goodsDesc",
                },
                {
                    label: "商品库存",
                    prop: "goodsStock",
                },
                {
                    label: "销量",
                    prop: "goodsSales",
                },
                {
                    width: 155,
                    label: "更新时间",
                    prop: "updateTime",
                    formatter: (row, column, value) => {
                        return utils.formateDate(new Date(value))
                    }
                },
            ],
        }
    },
    methods: {
        // 批量删除
        handleDeleteMany() {

        },
        // 添加商品
        handleCreate() {
            this.action = 'add'
            this.showModal = !this.showModal
            this.mode = []
            // 清除el-upload已选择的文件
            this.$refs['upload']?.clearFiles()
        },

        async addGoods(row) {
            try {
                console.log(row);
                await this.$api({
                    url: '/adopt/addAdopter',
                    method: 'post',
                    data: row
                })
                this.$message.success('操作成功')
                this.getAdoptList()
                this.drawer = false
            } catch (error) {
                console.log(error)
            }
        },


        async cancelAdopt(row) {
            try {
                await this.$api({
                    url: '/adopt/cancelAdopt',
                    method: 'post',
                    data: row
                })
                this.$message.success('取消成功')
                this.getAdoptList()
            } catch (error) {
                console.log(error)
            }
        },

        //图片上传
        upload(item) {
            console.log(item);
            this.mode.push(item.file)
            console.log("fileList", this.mode)
        },
        // 文件操作改变时重新验证
        handleOnChange(response, file, fileList) {
            this.$refs.dialogForm.validateField("file")
        },
        handleBeforeUpload(file) {
            let size = file.size / 1024 / 1024
            if (size > 0.5) {
                // this.$refs['upload'].clearFiles()
                this.$message.warning("文件大小不得超过0.5M")
                this.mode = []
                this.$refs.dialogForm.validateField("file")
                return false
            }
        },
        //限制传文件个数
        handleExceed(files, fileList) {
            this.$message.warning(`最多只能选择三个文件!`)
        },
        //上传文件移除事件
        beforeRemove(file, fileList) {
            //return this.$confirm(`确定移除 ${file.name}？`)

        },
        async handleRemove(uploadFile) {
            if (this.action == 'add') return
            // 移除文件时，删除mode里对应的文件
            this.mode = this.mode.filter(item => item.uid !== uploadFile.uid)
            console.log(this.mode);
            // 取最后一个斜杠后面的字符串作为文件名
            let delImg = uploadFile.url
            console.log(delImg);
            try {
                await this.$api({
                    url: '/adopt/delImg',
                    method: 'post',
                    data: {
                        delImg,
                        petId: this.petId
                    }
                })
                this.$message.success('删除成功')
                this.getAdoptList()
            } catch (error) {
                this.$message.error('删除失败')
            }
        },
        // 宠物列表
        async getAdoptList() {
            const res = await this.$api({
                url: '/adopt/list',
                data: {
                    ...this.pager,
                    ...this.adopt
                }
            })
            // 逆序
            this.goodsList = res.list
            this.pager.total = res.page.total
        },

        handleEdit(row) {
            this.petId = row.petId
            console.log('此时img', row.img);
            let temp = []
            row.img.forEach((item) => {
                // 取最后一些斜杠后面的字符串作为文件名
                let name = item.substring(item.lastIndexOf('/') + 1)
                temp.push({
                    name,
                    url: item
                })
            })
            this.fileList = temp
            console.log('fileList', this.fileList);
            this.action = 'edit'
            this.petForm = row
            this.showModal = !this.showModal
            this.mode = []
            this.$refs['upload']?.clearFiles()
        },
        handleClose() {
            console.log('close');
            this.showModal = false
            this.$refs.dialogForm.resetFields()
            // 清空文件
            this.mode = []
            this.$refs['upload']?.clearFiles()
            this.fileList = []
        },
        handleSubmit() {
            this.$refs.dialogForm.validate(async (valid) => {
                if (valid) {
                    let imgArr = []
                    try {
                        console.log('mode', this.mode);
                        if (this.mode.length !== 0) {
                            //上传图片
                            let fd = new FormData()
                            this.mode.forEach((item) => {
                                fd.append("file", item)
                            })
                            try {
                                const res = await this.$api({
                                    url: '/adopt/upload',
                                    method: 'post',
                                    data: fd,
                                })
                                imgArr = res
                                console.log('图片', res)
                            } catch (error) {
                                console.log(error)
                            }
                        }
                    } catch (error) {
                        this.$message.error('上传失败')
                    }
                    try {
                        let pet = this.petForm
                        delete pet.img
                        let params = pet
                        params.action = this.action
                        if (imgArr.length !== 0) {
                            params.addImg = imgArr
                        }
                        await this.$api({
                            url: '/adopt/add',
                            method: 'POST',
                            data: params
                        })
                        this.$message.success('提交成功')
                        this.showModal = false
                        this.handleCurrentChange(this.pager.pageNum)
                    } catch (error) {
                        this.$message.error('提交失败')
                    }
                } else {
                    return false
                }
            })
        },
        async del(row) {
            try {
                await this.$api({
                    url: '/adopt/delete',
                    method: 'post',
                    data: {
                        petId: row.petId
                    }
                })
                this.$message.success('删除成功')
            } catch (error) {
                this.$message.error('删除失败')
            }
            this.getAdoptList()
        },
        cancel() { },
        refresh: _.throttle(function () {
            this.getAdoptList()
            this.$message.success('刷新成功')
        }, 1000),
        async checkList(petId, petName) {
            this.drawer = true
            console.log(petId);
            // todo: 发请求获取申请领养该宠物的用户列表
            const res = await this.$api({
                url: '/adopt/applyList',
                method: 'post',
                data: {
                    petId
                }
            })
            this.list = res
            console.log(this.list);
            this.petId = petId
            this.petName = petName
        },
        handleQuery() {
            this.pager.pageNum = 1
            this.getAdoptList()
        },
        handleReset(formName) {
            this.$refs[formName].resetFields()
            this.pager.pageNum = 1
            this.getAdoptList()
        },
        handleCurrentChange(val) {
            this.pager.pageNum = val
            this.getAdoptList()
        },
    },
    mounted() {
        // this.getAdoptList()
    }
}
</script>

<style scoped>
:deep(.el-pagination.is-background .btn-next) {
    padding-left: 9px
}

:deep(.el-pagination.is-background .btn-prev) {
    padding-left: 9px
}

.pag {
    margin: 15px 0;
    text-align: center;
}

:deep(.el-drawer.rtl) {
    overflow-y: scroll;
}

:deep(.el-table__expanded-cell) {
    padding: 0 50px;
}

:deep(.el-tag) {
    cursor: pointer;
}
</style>