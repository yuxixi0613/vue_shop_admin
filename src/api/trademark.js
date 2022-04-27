import request from '@/utils/request'

export default {
    //删除
    remove(id) {
        return request.delete(`/admin/product/baseTrademark/remove/${id}`)
    },

    //添加或修改的接口请求函数
    addOrUpdate(trademark) {
        if (trademark.id) {
            // 若id存在则是在修改
            return request.put("/admin/product/baseTrademark/update", trademark)
        } else {
            // 若id不存在则是在添加
            return request.post("/admin/product/baseTrademark/save", trademark)
        }
    },

    //查
    getPageList(page, limit) {
        return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
    }
}

//最后暴露出去的是这样的结构
// {
//     default:{}
// }

