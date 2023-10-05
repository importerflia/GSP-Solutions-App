import axios from 'axios'
import { API_URI } from './env'

const clienteAxios = axios.create({
    baseURL: `${API_URI}/api`
})

export default clienteAxios