import { useEffect, useState } from 'react'
import { getAllEmployees, deleteEmployeeApi } from '../services/apiService.js' 
import { useNavigate } from 'react-router-dom'
import '../App.css'

export default function AllEmployees() {
    const [employees, setEmployees] = useState([])
    const navigate = useNavigate()

    const fetchEmployees = async () => {
        try {
            const res = await getAllEmployees()
            console.log("API response: ", res)
            setEmployees(res.data || []) // Fallback to empty array if no data
        } catch (error) {
            console.error("Error fetching employees", error)
            if (error.response || error.response.status === 401 || error.response.message === "Only admin has access to this function") {
                navigate('/permissionDenied')
            }
            setEmployees([])
        }
    }

    const handleDelete = async (username) => {
        if (!window.confirm(`Are you sure you want to delete employee "${username}"?`)) {
            return // Cancel if user says no
        }
        
        try {
            await deleteEmployeeApi(username)
            console.log(`Employee ${username} deleted successfully`)
            fetchEmployees() // Refetch to update the table
        } catch (error) {
            console.error("Error deleting employee", error)
            if (error.response && error.response.status === 401) {
                navigate('/permissionDenied')
            } else {
                alert("Failed to delete employee. Please try again.")
            }
        }
    }

    useEffect(() => {
        fetchEmployees() // Fetch employees on component mount
    }, []) // Empty dependency array: runs once

    return (
        <div>
            <h1>View All Employees</h1>
            <div>
                <h3>Employee List</h3>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 && (
                            <tr>
                                <td colSpan="2">
                                    No employees in database
                                </td>
                            </tr>
                        )}
                        {employees.map(employee => (
                            <tr key={employee._id}>
                                <td>{employee.username}</td>
                                <td>
                                    <button onClick={() => handleDelete(employee.username)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}