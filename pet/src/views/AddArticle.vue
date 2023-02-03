<template>
    <div class="animated animate__fadeIn">
        <el-card>
            <el-form ref="art" :rules="rules" :model="art">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="art.title" placeholder="请输入文章标题"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="art.type">
                        <el-radio-button @click="art.type == '公告'" label="公告" />
                        <el-radio-button @click="art.type == '养宠知识'" label="养宠知识" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <div id="wangeditor">
                        <div ref="editorElem"></div>
                    </div>
                    <div style="float:right;margin-top:10px">
                        <span style="margin-right: 50px" v-if="art.artId">您正在编辑ID为 {{ this.art.artId }} 的文章</span>
                        <el-popconfirm placement="top" title="确定清空所有内容吗?" confirm-button-text="确定"
                            cancel-button-text="关闭" @confirm="clear">
                            <template #reference>
                                <el-button type="danger" size="large">清空</el-button>
                            </template>
                        </el-popconfirm>
                        <el-button type="primary" size="large" @click="submit">提交</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import E from 'wangeditor'
export default {
    name: "AddArticle",
    data() {
        return {
            oldValue: [],
            newValue: [],
            art: { title: '', type: '公告', content: '' },
            editor: null,
            type: '公告',
            value: '',
            rules: {
                title: [
                    { required: true, min: 3, max: 20, message: '必填，且长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择文章类型', trigger: 'blur' },
                ],
                content: [
                    { required: true, message: '请输入文章内容', trigger: 'blur' },
                ],
            }
        }
    },
    created() {
    },
    mounted() {
        // this.id = JSON.parse(aaa)
        // console.log(this.id);
        this.editor = new E(this.$refs.editorElem)
        // wangeditor “＞=3.0.0“时会出现这个错误，需要手动设置一下兼容老版本。
        this.editor.customConfig = this.editor.customConfig ? this.editor.customConfig : this.editor.config
        //定义不需要显示的菜单      
        this.editor.config.excludeMenus = [
            "video", 'todo', 'table', 'code',
        ]
        // 宽度
        this.editor.config.height = 400
        this.editor.config.withCredentials = true
        this.editor.config.uploadImgServer = '/api/article/upload'
        this.editor.customConfig.uploadFileName = 'pic'
        this.editor.create()
        // 改变内容的时候
        this.editor.txt.eventHooks.changeEvents.push((e) => {
            // if (!this.editor.txt.html()) {
            //     return false;
            // }
            this.art.content = this.editor.txt.html()
            this.onchange(this.art.content)
        })
        if (this.$route.params.id) {
            // 回显
            this.art = JSON.parse(this.$route.params.id)
            this.editor.txt.html(this.art.content)
        }
    },
    methods: {
        show() {
            this.value = this.editor.txt.html()
        },
        clear() {
            this.editor.txt.clear()
            this.art.title = ''
        },
        submit() {
            // 表单验证成功后提示
            this.$refs.art.validate(async (valid) => {
                if (valid) {
                    try {
                        console.log(this.art);
                        const res = await this.$api({
                            method: 'post',
                            url: '/article/add',
                            data: this.art
                        })
                        this.$message.success('提交成功')
                    } catch (error) {
                        this.$message.error('添加失败')
                    }
                } else {
                    this.$message({
                        message: '请完善文章信息',
                        type: 'error'
                    })
                    return false;
                }
            });
        },
        onchange(html) {
            // 获取所有的img标签
            let imgArr = html.match(/<img.*?(?:>|\/>)/gi);
            // 获取所有src的值
            imgArr = imgArr?.map(item => item.match(/src=['"]?([^'"]*)['"]?/i)[1]);
            console.log('---', imgArr);
            console.log('old', this.oldValue);
            if (imgArr) {
                this.newValue = imgArr
            } else {
                this.newValue = []
            }
            console.log('new', this.newValue);
            console.log(this.oldValue.length, this.newValue.length)
            // 如果新的数组长度小于旧的数组长度，说明有图片被删除了
            if (this.newValue.length < this.oldValue.length) {
                // 获取被删除的图片
                const delImg = this.oldValue.filter(item => !this.newValue.includes(item))
                // 找到最后一个斜杠以后的字符（服务器上图片的名称）
                delImg[0] = delImg[0].match(/[^\/]+$/)[0]
                this.$api({
                    method: 'post',
                    url: '/article/delImg',
                    data: {
                        delImg: delImg[0]
                    }
                })
            }
            this.oldValue = this.newValue
        }
    }
}
</script>

<style lang="scss" scoped>

</style>