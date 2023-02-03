<template>
    <div class="animated animate__fadeIn">
        <el-card style="margin-bottom:5px">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="user">
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model="user.userId" placeholder="请输入用户ID" />
                </el-form-item>
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="user.userName" placeholder="请输入用户名称" />
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
            <el-table style="width:100%" :data="userList">
                <el-table-column align="center" v-for="item in columns" :key="item.prop" :prop="item.prop"
                    :label="item.label" :width="item.width" :formatter="item.formatter">
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                    <template #default="scope">
                        <el-popconfirm placement="top" title="确定删除该用户吗?" confirm-button-text="确定"
                            cancel-button-text="关闭" @confirm="handleDel(scope.row.userId)">
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

export default {
    name: "User",
    setup() {
        // const store = useStore() // 使用store
        // console.log(store.state.user.b);
        const { ctx } = getCurrentInstance()
        ctx.$api = api
        const user = reactive({
            state: 1,
        })
        // 初始化用户列表数据
        const userList = ref([{
            userId: 1,
            userName: "admin",
            phone: "12345678901",
            createTime: new Date(),
            lastLoginTime: new Date(),
            state: 1,
        }])
        // 初始化分页对象
        const pager = reactive({
            pageNum: 1,
            pageSize: 9,
            total: 0
        })
        // 定义列
        const columns = reactive([
            {
                width: 60,
                label: "用户ID",
                prop: "userId",
            },
            {
                width: 310,
                label: "用户名",
                prop: "userName",
            },
            {
                width: 250,
                label: "手机号",
                prop: "phone",
            },
            {
                width: 250,
                label: "注册时间",
                prop: "createTime",
                formatter: (row, column, value) => {
                    return utils.formateDate(new Date(value))
                },
            },
            {
                width: 250,
                label: "最后登录时间",
                prop: "lastLoginTime",
                formatter: (row, column, value) => {
                    return utils.formateDate(new Date(value))
                },
            },
        ])

        // ---方法---
        // 查询
        const handleQuery = () => {
            getUserList()
        }
        // 重置查询表单
        const handleReset = (form) => {
            ctx.$refs[form].resetFields()
            // 重置分页
            pager.pageNum = 1
            getUserList()
        }
        // 获取用户列表
        const getUserList = async () => {
            let params = {
                // 为什么要转换成原始数据，因为reactive的数据是响应式的，会被vue劫持，导致请求参数不是我们想要的
                ...toRaw(user),
                ...toRaw(pager),
            }
            try {
                const { list, page } = await ctx.$api({
                    url: "/user/list",
                    method: "get",
                    data: params,
                    // 携带token
                    // headers: {
                    //     token: '',
                    // },
                })
                userList.value = list
                pager.total = page.total

            } catch (error) {
                ElMessage.error('不好意思，出错啦~')
            }
        }
        // 删除用户
        const handleDel = async (userId) => {
            try {
                await ctx.$api({
                    url: "/user/del",
                    method: "post",
                    data: {
                        userId
                    },
                })
            } catch (error) {

            }
            ElMessage.success('删除成功')
            getUserList()
        }
        // 分页事件处理
        const handleCurrentChange = (current) => {
            pager.pageNum = current
            getUserList()
        }

        // ---生命周期函数---
        onMounted(() => {
            console.log('mounted')
            getUserList()
        })

        return {
            user,
            handleReset,
            handleQuery,
            userList,
            columns,
            pager,
            handleCurrentChange,
            handleDel,
        }
    }
}
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