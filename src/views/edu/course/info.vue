<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">
  <el-form-item label="课程标题">
    <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
  </el-form-item>

  <!-- 所属分类 TODO -->
<!-- 所属分类：级联下拉列表 -->
<!-- 一级分类 -->
<el-form-item label="课程类别">
  <el-select @change="getSubjectChildrenList"
    v-model="courseInfo.subjectParentId"
    placeholder="请选择">
    <el-option
      v-for="subject in subjectNestedList"
      :key="subject.id"
      :label="subject.title"
      :value="subject.id"/>
  </el-select>
  <!-- 二级分类 -->
<el-select v-model="courseInfo.subjectId" placeholder="请选择">
  <el-option
    v-for="subject in subSubjectList"
    :key="subject.value"
    :label="subject.title"
    :value="subject.id"/>
</el-select>
</el-form-item>

  <!-- 课程讲师 TODO -->
  <!-- 课程讲师 -->
<el-form-item label="课程讲师">
  <el-select
    v-model="courseInfo.teacherId"
    placeholder="请选择">
    <el-option
      v-for="teacher in teacherList"
      :key="teacher.id"
      :label="teacher.name"
      :value="teacher.id"/>
  </el-select>
</el-form-item>

  <el-form-item label="总课时">
    <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
  </el-form-item>
  <!-- 课程简介-->
<el-form-item label="课程简介">
    <tinymce :height="300" v-model="courseInfo.description"/>
</el-form-item>
  <!-- 课程封面 TODO -->
  <!-- 课程封面-->
<el-form-item label="课程封面">
  <el-upload
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :action="BASE_API+'/eduoss/fileoss'"
    class="avatar-uploader">
    <img :src="courseInfo.cover">
  </el-upload>
</el-form-item>

  <el-form-item label="课程价格">
    <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
  </el-form-item>
  <el-form-item>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
  </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import teacher from '@/api/edu/teacher'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
    data(){
        return{
            saveBtnDisabled:false,
            courseInfo:{
                title:'',
                subjectId:'',
                subjectParentId:'',
                teacherId:'',
                lessonNum:'',
                description:'',
                cover:'/static/蜡笔小新.jpg',
                price:0
            },
            BASE_API:process.env.BASE_API,//接口API地址
            subjectNestedList: [],//一级分类列表
            subSubjectList: [],//二级分类列表
            teacherList: [], // 讲师列表
            courseId:'',//课程id
        }
    },
    created(){
        //获取路由id
        if(this.$route.params && this.$route.params.id){
          this.courseId = this.$route.params.id
        //执行列表方法
          this.getCourseInfo() //有id值做回显 + 修改操作
        }else{
        //无id值做添加操作
        //初始化所有讲师列表
          this.getListTeacher()
        //初始化一级分类课程列表
          this.getSubjectList()
        }
    },
    methods:{
        //添加课程
        addCourse(){
            course.addCourseInfo(this.courseInfo)
                .then(response =>{
                    //提示
                    this.$message({
                        type: 'success',
                        message: "保存成功！"
                    })
                    //跳转到第二步
                    this.$router.push({path:'/course/chapter/'+ response.data.courseId})
                })
        },
        //修改课程
        updateCourse(){
          course.updateCourseInfo(this.courseInfo)
              .then(response =>{
                //提示
                    this.$message({
                        type: 'success',
                        message: "修改成功！"
                    })
                    //跳转到第二步
                    this.$router.push({path:'/course/chapter/'+ this.courseId})
              })
        },
        saveOrUpdate(){
            //判断是否有id
            if(!this.courseInfo.id){
              this.addCourse()
            }else{
              this.updateCourse()
            }
        },
        //得到所有讲师列表
        getListTeacher(){
            teacher.getListTeacher()
                 .then(response =>{
                    this.teacherList = response.data.items
                 })
        },
        //显示一级分类课程
        getSubjectList(){
            subject.getSubjectList()
                 .then(response =>{
                    this.subjectNestedList = response.data.list
                 })
        },
        //显示二级分类课程
        getSubjectChildrenList(value){      
        for (let i = 0; i < this.subjectNestedList.length; i++) {
            if (this.subjectNestedList[i].id === value) {
            this.subSubjectList = this.subjectNestedList[i].children
            //把二级分类id值清空
            this.courseInfo.subjectId = ''
            }}
        },
        //上传封面之前调用的方法
        beforeAvatarUpload(file){
          const isJPG = file.type === 'image/jpeg'
          const isLt2M = file.size / 1024 / 1024 < 2
          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!')
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
          }
          return isJPG && isLt2M
        },
        //上传成功调用的方法
        handleAvatarSuccess(res,file){
          this.courseInfo.cover=res.data.url
          //提示
          this.$message({
              type: 'success',
              message: "保存成功！"
          })
        },
        //课程信息回显
        getCourseInfo(){
          course.getCourseInfo(this.courseId)
              .then(response =>{
                this.courseInfo=response.data.courseInfoVo
                //查询二级课程列表
                subject.getSubjectList()
                    .then(response =>{
                      //获取所有得一级分类列表
                      this.subjectNestedList=response.data.list
                      //遍历所有得一级分类，比较id
                        for(var i=0;i<this.subjectNestedList.length;i++){
                          if(this.courseInfo.subjectParentId == this.subjectNestedList[i].id){
                          //获取一级分类中得所有二级分类
                          this.subSubjectList = this.subjectNestedList[i].children
                        }
                      }
                    })
                    //初始化所有讲师列表
                    this.getListTeacher()
              })
        }
    }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>