import axios from 'axios'

const instance = () =>{
    
}
const api = axios.create({
    baseURL: ' http://localhost:8500/api',
    
})

export default api