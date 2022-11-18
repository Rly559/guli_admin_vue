import request from '@/utils/request'

export default {

    //1 添加课程
    addCourseInfo(courseInfo){
        return request({
            url: `/eduservice/course/addCourseInfo`,
            method: 'post',
            data:courseInfo
          })
    },
    //回显课程消息
    getCourseInfo(courseId){
        return request({
            url: `/eduservice/course/getCourseInfo/${courseId}`,
            method: 'get'
          })
    },
    //修改课程信息
    updateCourseInfo(courseInfo){
        return request({
            url: `/eduservice/course/updateCourseInfo`,
            method: 'post',
            data:courseInfo
          })
    },
    //根据课程id查询课程确认信息
    getPublishCourseInfo(courseId){
        return request({
            url:`/eduservice/course/getPublishCourseInfo/${courseId}`,
            method:'get'
        })
    },
    //最终发布
    publishCourse(courseId){
        return request({
            url:`/eduservice/course/publishCourse/${courseId}`,
            method:'post'
        })
    },
    //课程列表(条件查询+分页)
    pageCourseCondition(current,limit,courseQuery){
        return request({
            url:`/eduservice/course/pageCourseCondition/${current}/${limit}`,
            method:'post',
            data:courseQuery
        })
    },
    //更改课程状态
    updateStatusCourse(courseId){
        return request({
            url:`/eduservice/course/updateStatusCourse/${courseId}`,
            method:'post'
        })
    },
    //更改课程状态
    deleteCourse(courseId){
        return request({
            url:`/eduservice/course/deleteCourse/${courseId}`,
            method:'delete'
        })
    }
}