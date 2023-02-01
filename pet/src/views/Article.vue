<template>
    <div class="animated animate__fadeIn">
        <el-card style="margin-bottom:5px">
            <div class="query-form">
                <el-form ref="form" :inline="true" :model="art">
                    <el-form-item label="文章ID" prop="artId">
                        <el-input v-model="art.artId" placeholder="请输入文章ID" />
                    </el-form-item>
                    <el-form-item label="文章标题" prop="artTitle">
                        <el-input v-model="art.artTitle" placeholder="搜索文章" />
                    </el-form-item>
                    <el-form-item label="文章分类" prop="artType">
                        <el-select v-model="art.artType" placeholder="请选择文章分类">
                            <el-option v-for="item in cateList" :key="item.cateId" :label="item.cateName"
                                :value="item.cateId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleQuery">查询</el-button>
                        <el-button @click="handleReset('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <div class="table">
            <el-card>
                <el-table style="width:100%" :data="artList">
                    <el-table-column align="center" v-for="item in columns" :key="item.prop" :prop="item.prop"
                        :label="item.label" :width="item.width" :formatter="item.formatter">
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template #default="scope">
                            <el-popconfirm placement="top" title="确定删除该用户吗?" confirm-button-text="确定"
                                cancel-button-text="关闭" @confirm="handleDel">
                                <template #reference>
                                    <el-button type="danger">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

        </div>
        <div class="pag">
            <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
                :page-size="pager.pageSize" @current-change="handleCurrentChange" />
        </div>
    </div>

</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue"
// 使用store
// import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import utils from "../utils/utils"
import api from "../api/index"
// 富文本编辑器
import E from 'wangeditor'


export default {
    name: "User",
    data() {
        return {
            art: {},
            artList: [],
            pager: {
                pageNum: 1,
                pageSize: 9,
                total: 0
            },
            columns: [],
        }
    },
    mounted() {
        this.getArtList()
    },
    methods: {
        async getArtList() {
            try {
                const res = await this.$api({
                    url: "/article/list",
                    method: "get",
                    params: {
                        ...this.art,
                        ...this.pager
                    }
                })
                this.artList = res.data
                console.log(res);
            } catch (error) {

            }
        },
        handleQuery() {
            this.pager.pageNum = 1
            this.getArtList()
        },
        handleReset(formName) {
            this.$refs[formName].resetFields()
            this.pager.pageNum = 1
            this.getArtList()
        },
        handleCurrentChange(val) {
            this.pager.pageNum = val
            this.getArtList()
        },
        handleDel() {
            console.log("删除")
        },
    },
}
    //     const { ctx } = getCurrentInstance()
    //     const user = reactive({
    //         state: 1,
    //     })
    //     // 初始化用户列表数据
    //     const artList = ref([{
    //         userId: 1,
    //         userName: "admin",
    //         phone: "12345678901",
    //         createTime: new Date(),
    //         lastLoginTime: new Date(),
    //         state: 1,
    //     }])
    //     // 初始化分页对象
    //     const pager = reactive({
    //         pageNum: 1,
    //         pageSize: 9,
    //     })
    //     // 定义列
    //     const columns = reactive([
    //         {
    //             width: 60,
    //             label: "用户ID",
    //             prop: "userId",
    //         },
    //         {
    //             width: 310,
    //             label: "用户名",
    //             prop: "userName",
    //         },
    //         {
    //             width: 250,
    //             label: "手机号",
    //             prop: "phone",
    //         },
    //         {
    //             width: 250,
    //             label: "注册时间",
    //             prop: "createTime",
    //             formatter: (row, column, value) => {
    //                 return utils.formateDate(new Date(value))
    //             },
    //         },
    //         {
    //             width: 250,
    //             label: "最后登录时间",
    //             prop: "lastLoginTime",
    //             formatter: (row, column, value) => {
    //                 return utils.formateDate(new Date(value))
    //             },
    //         },
    //     ])

    //     // ---方法---
    //     // 查询
    //     const handleQuery = () => {
    //         getUserList()
    //     }
    //     // 重置查询表单
    //     const handleReset = (form) => {
    //         ctx.$refs[form].resetFields()
    //         // 重置分页
    //         pager.pageNum = 1
    //         getUserList()
    //     }
    //     // 获取用户列表
    //     const getUserList = async () => {
    //         ctx.$api = api
    //         let params = {
    //             // 为什么要转换成原始数据，因为reactive的数据是响应式的，会被vue劫持，导致请求参数不是我们想要的
    //             ...toRaw(user),
    //             ...toRaw(pager),
    //         }
    //         try {
    //             const { list, page } = await ctx.$api({
    //                 url: "/user/list",
    //                 method: "get",
    //                 data: params,
    //                 // 携带token
    //                 // headers: {
    //                 //     token: '',
    //                 // },
    //             })
    //             artList.value = list
    //             pager.total = page.total

    //         } catch (error) {
    //             ElMessage.error('不好意思，出错啦~')
    //         }
    //     }
    //     // 删除用户
    //     const handleDel = async (row) => {
    //         ElMessage.success('删除成功~')
    //     }
    //     // 分页事件处理
    //     const handleCurrentChange = (current) => {
    //         pager.pageNum = current
    //         getUserList()
    //     }

    //     // ---生命周期函数---
    //     onMounted(() => {
    //         console.log('mounted')
    //         getUserList()
    //     })

    //     return {
    //         user,
    //         handleReset,
    //         handleQuery,
    //         artList,
    //         columns,
    //         pager,
    //         handleCurrentChange,
    //         handleDel,
</script>
<style lang="scss" scoped>
:deep(.el-pagination.is-background .btn-next) {
    padding-left: 9px;
}

:deep(.el-pagination.is-background .btn-prev) {
    padding-left: 9px;
}

.table {
    min-height: 300px;
}

.pag {
    margin-top: 15px;
    text-align: center;
}
</style>