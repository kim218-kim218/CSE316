// Nahyun Kim
// nahyun.kim.4@stonybrook.edu

import React, { useState } from 'react';
import { hashutil } from '../hashutil/javascript/Hashutil.js';

function SignUp({ showPage }) {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const hashedPassword = hashutil(formData.email, formData.password);

            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                    password: hashedPassword
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            alert(data.message);
        } catch (error) {
            console.error("Error during registration:", error);
            alert(error.message);
        }
    };

    return (
        
        <div>
            <div className="sign-container">
                <h2>Sign Up</h2>
                <form className="sign-form">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" value={formData.email}/>

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={formData.password}/>

                    <label htmlFor="password">Password Check</label>
                    <input type="password" id="password" value={formData.confirmPassword}/>

                    <label htmlFor="password">User Name</label>
                    <input type="password" id="password" value={formData.name}/>

                    <div className="button-group">
                    <button type="submit">Sign Up</button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default SignUp;
