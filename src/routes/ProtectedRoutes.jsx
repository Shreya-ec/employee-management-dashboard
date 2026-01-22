import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Sidebar from '../components/common/Sidebar/Sidebar'
import Topbar from '../components/common/Topbar/Topbar'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Topbar />
        {children}
      </div>
    </div>
  )
}

export default ProtectedRoute
