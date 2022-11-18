import request from '@/utils/request'

export default {

    //1 讲师列表(条件查询分页)
    getTeacherListPage(current,limit,teacherQuery){
        return request({
            //url: '/eduservice/teacher/pageTeacherCondition/'+current+"/"+limit,
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            data: teacherQuery
          })
    },

    deleteTeacherId(id){
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'delete',
        })
    },

    addTeacher(teacherQuery){
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method:'post',
            data:teacherQuery
        })
    },
    //显示回显
    getTeacherInfo(id){
        return request({
            url: `/eduservice/teacher/getTeacher/${id}`,
            method:'get',
        })
    },
    //修改讲师
    updateTeacherInfo(teacher){
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method:'post',
            data:teacher
        })
    },
    //查所有讲师列表(不分页)
    getListTeacher(){
        return request({
            url: `/eduservice/teacher/findAll`,
            method:'get'
        })
    }
}

