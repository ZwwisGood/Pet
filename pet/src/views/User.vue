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
                    <!-- 角色 -->
                    <el-form-item label="角色" prop="role">
                        <el-select v-model="user.role" placeholder="请选择" clearable>
                            <el-option label="普通用户" value="1"></el-option>
                            <el-option label="管理员" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleQuery"><i class="el-icon-search"></i>&nbsp;查询</el-button>
                        <el-button type="danger" @click="handleReset('form')"><i
                                class="el-icon-close"></i>&nbsp;重置</el-button>
                        <el-button type="success" @click="refresh"><i class="el-icon-refresh-left"></i>&nbsp;刷新</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>

        <div class="table">
            <el-card>
                <el-button type="primary" @click="handleCreate()"><i class="el-icon-plus"></i>添加用户/管理员</el-button>
                <el-table style="width:100%" :data="userList">
                    <el-table-column align="center" v-for="item in columns" :key="item.prop" :prop="item.prop"
                        :label="item.label" :width="item.width" :formatter="item.formatter">
                    </el-table-column>
                    <el-table-column align="center" label="角色">
                        <template #default="scope">
                            <el-tag v-if="scope.row.role == 1" type="success">普通用户</el-tag>
                            <el-tag v-else type="danger">管理员</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="150">
                        <template #default="scope">
                            <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
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
        <el-dialog width="35%" :title="action == 'edit' ? '编辑' : '新增'" v-model="showModal">
            <el-form ref="dialogForm" :model="userForm" label-width="80px" :rules="rules">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="userForm.userName" placeholder="请输入用户名称" />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="userForm.phone" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="初始密码" prop="userPwd">
                    <el-input v-model="userForm.userPwd" placeholder="请输入初始密码" />
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <!-- 单选框 -->
                    <el-radio-group v-model="userForm.role">
                        <el-radio :label="1">普通用户</el-radio>
                        <el-radio :label="2">管理员</el-radio>
                    </el-radio-group>
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
            <el-pagination :page-sizes="[8, 15, 20]" @size-change="handleSizeChange" class="pagination" background
                layout="total, prev, pager, next, jumper, sizes" :total="pager.total" :current-page="pager.pageNum"
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
import _ from 'lodash'

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
        const userForm = reactive({
            state: 1,
            role: 2,
            userPwd: '666666'
        })
        const showModal = ref(false)
        const action = ref('edit')
        const rules = reactive({
            userName: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
            ],
            phone: [
                { message: '请输入手机号', trigger: 'blur' },
                { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
            ],
            userPwd: [
                { required: true, message: '请输入初始密码', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
            role: [
                { required: true, message: '请选择角色', trigger: 'blur' },
            ],
        })
        const handleSizeChange = (number) => {
            pager.value.pageSize = number
            getUserList()
        }
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
        const pager = ref({
            pageNum: 1,
            pageSize: 8,
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
                label: '手机号',
                prop: 'phone',
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
        const handleCreate = () => {
            action.value = "add"
            showModal.value = true
        }
        const handleEdit = (row) => {
            action.value = "edit"
            ctx.$nextTick(() => {
                Object.assign(userForm, row)
            })
            showModal.value = true
        }
        const handleClose = () => {
            showModal.value = false
            ctx.$refs.dialogForm.resetFields()
        }
        const handleSubmit = async () => {
            ctx.$refs.dialogForm.validate(async (valid) => {
                if (valid) {
                    let params = toRaw(userForm)
                    params.action = action.value
                    let res = await ctx.$api({
                        url: "/user/add",
                        method: "post",
                        data: params
                    })
                    console.log(Boolean(res));
                    showModal.value = false
                    ElMessage.success('添加成功')
                    handleReset("dialogForm")
                    getUserList()
                }
            })
        }
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
            let token = JSON.parse(window.localStorage.getItem('petUserInfo')).token
            console.log(token);
            try {
                const { list, page } = await ctx.$api({
                    url: "/user/list",
                    method: "get",
                    data: params,
                })
                userList.value = list
                pager.total = page.total

            } catch (error) {
                // ElMessage.error('不好意思，出错啦~')
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
                ElMessage.error('不好意思，出错啦~')
            }
            ElMessage.success('删除成功')
            getUserList()
        }
        // 分页事件处理
        const handleCurrentChange = (current) => {
            pager.pageNum = current
            getUserList()
        }
        // lodash
        const refresh = _.throttle(function () {
            getUserList()
            ElMessage.success('刷新成功')
        }, 1000)


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
            refresh,
            showModal,
            userForm,
            action,
            handleCreate,
            handleClose,
            handleEdit,
            handleSubmit,
            rules,
            handleSizeChange,
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

.pag {
    margin: 15px 0;
    text-align: center;
}
</style>