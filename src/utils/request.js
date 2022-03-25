import axios from "axios";
import { MessageBox } from "element-ui";

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
});

// request interceptor
service.interceptors.request.use(
    config => {
        if (config.method === 'get') {
            console.log('get发送的参数为：', JSON.stringify(config.params))
            config.params = {
                // 如果是 get方法 则进行base64编码
                params: window.btoa(JSON.stringify(config.params))
            }
        }
        // if (store.getters.token) {
        //     // let each request carry token
        //     // ['X-Token'] is a custom headers key
        //     // please modify it according to the actual situation
        //     config.headers['Authorization'] = getToken()
        // }
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data
        // if the custom code is not 20000, it is judged as an error.
        if (res.msg !== 'ok') {
            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                console.log(res.code);
                alert(res.code + "响应拦截器！！！")
            }
            return Promise.reject(res.msg || 'Error')
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error)
        return Promise.reject(error)
    }
)

export default service
