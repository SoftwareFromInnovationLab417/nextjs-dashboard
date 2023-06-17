import { API } from '@models/api'
import axios, { AxiosResponse } from 'axios'
import { deleteCookie, getCookie } from 'cookies-next'
import { NextRouter } from 'next/router'

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

export const redirectAuth = (code: number, router: NextRouter) => {
  if (code === 479) {
    const auth = getCookie('auth')
    if (auth) {
      deleteCookie('auth')
    }
    router.push('/')
  }
}

export default axiosInstance
