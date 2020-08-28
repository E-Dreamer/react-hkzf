import axios from 'axios'

export const getCurrentCity = () => {
    // 判断localStorage 中是否有定位城市
    const localcity = JSON.parse(localStorage.getItem('hkzf_city'))
    if (!localcity) {
        return new Promise((resolve, reject) => {
            // 通过ip定位 拿到当前的ip信息
            const curCity = new window.BMapGL.LocalCity();
            curCity.get(async res => {
                try{
                    const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
                    localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
                    resolve(result.data.body);
                }catch(e){
                    // 请求接口失败了
                    reject(e)
                }
            });
        })
    }else {
        // 为了返回值的统一 返回promise
        // 此处的promise不会失败 所以直接返回成功的promise
        return Promise.resolve(localcity)
    }
}

export {API} from './api'
export {BASE_URL} from './url'
// 导出 auth 模块中的所有内容
export * from './auth'

export * from './city'