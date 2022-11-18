<template>
    <div class="app-container">
        <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacherQuery.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacherQuery.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacherQuery.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacherQuery.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacherQuery.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
          <!-- 头衔缩略图 -->
          <pan-thumb :image="teacherQuery.avatar"/>
          <!-- 文件上传按钮 -->
          <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>
          <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调 -->
          <image-cropper
                        v-show="imagecropperShow"
                        :width="300"
                        :height="300"
                        :key="imagecropperKey"
                        :url="BASE_API+'/eduoss/fileoss'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>
      </el-form-item>      
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
    </div>
</template>

<script>

import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components:{ImageCropper,PanThumb},
    //写核心代码
    data(){ //定义变量和初始值
        return{
            teacherQuery:{}, //条件封装对象

            //上传弹框组件是否显示
            imagecropperShow:false,
            imagecropperKey:0,//唯一标识
            BASE_API:process.env.BASE_API,
            saveBtnDisabled: false // 保存按钮是否禁用,
        }
        
    },
    created(){
      //页面渲染之前执行
      this.init()
    },
    watch:{//监听
    $route(to,from){
      this.init()
    }
    },
    methods:{ //创建具体的方法，调用teacher.js定义的方法
        close(){//关闭上传弹框的方法
        this.imagecropperShow = false
        //上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
        },

        cropSuccess(data){//上传成功方法
        //上传之后接口返回图片地址
        this.imagecropperShow = false
        this.teacherQuery.avatar = data.url

        this.imagecropperKey = this.imagecropperKey + 1
        },


        init(){
          //判断路径是否有id值
        if(this.$route.params && this.$route.params.id){
          //从路径获取id值
          const id = this.$route.params.id
          //调用根据id查询的方法
          this.getInfo(id)
        }else{//路径没有id值
        //清空表单
        this.teacherQuery = {}
        }
        },

       saveOrUpdate(){
        //判断添加还是修改
        //根据teacher里是否有id
        if(!this.teacherQuery.id){
          this.saveTeacher()
        }else{
          this.updateTeacher()
        }
       },

       //添加讲师
       saveTeacher(){
        teacherApi.addTeacher(this.teacherQuery)
        .then(response =>{
            //提交信息
        this.$message({
          type: 'success',
          message: '保存成功!'
            });

            //路由跳转
        this.$router.push({ path: '/teacher/table' })
        })
       },

       //根据讲师id查询的方法
       getInfo(id){
        teacherApi.getTeacherInfo(id)
        .then(response =>{
          this.teacherQuery = response.data.teacher
        })
       },

       //编辑讲师的方法
       updateTeacher(){
        teacherApi.updateTeacherInfo(this.teacherQuery)
        .then(response =>{
          //提交信息
        this.$message({
          type: 'success',
          message: '修改成功!'
            });

            //路由跳转
        this.$router.push({ path: '/teacher/table' })
        })
       }
    }
}
</script>