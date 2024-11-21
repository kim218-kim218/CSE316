// Nahyun Kim
// nahyun.kim.4@stonybrook.edu

import React, { useState, useEffect } from 'react';
import { hashutil } from '../hashutil/javascript/Hashutil.js';

function SignIn({ showPage }) {

    const [users, setUsers] = useState([]); // Store user data from `/register`
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Fetch user data from `/register`
    useEffect(() => {
        fetch('http://localhost:3001/register') // Fetch all users from backend
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data); // Store the user data locally
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
    }, []);

    // Handle Sign-In Form Submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if email exists in the database
        const user = users.find(user => user.email === email);

        if (!user) {
            alert('Wrong Email');
            return;
        }

        const hashedPassword = hashutil(email, password); // hashing
        // Validate password
        if (user.password !== hashedPassword) {
            alert('Wrong password');
            return;
        }

        // Sign-In Successful
        alert("User Registered Successfully!");
    };

    const handleEmail = (e) => {
        setEmail(e.target.value); 
    };

    const handlePassWord = (e) => {
        setPassword(e.target.value); 
    };


    return (
        <div>
            <div className="sign-container">
                <h2>Sign In</h2>
                <form className="sign-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" onChange={handleEmail} value={email}/>

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={handlePassWord} value={password}/>

                    <div className="button-group">
                    <button type="submit">Sign in</button>
                    <button type="button" onClick={() => showPage('SignUp')}>Sign up</button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default SignIn;
