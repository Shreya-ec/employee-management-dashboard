import { useAuth } from '../../../hooks/useAuth'
import { RiMenu2Fill } from "react-icons/ri";
import './Topbar.css'

function Topbar() {
    const { user } = useAuth()

    const getGreeting = () => {
        const hour = new Date().getHours()

        if (hour >= 5 && hour < 12) {
            return 'Good morning'
        } else if (hour >= 12 && hour < 17) {
            return 'Good afternoon'
        } else if (hour >= 17 && hour < 22) {
            return 'Good evening'
        } else {
            return 'Good night'
        }
    }

    return (
        <header className="dashboard-header">
            <div className="left-dash">
                <div className="sidebar-ham">
                    <RiMenu2Fill size={20} />
                </div>
                <div className="header-greeting">
                    <h2>{getGreeting()}, {user?.name || 'User'}</h2>
                    <p>long time no see</p>
                </div>
            </div>
            <div className="header-profile">
                <div className="profile-avatar-header">
                    <div className="avatar-circle">
                        {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="status-indicator"></span>
                </div>
                <div className="profile-email-container">
                    <span className="profile-email">{user?.email || 'user@example.com'}</span>
                    <p>Admin</p>
                </div>
            </div>
        </header>
    )
}

export default Topbar