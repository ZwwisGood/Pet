<template>
    <div class="animated animate__fadeIn">
        <el-card style="margin-bottom:5px">
            <div class="query-form">
                <el-form ref="form" :inline="true" :model="help">
                    <el-form-item label="求助人" prop="name">
                        <el-input v-model="help.name" placeholder="请输入求助人姓名" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select clearable v-model="help.status" placeholder="筛选状态">
                            <el-option value="待处理">待处理</el-option>
                            <el-option value="救助中">救助中</el-option>
                            <el-option value="救助成功">救助成功</el-option>
                            <el-option value="救助失败">救助失败</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="求助时间" prop="createTime">
                        <el-date-picker start-placeholder="起始日期" end-placeholder="结束日期" v-model="help.createTime"
                            type="daterange" range-separator="至" value-format="YYYY-MM-DD HH:mm:ss" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleQuery"><i
                                class="el-icon-search"></i>&nbsp;查询</el-button>
                        <el-button type="danger" @click="handleReset('form')"><i
                                class="el-icon-close"></i>&nbsp;重置</el-button>
                        <el-button type="success" @click="refresh"><i
                                class="el-icon-refresh-left"></i>&nbsp;刷新</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <div class="table">
            <el-card>
                <el-table style="width:100%" :data="helpList">
                    <el-table-column align="center" v-for="item in columns" :key="item.prop" :prop="item.prop"
                        :sortable="item.label == '更新时间' || item.label == '求助时间' || item.label == 'ID'"
                        :label="item.label" :width="item.width" :formatter="item.formatter" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" label="图片">
                        <template #default="scope">
                            <el-image style="width: 50px; height: 50px" :src="scope.row.img[0]"
                                :preview-src-list="scope.row.img" :zoom-rate="1.2" :initial-index="1" fit="cover" />
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态" width="140">
                        <template #default="scope">
                            <div style="display:flex">
                                <el-select v-model="scope.row.status">
                                    <el-option label="待处理" value="待处理"
                                        @click="handleUpdate(scope.row.helpId, '待处理')"></el-option>
                                    <el-option label="救助中" value="救助中"
                                        @click="handleUpdate(scope.row.helpId, '救助中')"></el-option>
                                    <el-option label="救助成功" value="救助成功"
                                        @click="handleUpdate(scope.row.helpId, '救助成功')"></el-option>
                                    <el-option label="救助失败" value="救助失败"
                                        @click="handleUpdate(scope.row.helpId, '救助失败', scope.row.index)"></el-option>
                                </el-select>
                                <i v-if="scope.row.status == '待处理'" style="color:transparent"
                                    class="el-icon-remove"></i>
                                <i v-if="scope.row.status == '救助中'" style="color:yellow" class="el-icon-remove"></i>
                                <i v-if="scope.row.status == '救助成功'" style="color:#6bb82f" class="el-icon-success"></i>
                                <el-tooltip v-if="scope.row.status == '救助失败'" :content="`失败理由:${scope.row.failReason}`"
                                    placement="top">
                                    <i v-if="scope.row.status == '救助失败'" style="color:red" class="el-icon-error"></i>
                                </el-tooltip>
                            </div>

                            <!-- <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-popconfirm placement="top" title="确定删除该文章吗?" confirm-button-text="确定"
                                cancel-button-text="关闭" @confirm="handleDel(scope.row)">
                                <template #reference>
                                    <el-button type="danger">删除</el-button>
                                </template>
                            </el-popconfirm> -->
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

        </div>
        <div class="pag">
            <el-pagination class="pagination" background layout="total, prev, pager, next, jumper" :total="pager.total"
                :current-page="pager.pageNum" :page-size="pager.pageSize" @current-change="handleCurrentChange" />
        </div>
    </div>
    <!-- <div> -->
    <!--地区选择器-->
    <!-- <elui-china-area-dht @change="onChange"></elui-china-area-dht> -->
    <!-- </div> -->
