import './Dashboard.css'
import { useAuth } from '../../hooks/useAuth'

const Dashboard = () => {
  const { employees } = useAuth();
  // Calculate metrics from employees data
  const totalEmployees = employees.length
  const activeEmployees = employees.filter(user => user.status === 'Active').length
  const inactiveEmployees = employees.filter(user => user.status === 'Inactive').length
  
  // Calculate employees by gender for diversity metrics
  const maleEmployees = employees.filter(user => user.gender === 'Male').length
  const femaleEmployees = employees.filter(user => user.gender === 'Female').length


  const metrics = [
    { title: 'Total employees', value: totalEmployees.toString() },
    { title: 'Active employees', value: activeEmployees.toString() },
    { title: 'Inactive employees', value: inactiveEmployees.toString() },
    { title: 'Male employees', value: maleEmployees.toString() },
    { title: 'Female employees', value: femaleEmployees.toString() },

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
