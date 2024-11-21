// Nahyun Kim
// nahyun.kim.4@stonybrook.edu

import React, { useState } from 'react';
import { hashutil } from './hashutil/javascript/Hashutil.js';

function SignUp({ showPage }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value, // id를 기준으로 formData 업데이트
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const hashedPassword = hashutil(formData.email, formData.password); // hashing
            console.log('Request Payload:', {
                email: formData.email,
                username: formData.username,
                password: hashedPassword
            });

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

            const result = await response.json();

            if (response.ok) {
                //console.log('User registered successfully:', result.message);
                alert(result.message);
            } else {
                //console.error('Registration failed:', result.message);
                alert(result.message);
            }

        } catch (error) {
            //console.error('Error during registration:', error);
            alert('Failed to register. Please try again later.');
        }
    };

    return (
        
        <div>
            <div className="sign-container">
                <h2>Sign Up</h2>
                <form className="sign-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" onChange={handleInputChange} value={formData.email}/>

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={handleInputChange} value={formData.password}/>

                    <label htmlFor="password">Password Check</label>
                    <input type="password" id="confirmPassword" onChange={handleInputChange} value={formData.confirmPassword}/>

                    <label htmlFor="password">User Name</label>
                    <input type="name" id="username" onChange={handleInputChange} value={formData.username}/>

                    <div className="button-group">
                    <button type="submit">Sign Up</button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default SignUp;
