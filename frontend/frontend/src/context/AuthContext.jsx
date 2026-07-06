import { createContext, useContext, useState } from 'react'
import { authApi } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'))
  const [phone, setPhone] = useState(() => localStorage.getItem('user_phone'))

  const login = async (phoneNumber, password) => {
    const res = await authApi.login({ phone: phoneNumber, password })
    localStorage.setItem('access_token', res.data.access_token)
    localStorage.setItem('refresh_token', res.data.refresh_token)
    localStorage.setItem('user_phone', phoneNumber)
    setToken(res.data.access_token)
    setPhone(phoneNumber)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_phone')
    setToken(null)
    setPhone(null)
  }

  return (
    <AuthContext.Provider value={{ token, phone, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
