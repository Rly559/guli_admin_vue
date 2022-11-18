import request from '@/utils/request'

export default {

    //1 获取章节 小节列表
    getAllChapterVideo(courseId){
        return request({
            url: `/eduservice/chapter/getChapterVideo/${courseId}`,
            method: 'get'
          })
    },
    //删除视频
    deleteVideoByVideoId(VideoId){
        return request({
            url: `/eduVod/video/${VideoId}`,
            method:'delete'
        })
    },
//==========================章节操作==============================
    //添加章节
    addChapter(chapter){
        return request({
            url: `/eduservice/chapter/addChapterInfo`,
            method:'post',
            data:chapter
        })
    },

    //修改章节
    updateChapter(chapter){
        return request({
            url: `/eduservice/chapter/updateChapter`,
            method:'post',
            data:chapter
        })
    },

    //查询章节
    getChapterInfo(chapterId){
        return request({
            url: `/eduservice/chapter/getChapterInfo/${chapterId}`,
            method:'get'
        })
    },

    //删除章节
    deleteChapter(chapterId){
        return request({
            url: `/eduservice/chapter/${chapterId}`,
            method:'delete'
        })
    },
//==========================小节操作==============================  
    
    //添加小节
    addVideo(video){
        return request({
            url: `/eduservice/video/addVideo`,
            method:'post',
            data:video
        })
    },

    //删除小节
    deleteVideo(videoId){
        return request({
            url: `/eduservice/video/${videoId}`,
            method:'delete'
        })
    },

    //修改小节
    updateVideo(video){
        return request({
            url: `/eduservice/video/updateVideo`,
            method:'post',
            data:video
        })
    },

    //查询小节
    getVideo(videoId){
        return request({
            url: `/eduservice/video/${videoId}`,
            method:'get'
        })
    },
}
