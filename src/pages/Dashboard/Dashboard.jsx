import './Dashboard.css'
import { mockUsers } from '../../utils/mockData'

const Dashboard = () => {
  // Calculate metrics from mockUsers data
  const totalEmployees = mockUsers.length
  const activeEmployees = mockUsers.filter(user => user.status === 'Active').length
  const inactiveEmployees = mockUsers.filter(user => user.status === 'Inactive').length
  
  // Calculate employees by gender for diversity metrics
  const maleEmployees = mockUsers.filter(user => user.gender === 'Male').length

  const metrics = [
    { title: 'Total employees', value: totalEmployees.toString() },
    { title: 'Active employees', value: activeEmployees.toString() },
    { title: 'Inactive employees', value: inactiveEmployees.toString() },
    { title: 'Male employees', value: maleEmployees.toString() },
  ]

  return (
    <div className="dashboard-container">
     

      <main className="dashboard-main">
        {/* Key Metrics Section */}
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-card">
              <div className="metric-value">{metric.value}</div>
              <div className="metric-title">{metric.title}</div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

export default Dashboard
