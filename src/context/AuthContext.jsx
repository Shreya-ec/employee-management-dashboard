import { createContext, useState, useEffect } from 'react';
import { mockUsers } from '../utils/mockData';

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(mockUsers);

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    const storedAuth = localStorage.getItem('isAuthenticated')
    const storedUser = localStorage.getItem('user')
    
    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    if (email && password) {
      const userData = {
        email,
        name: email.split('@')[0],
        id: Date.now()
      }
      setIsAuthenticated(true)
      setUser(userData)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const updateEmployees = (updatedEmployees) => {
    setEmployees(updatedEmployees);
  };

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.clear()
  }

  const value = {
    isAuthenticated,
    user,
    employees,
    updateEmployees,
    loading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
