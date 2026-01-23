import { useState, useMemo, useEffect } from 'react'
import './Users.css'
import { useAuth } from '../../hooks/useAuth';
import { FaSearch, FaEdit, FaTrash, FaPrint, FaPlus, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { printTable } from '../../components/helpers/print'


// Indian states list
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
]

function Users() {
  const { employees, updateEmployees } = useAuth();
  const mockUsers = employees;
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [genderFilter, setGenderFilter] = useState('All')
  const [users, setUsers] = useState(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: '',
    state: '',
    status: 'Active',
    profileImage: null
  })
  const [formErrors, setFormErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(()=>{
    updateEmployees(users)
  }, [users])

  // Get unique values for filters
  const statuses = ['All', ...new Set(mockUsers.map(user => user.status))]
  const genders = ['All', ...new Set(mockUsers.map(user => user.gender))]

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // Toggle user status
  const toggleStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ))
  }

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.state.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'All' || user.status === statusFilter
      const matchesGender = genderFilter === 'All' || user.gender === genderFilter

      return matchesSearch && matchesStatus && matchesGender
    })
  }, [searchTerm, statusFilter, genderFilter, users])

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  // Ensure current page is within valid range
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1)
  const startIndex = (validCurrentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Handle print - print only the table
  const handlePrint = () => {
    const columns = [
      { key:'id', label: 'S.No.'},
      { key: 'fullName', label: 'Employee Name' },
      { key: 'employeeId', label: 'Employee ID' },
      { key: 'gender', label: 'Gender' },
      { key: 'dob', label: 'Date of Birth', type: 'date' },
      { key: 'state', label: 'State' },
      { key: 'status', label: 'Status' }
    ]
    
    printTable(filteredUsers, formatDate, 'Employees List', columns)
  }

  // Open modal for add
  const handleAddEmployee = () => {
    setEditingUser(null)
    setFormData({
      fullName: '',
      gender: '',
      dob: '',
      state: '',
      status: 'Active',
      profileImage: null
    })
    setFormErrors({})
    setImagePreview(null)
    setIsModalOpen(true)
  }

  // Open modal for edit
  const handleEditEmployee = (user) => {
    setEditingUser(user)
    setFormData({
      fullName: user.fullName,
      gender: user.gender,
      dob: user.dob,
      state: user.state,
      status: user.status,
      profileImage: null
    })
    setFormErrors({})
    // Load existing image preview if available
    setImagePreview(user.profileImage || null)
    setIsModalOpen(true)
  }

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
    setFormData({
      fullName: '',
      gender: '',
      dob: '',
      state: '',
      status: 'Active',
      profileImage: null
    })
    setFormErrors({})
    setImagePreview(null)
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({
          ...prev,
          profileImage: 'Please select a valid image file'
        }))
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          profileImage: 'Image size should be less than 5MB'
        }))
        return
      }
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }))
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      // Clear error
      if (formErrors.profileImage) {
        setFormErrors(prev => ({
          ...prev,
          profileImage: ''
        }))
      }
    }
  }

  // Form validation
  const validateForm = () => {
    const errors = {}
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required'
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full Name must be at least 2 characters'
    }
    
    if (!formData.gender) {
      errors.gender = 'Gender is required'
    }
    
    if (!formData.dob) {
      errors.dob = 'Date of Birth is required'
    } else {
      const dobDate = new Date(formData.dob)
      const today = new Date()
      if (dobDate > today) {
        errors.dob = 'Date of Birth cannot be in the future'
      }
    }
    
    if (!formData.state) {
      errors.state = 'State is required'
    }
    
    if (!formData.status) {
      errors.status = 'Status is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map(user =>
        user.id === editingUser.id
          ? {
              ...user,
              fullName: formData.fullName.trim(),
              gender: formData.gender,
              dob: formData.dob,
              state: formData.state,
              status: formData.status,
              profileImage: imagePreview // Store preview URL or handle image upload separately
            }
          : user
      )
      setUsers(updatedUsers)
    } else {
      // Add new user
      const newEmployeeId = `EMP${String(users.length + 1).padStart(3, '0')}`
      const newUser = {
        id: users.length + 1,
        employeeId: newEmployeeId,
        fullName: formData.fullName.trim(),
        gender: formData.gender,
        dob: formData.dob,
        state: formData.state,
        status: formData.status,
        profileImage: imagePreview
      }
      setUsers([...users, newUser])
    }

    handleCloseModal()
  }

  // Handle delete button click
  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete.id))
      setIsDeleteModalOpen(false)
      setUserToDelete(null)
    }
  }

  // Handle delete cancel
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setUserToDelete(null)
  }

  return (

    <main className="users-main">

      {/* Search and Filters Panel */}
      <div className="users-controls-panel">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, employee ID, or state..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="search-input"
            />
            <span className="search-icon"><FaSearch /></span>
          </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
              placeholder="Select Status"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={genderFilter}
              onChange={(e) => {
                setGenderFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="filter-select"
              placeholder="Select Gender"
            >
              {genders.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>

          <button className="add-user-btn" onClick={handleAddEmployee}><FaPlus size={16} /> <span>Add Employee</span></button>
        </div>



      {/* Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th colSpan="8">Employees</th>
            </tr>
            <tr className="users-table-header-row">
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>State</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-results">
                  No employees found matching your criteria
                </td>
              </tr>
            ) : (
              paginatedUsers.map(user => (
                <tr key={user.id}>
                  <td className="user-name-cell">
                    <div className="user-avatar-small">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.fullName} />
                      ) : (
                        user.fullName.charAt(0)
                      )}
                    </div>
                    <span>{user.fullName}</span>
                  </td>
                  <td>{user.employeeId}</td>
                  <td>{user.gender}</td>
                  <td>{formatDate(user.dob)}</td>
                  <td>{user.state}</td>
                  <td>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={user.status === 'Active'}
                        onChange={() => toggleStatus(user.id)}
                        title={user.status === 'Active'? 'Deactivate':'Activate'}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit-btn" title="Edit" onClick={() => handleEditEmployee(user)}>
                        <FaEdit size={16}/>
                      </button>
                      <button className="action-btn delete-btn" title="Delete" onClick={() => handleDeleteClick(user)}>
                        <FaTrash size={16}/>
                      </button>
                      <button className="action-btn print-btn" title="Print" onClick={handlePrint}>
                        <FaPrint size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredUsers.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <span>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} employees
            </span>
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(validCurrentPage - 1)}
              disabled={validCurrentPage === 1}
              title="Previous page"
            >
              <FaChevronLeft size={14} />
            </button>
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                // Show first page, last page, current page, and pages around current
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= validCurrentPage - 1 && pageNum <= validCurrentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-number ${validCurrentPage === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  )
                } else if (pageNum === validCurrentPage - 2 || pageNum === validCurrentPage + 2) {
                  return <span key={pageNum} className="pagination-ellipsis">...</span>
                }
                return null
              })}
            </div>
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(validCurrentPage + 1)}
              disabled={validCurrentPage === totalPages}
              title="Next page"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Employee Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Edit Employee' : 'Add New Employee'}</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="employee-form">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={formErrors.fullName ? 'error' : ''}
                  placeholder="Enter full name"
                />
                {formErrors.fullName && <span className="error-message">{formErrors.fullName}</span>}
              </div>

              {/* Gender */}
              <div className="form-group">
                <label htmlFor="gender">Gender <span className="required">*</span></label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={formErrors.gender ? 'error' : ''}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.gender && <span className="error-message">{formErrors.gender}</span>}
              </div>

              {/* Date of Birth */}
              <div className="form-group">
                <label htmlFor="dob">Date of Birth <span className="required">*</span></label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={formErrors.dob ? 'error' : ''}
                  max={new Date().toISOString().split('T')[0]}
                />
                {formErrors.dob && <span className="error-message">{formErrors.dob}</span>}
              </div>

              {/* Profile Image Upload */}
              <div className="form-group">
                <label htmlFor="profileImage">Profile Image</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <label htmlFor="profileImage" className="file-input-label">
                    Choose Image
                  </label>
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => {
                          setImagePreview(null)
                          setFormData(prev => ({ ...prev, profileImage: null }))
                          document.getElementById('profileImage').value = ''
                        }}
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  )}
                </div>
                {formErrors.profileImage && <span className="error-message">{formErrors.profileImage}</span>}
              </div>

              {/* State Selection */}
              <div className="form-group">
                <label htmlFor="state">State <span className="required">*</span></label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={formErrors.state ? 'error' : ''}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {formErrors.state && <span className="error-message">{formErrors.state}</span>}
              </div>

              {/* Status */}
              <div className="form-group">
                <label htmlFor="status">Status <span className="required">*</span></label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={formErrors.status ? 'error' : ''}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {formErrors.status && <span className="error-message">{formErrors.status}</span>}
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingUser ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <h2>Delete Employee</h2>
              <button className="modal-close-btn" onClick={handleCancelDelete}>
                <FaTimes size={20} />
              </button>
            </div>
            <div className="delete-modal-body">
              <div className="delete-warning-icon">
                <FaTrash size={48} />
              </div>
              <p className="delete-message">
                Are you sure you want to delete <strong>{userToDelete.fullName}</strong>?
              </p>
              <p className="delete-submessage">
                This action cannot be undone. All employee data will be permanently removed.
              </p>
            </div>
            <div className="delete-modal-actions">
              <button type="button" className="btn-cancel" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button type="button" className="btn-delete" onClick={handleConfirmDelete}>
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </main>

  )
}

export default Users