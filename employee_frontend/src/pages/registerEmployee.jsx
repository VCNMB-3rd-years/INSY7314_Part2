import { useEffect, useState } from 'react'
import { registerEmployee, getCurrentAdmin } from '../services/apiService.js'
import { getPendingPayments } from '../services/apiService.js'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import icon from '../../image/icon.png'

//ONLY SUPER ADMIN CAN REGISTER AN EMPLOYEE
export default function RegisterEmployee() {
    const navigate = useNavigate(); // Initialize navigate hook
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    useEffect(() => {
    const verifyAccess = async () => {
        try {
            const res = await getCurrentAdmin(); 
            console.log("API response:", res);
            const role = res.data?.role;
            const privilege = res.data?.payload?.privilege; 

            console.log(`Extracted role: ${role}, extracted privilege: ${privilege}`);
            if (role !== 'admin' || privilege !== true) {
                navigate('/permissionDenied');
            }
        } catch (error) {
            console.error("Something went wrong verifying access:", error);

            if (error.response && (error.response.status === 401 || error.response.data?.message === "Only admin has access to this function")) {
                navigate('/permissionDenied');
            } else {
                navigate('/permissionDenied');
            }
        }
    };

    verifyAccess();
}, [navigate]);

    const handleInputChange = (e) => {
        setError('');
        setFormData({ ...formData, [e.target.name]: e.target.value }) //updates variable data as user types
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('');
        try {
            await registerEmployee(formData)
            alert('Employee registered successfully.')
            setFormData({
                username: '',
                password: ''
            })
            navigate('/allEmployees');
        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.message ||
                'Sorry, we could not register your account'
            )
            alert('Registration failed. Please try again.');
        }
    }

    const handleReset = () => {
        setFormData({
            username: '',
            password: ''
        })
        setError('');
    }

    const namePattern = "^[a-zA-Z0-9]{1,30}$" // w3schools
    const passwordPattern = "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])[^\\s]{8,16}$"; // qho, 2023

    return (

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <img
                src={icon}
                alt="Company Logo"
                style={{ width: '200px', height: 'auto', marginBottom: '1px' }}
            />


            <h1>Employee Registration</h1>
            <div>
                <h3>Please fill out details below</h3>
                {error && <p>{error}</p>}
                <form onSubmit={handleSubmit}>
                    {/*(Ui prep, 2025) Used it to figire out how to chnage the input fields*/}
                    <div className="form-group">
                        <label htmlFor="username">Full Name</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            pattern={namePattern}
                            title="Ensure that the name enters has no special characters in it, and between 1 and 30 characters"
                        />
                    </div>

                    {/*(Ui prep, 2025) */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            pattern={passwordPattern}
                            title='Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character.'
                            required
                        />
                    </div>

                    <button type="submit">Submit</button>
                    <button type="reset" onClick={handleReset}>Reset</button>
                </form>
            </div>
        </div>
    )
}

/*
REFERENCES:
    Ui prep, 2025. UI Designer’s Guide to Creating Forms & Inputs. [Online]Available at: https://www.uiprep.com/blog/ui-designers-guide-to-creating-forms-inputs
    W3Schools. 2025. RegExp Character Classes. [online]  Available at: https://www.w3schools.com/js/js_regexp_characters.asp date accessed date 09 October 2025
    qho. 2023. strict password validator. [online] available at: https://regex101.com/r/0bH043/3 date accessed date 09 October 2025
*/
