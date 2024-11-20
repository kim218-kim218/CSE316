import React, { useState } from 'react';
import { hashutil } from './hashutil/javascript/Hashutil.js';

function Sign() {
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
                <h2>Sign In</h2>
                <form className="sign-form">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" value={formData.email}/>

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={formData.password}/>

                    <div className="button-group">
                    <button type="submit">Sign in</button>
                    <button type="button">Sign up</button>
                    </div>
                </form>
            </div>
        {/* <form onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
            />
            <button type="submit">Sign Up</button>
        </form> */}

        </div>
    );
}

export default Sign;