</template>
   
<script>
import { EluiChinaAreaDht } from 'elui-china-area-dht'
import utils from '../utils/utils'
import _ from 'lodash'

export default {
    name: 'Help',
    components: {
        EluiChinaAreaDht
    },
    data() {
        return {
            failReason: '',
            chinaData: [],
            srcList: [
                'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
                'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
                'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
                'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
                'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
                'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
                'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
            ],
            help: {
                createTime: [],
            },
            helpList: [],
            pager: {
                pageNum: 1,
                pageSize: 6,
                total: 0
            },
            columns: [
                {
                    width: 58,
                    label: "ID",
                    prop: "helpId",
                },
                {
                    label: "地点",
                    prop: "place",
                },
                {
                    label: "详细地点",
                    prop: "detailPlace",
                },
                {
                    label: "求助人电话",
                    prop: "phone",
                },
                {
                    label: "求助人姓名",
                    prop: "name",
                },
                {
                    label: "动物",
                    prop: "petName",
                },
                {
                    label: "备注",
                    prop: "remark",
                },
                {
                    width: 150,
                    label: "求助时间",
                    prop: "createTime",
                    // 排序
                    formatter: (row, column, value) => {
                        return utils.formateDate(new Date(value))
                    }
                },
                {
                    width: 150,
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
        async getHelpList() {
            let res
            if (this.help.createTime != null && this.help.createTime != undefined && this.help.createTime.length > 0) {
                res = await this.$api({
                    url: '/help/list',
                    data: {
                        ...this.pager,
                        ...this.help,
                        // 转换成TZ格式
                        createTime1: new Date(this.help.createTime[0]).toISOString(),
                        createTime2: new Date(this.help.createTime[1]).toISOString()
                    }
                })
            } else {
                res = await this.$api({
                    url: '/help/list',
                    data: {
                        ...this.pager,
                        ...this.help,
                    }
                })
            }
            // 逆序
            this.helpList = res.list
            this.pager.total = res.page.total
        },
        handleQuery() {
            this.pager.pageNum = 1
            console.log(this.pager.pageNum);
            this.getHelpList()
        },
        handleReset(formName) {
            this.$refs[formName].resetFields()
            this.pager.pageNum = 1
            this.getHelpList()
        },
        handleCurrentChange(val) {
            this.pager.pageNum = val
            this.getHelpList()
        },
        refresh: _.throttle(function () {
            this.getHelpList()
            this.$message.success('刷新成功')
        }, 1000),
        async handleUpdate(helpId, status) {
            try {
                let params = {
                    helpId,
                    status,
                    failReason: '',
                    updateTime: new Date()
                }
                if (status == '救助失败') {
                    await this.$prompt('请输入救助失败原因', '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        showClose: false,
                        closeOnClickModal: false,
                    }).then(({ value }) => {
                        params = {
                            helpId,
                            status,
                            failReason: value,
                            updateTime: new Date()
                        }
                    })
                }
                await this.$api({
                    url: '/help/update',
                    method: 'POST',
                    data: params
                })
                this.getHelpList()
                this.$message.success('修改成功')
            } catch (error) {
                this.$message.error('修改失败')
            }
        }
        // 省份
        // onChange(e) {
        //     console.log(e);
        //     const province = this.chinaData[e[0]]
        //     const city = this.chinaData[e[1]]
        //     const area = this.chinaData[e[2]]
        //     console.log(province.label, city.label, area.label)
        // }
    },
    mounted() {
        this.getHelpList()
        // 省份
        // const chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat
        // this.chinaData = chinaData
    }
}
</script>

<style scoped>
:deep(.el-pagination.is-background .btn-next) {
    padding-left: 9px;
}

:deep(.el-pagination.is-background .btn-prev) {
    padding-left: 9px;
}

.pag {
    margin-top: 15px;
    text-align: center;
}
</style>