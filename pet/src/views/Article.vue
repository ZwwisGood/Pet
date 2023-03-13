<template>
    <div class="animated animate__fadeIn">
        <el-card style="margin-bottom:5px">
            <div class="query-form">
                <el-form ref="form" :inline="true" :model="art">
                    <el-form-item label="文章ID" prop="artId">
                        <el-input v-model="art.artId" placeholder="请输入文章ID" />
                    </el-form-item>
                    <el-form-item label="文章标题" prop="artTitle">
                        <el-input v-model="art.artTitle" placeholder="请输入文章标题" />
                    </el-form-item>
                    <el-form-item label="文章分类" prop="artType">
                        <el-select clearable v-model="art.artType" placeholder="请选择文章分类">
                            <el-option value="公告">公告</el-option>
                            <el-option value="养宠知识">养宠知识</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleQuery"><i class="el-icon-search"></i>&nbsp;查询</el-button>
                        <el-button type="danger" @click="handleReset('form')"><i
                                class="el-icon-close"></i>&nbsp;重置</el-button>
                        <el-button type="success" @click="refresh"><i class="el-icon-refresh-left"></i>&nbsp;刷新</el-button>
                        <el-button type="primary" @click="export1">导出Excel</el-button>

                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <div class="table">
            <el-card>
                <el-table v-loading="showLoading" style="width:100%" :data="artList" id="my-table">
                    <el-table-column align="center" v-for="item in columns" :key="item.prop" :prop="item.prop"
                        :sortable="item.label == '文章ID' || item.label == '创建时间'" :label="item.label" :width="item.width"
                        :formatter="item.formatter" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="145">
                        <template #default="scope">
                            <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-popconfirm placement="top" title="确定删除该文章吗?" confirm-button-text="确定"
                                cancel-button-text="关闭" @confirm="handleDel(scope.row.artId)">
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
            <el-pagination :page-sizes="[9, 15, 20]" @size-change="handleSizeChange" class="pagination" background
                layout="total, prev, pager, next, jumper, sizes" :total="pager.total" :current-page="pager.pageNum"
                :page-size="pager.pageSize" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script>
import utils from "../utils/utils"
import _ from 'lodash'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx';

export default {
    name: "User",
    data() {
        return {
            showLoading: true,
            art: {
                status: 1
            },
            artList: [],
            pager: {
                pageNum: 1,
                pageSize: 9,
                total: 0
            },
            columns: [
                {
                    label: "文章ID",
                    prop: "artId",
                },
                {
                    label: "文章标题",
                    prop: "title",
                },
                {
                    label: "文章分类",
                    prop: "type",
                },
                {
                    label: "文章内容",
                    prop: "content",
                },
                {
                    label: "点赞量",
                    prop: "like",
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    formatter: (row, column, value) => {
                        return utils.formateDate(new Date(value))
                    }
                },
            ],
        }
    },
    mounted() {
        this.getArtList()
        this.showLoading = false
    },
    methods: {
        handleSizeChange(number) {
            this.pager.pageSize = number
            this.getArtList()
        },
        // import1(e) {
        //     const files = e.target.files;
        //     if (files.length <= 0) {
        //         return false
        //     } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        //         return false
        //     }
        //     // 读取表格数据
        //     const fileReader = new FileReader();
        //     fileReader.onload = ev => {
        //         const workbook = XLSX.read(ev.target.result, {
        //             type: "binary"
        //         })
        //         const wsname = workbook.SheetNames[0];
        //         const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
        //         this.dealExcel(ws);//转换数据格式
        //         this.artList = ws;//赋值
        //     }
        //     fileReader.readAsBinaryString(files[0])
        // },
        // dealExcel(ws) {
        //     let keymap = { // 转换的开头
        //         "文章ID": "artId",
        //         "文章标题": 'title',
        //         "文章分类": 'type',
        //         "文章内容": 'content',
        //         "点赞量": 'like',
        //         "创建时间": 'createTime',
        //     }
        //     ws.forEach(sourceObj => {
        //         Object.keys(sourceObj).map(keys => {
        //             let newKey = keymap[keys];
        //             if (newKey) {
        //                 sourceObj[newKey] = sourceObj[keys]
        //                 delete sourceObj[keys]
        //             }
        //         })
        //     })
        //     this.artList = ws
        // },

        export1() {
            var wb = XLSX.utils.table_to_book(document.querySelector('#my-table'))
            for (let i = 1; i <= 10; i++) {
                delete wb.Sheets.Sheet1['G' + i]
            }
            var wbout = XLSX.write(wb, {
                bookType: 'xlsx',
                bookSST: true,
                type: 'array'
            })
            try {
                FileSaver.saveAs(new Blob([wbout], {
                    type: 'application/octet-stream'
                }), '乐宠文章.xlsx')
            } catch (e) {
                if (typeof console !== 'undefined') console.log(e, wbout);
            }
            return wbout
        },
        async getArtList() {
            try {
                const res = await this.$api({
                    url: "/article/list",
                    method: "get",
                    data: {
                        ...this.art,
                        ...this.pager
                    }
                })
                this.artList = res.list
                this.pager.total = res.page.total
            } catch (error) {

            }
        },
        refresh: _.throttle(function () {
            this.getArtList()
            this.$message.success('刷新成功')
        }, 1000),
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
        handleDel(artId) {
            try {
                this.$api({
                    url: "/article/del",
                    method: "post",
                    data: {
                        artId
                    }
                })
                this.getArtList()
                this.$message.success("删除成功")
            } catch (error) {
                this.$message.error("删除失败")
            }
        },
        handleEdit(art) {
            // 新版本路由传参
            let string = JSON.stringify(art)
            this.$router.push({
                name: "AddArticle",
                params: {
                    id: string
                }
            })
        }
    },
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