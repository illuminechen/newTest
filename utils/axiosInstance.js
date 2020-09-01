/**
 * 
 * @author samuel chuang <sam3855043@gmail.com> 
 * @license 
 * @copyright 2015 Information Center of Church in Taipei
 * @desc this function is catch all memeber district_name and become filter for table filter
 *       filterOptionsdata=>all memberfilter district
 *       filterOptionsdata  according memberfilter to build
 * 
 */
//   请求错误处理
// 不設定即採用默認值 timeout 為 0
import axios from 'axios'
import {
  notification
} from 'antd';
// 覆蓋原始 instance


const instance = axios.create({
  // baseURL: 'https://jsonplaceholder.typicode.com'
  headers:{'Access-Control-Allow-Origin':'*'}
});


// Obviously, you can set your own interceptors:
// axios.interceptors.request.... etc
 instance.defaults.timeout = 2500

 instance.interceptors.request.use(async(config) => {
    console.log('interceptors.reques')
    return config
  },err => {
    return Promise.reject(err);
  })

// 响应错误处理
instance.interceptors.response.use(async(res) =>{
    return res;
},err => {
    // 响应错误的常见状态码 5XX 500-服务器错误 502-服务器重启     
    console.log('error',err)
  }
);



export default instance;    