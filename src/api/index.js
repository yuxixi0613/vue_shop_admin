//这个文件是把api的所有模块全部引入再暴露

//默认暴露的不能简写，只能这样全写
export {default as trademark} from './trademark'
export {default as attr} from './attr'
export {default as category} from './category'
export {default as spu} from './spu'
export {default as sku} from './sku'

//分别暴露的可以这样简写
export * as user from './user'