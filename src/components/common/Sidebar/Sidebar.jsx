import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import './Sidebar.css'
import { RiDashboardHorizontalLine } from 'react-icons/ri'
import { FaRegCircleUser } from 'react-icons/fa6'
import { LiaSignOutAltSolid } from 'react-icons/lia'


const Sidebar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <RiDashboardHorizontalLine /> },
    { path: '/employees', label: 'Employees', icon: <FaRegCircleUser />},
  ]

  return (
    <aside className="sidebar">
      
      <nav className="sidebar-nav">
        <h2 className="sidebar-logo">Employee Portal</h2>
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <ul className="nav-list">
          <li>
            <button onClick={handleLogout} className="nav-link logout-link">
              <span className="nav-icon"><LiaSignOutAltSolid /></span>
              <span className="nav-label">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
