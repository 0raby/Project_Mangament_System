import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assests/android-chrome-192x192.png';

const NavBar = ({ children }) => {
    const navigate = useNavigate();

    return (
        <header className="bg-white/80 backdrop-blur-sm shadow-md p-6 border-b border-white/20">
            <div className="max-w-6xl mx-auto flex justify-between items-center">

                {/* Left Side: Logo + Name */}
                <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/user')}>
                    <img
                        src={logo}
                        alt="Panagement Logo"
                        className="h-12 w-12"
                    />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                        Panagement
                    </h1>
                </div>

                {/* Right Side: Buttons */}
                <nav className="space-x-6">
                    <button
                        onClick={() => navigate('/user')}
                        className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.reload();
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                    >
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default NavBar;
