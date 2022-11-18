<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

<el-button type="text" @click="openChapterDialog">添加章节</el-button>

    <!-- 添加和修改章节表单 -->
<el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
    <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
            <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
            <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
    </div>
</el-dialog>

<!-- 添加和修改小节表单 -->
<el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
  <el-form :model="video" label-width="120px">
    <el-form-item label="小节标题">
      <el-input v-model="video.title"/>
    </el-form-item>
    <el-form-item label="小节排序">
      <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
    </el-form-item>
    <el-form-item label="是否免费">
      <el-radio-group v-model="video.isFree">
        <el-radio :label="true">免费</el-radio>
        <el-radio :label="false">默认</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="上传视频">
      <el-upload
           :on-success="handleVodUploadSuccess"
           :on-remove="handleVodRemove"
           :before-remove="beforeVodRemove"
           :on-exceed="handleUploadExceed"
           :file-list="fileList"
           :action="BASE_API+'/eduVod/video/uploadVideo'"
           :limit="1"
           class="upload-demo">
    <el-button size="small" type="primary">上传视频</el-button>
    <el-tooltip placement="right-end">
        <div slot="content">最大支持1G，<br>
            支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
            GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
            MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
            SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
        <i class="el-icon-question"/>
    </el-tooltip>
    </el-upload>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
  </div>
</el-dialog>

    <!-- 章节 -->
    <ul class="chanpterList">
    <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
            {{ chapter.title }}

            <span class="acts">
                <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
            </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
            <li
                v-for="video in chapter.children"
                :key="video.id">
                <p>{{ video.title }}

            <span class="acts">
                <el-button style="" type="text" @click="openEditVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
            </span>
                </p>
            </li>
        </ul>
    </li>
</ul>
    <div>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

</div>
</template>
<script>
import chapter from '@/api/edu/chapter'
export default {
    data(){
        return{
            saveBtnDisabled:false,
            chapterVideoList:[],
            courseId:'',
            dialogChapterFormVisible:false,
            chapter:{//章节对象
            title:'',
            sort:0
            },
            dialogVideoFormVisible:false,
            video:{//小节对象
            title:'',
            sort:0,
            isFree:0,
            videoSourceId:'',
            videoOriginalName:''
            },
            fileList:[],//上传文件列表
            BASE_API:process.env.BASE_API //接口API地址
        }
    },
    created(){
      //获取路由id
      if(this.$route.params && this.$route.params.id){
        this.courseId = this.$route.params.id
      //执行列表方法
        this.getChapterVideo()
      }
    },
    methods:{
        //删除之前方法
        beforeVodRemove(file,fileList){
            return this.$confirm(`确定删除${file.name}?`)
        },
        //上传之前的方法
        handleUploadExceed(){
            this.$message.warning('想要重新上传视频，请先删除已上传的视频')
        },
        //删除视频方法
        handleVodRemove(){
            chapter.deleteVideoByVideoId(this.video.videoSourceId)
                .then(response =>{
                    //提示
                    this.$message({
                        type: 'success',
                        message: "删除视频成功！"
                    });
                    //清空文件列表
                    this.fileList = []
                    //删除视频之后把video里的视频id清空
                    this.video.videoSourceId = ''
                    this.video.videoOriginalName = ''
                })
        },
        //上传视频成功方法
        handleVodUploadSuccess(response,file,fileList){
            this.video.videoSourceId = response.data.videoId
            this.video.videoOriginalName = file.name
        },
        next(){
            //跳到第三步
            this.$router.push({path:'/course/publish/' + this.courseId})
        },
        previous(){
            //返回上一步
            this.$router.push({path:'/course/info/' + this.courseId})
        },
        //根据课程id查询章节和小节
        getChapterVideo(){
          chapter.getAllChapterVideo(this.courseId)
              .then(response =>{
                this.chapterVideoList = response.data.allChapterVideo
              })
        },

//==========================章节操作==============================
        //保存或修改章节
        saveOrUpdate(){
            if(!this.chapter.courseId){
                //设置课程id到chapter对象
                this.chapter.courseId = this.courseId
                this.saveChapter()
            }else{
                this.updateChapter()
            }
        },
        //弹出添加章节页面
        openChapterDialog(){
            //弹框
            this.dialogChapterFormVisible = true
            //表单数据清空
            this.chapter.title = ''
            this.chapter.sort = 0
        },
        //修改章节弹框数据回显
        openEditChapter(chapterId){
            //弹框
            this.dialogChapterFormVisible = true
            //调用接口
            chapter.getChapterInfo(chapterId)
                .then(response =>{
                    this.chapter = response.data.chapter
                })
        },
        //修改章节信息
        updateChapter(){
            chapter.updateChapter(this.chapter)
                .then(response =>{
                    //关闭弹窗
                    this.dialogChapterFormVisible = false
                    //提示
                    this.$message({
                        type: 'success',
                        message: "修改章节成功！"
                    });
                    //刷新
                    this.getChapterVideo()
                })
        },
        //保存章节信息
        saveChapter(){
            chapter.addChapter(this.chapter)
                .then(response => {
                    //关闭弹窗
                    this.dialogChapterFormVisible = false
                    //提示
                    this.$message({
                        type: 'success',
                        message: "添加章节成功！"
                    });
                    //刷新
                    this.getChapterVideo()
                })
        },
        //删除章节
        deleteChapter(chapterId){
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() =>{
            chapter.deleteChapter(chapterId)
                .then(response =>{
                    //提示
                    this.$message({
                        type: 'success',
                        message: "删除章节成功！"
                    });
                    //刷新
                    this.getChapterVideo()
                })
        })
        },
//==========================小节操作==============================

        //打开小节弹框
        openVideo(chapterId){
            this.dialogVideoFormVisible=true

            //设置章节id
            this.video.chapterId = chapterId

            //表单清空
            this.video.title = ''
            this.video.sort = 0
            this.video.isFree = 0
        },

        saveOrUpdateVideo(){
            if(!this.video.courseId){
                this.saveVideo()
            }else{
                this.updateVideo()
            }
        },

        saveVideo(){
            //设置课程id
            this.video.courseId = this.courseId
            chapter.addVideo(this.video)
                .then(response =>{
                    //关闭弹窗
                    this.dialogVideoFormVisible = false
                    //提示
                    this.$message({
                        type: 'success',
                        message: "添加小节成功！"
                    });
                    //刷新
                    this.getChapterVideo()
                })
        },

        updateVideo(){
            chapter.updateVideo(this.video)
                .then(response =>{
                    //关闭弹窗
                    this.dialogVideoFormVisible = false
                    //提示
                    this.$message({
                        type: 'success',
                        message: "修改小节成功！"
                    });
                    //刷新
                    this.getChapterVideo()
                })
        },

        deleteVideo(videoId){
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() =>{
            chapter.deleteVideo(videoId)
                .then(response =>{
                    //提示
                    this.$message({
                        type: 'success',
                        message: "删除章节成功！"
                    });
                    //刷新
                    this.getChapterVideo()
                })
        })
        },

        //修改小节弹框数据回显
        openEditVideo(videoId){
            //弹框
            this.dialogVideoFormVisible = true
            //调用接口
            chapter.getVideo(videoId)
                .then(response =>{
                    this.video = response.data.video
                })
        },

    }
}
</script>