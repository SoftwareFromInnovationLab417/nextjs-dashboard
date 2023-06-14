import { API } from '@models/api'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/api',
})

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response)
    const { code, msg, data }: API = response.data
    if (code === 404 || code === 403) {
      response.data.code = 479
    }
    return response.data as API
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.error(error)
    throw error
  },
)

export default axiosInstance
