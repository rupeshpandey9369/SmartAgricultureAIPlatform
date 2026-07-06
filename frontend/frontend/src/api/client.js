import axios from 'axios'

const CORE_API_URL = 'http://localhost:8000'
const AI_SERVICE_URL = 'http://localhost:8001'

export const coreApi = axios.create({ baseURL: CORE_API_URL })
export const aiApi = axios.create({ baseURL: AI_SERVICE_URL })

// Attach the access token to every core-api request automatically
coreApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  register: (data) => coreApi.post('/auth/register', data),
  verifyOtp: (data) => coreApi.post('/auth/verify-otp', data),
  resendOtp: (phone) => coreApi.post(`/auth/resend-otp?phone=${encodeURIComponent(phone)}`),
  login: (data) => coreApi.post('/auth/login', data),
}

export const farmsApi = {
  list: () => coreApi.get('/farms'),
  create: (data) => coreApi.post('/farms', data),
  update: (id, data) => coreApi.patch(`/farms/${id}`, data),
  remove: (id) => coreApi.delete(`/farms/${id}`),
}

export const diseaseApi = {
  predict: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return aiApi.post('/disease/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
