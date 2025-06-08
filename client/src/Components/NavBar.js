import React from 'react'

const NavBar = ({children}) => {
    return (
        <header
            className="bg-white/80 backdrop-blur-sm shadow-md p-6 border-b border-white/20">
            < div
                className="max-w-6xl mx-auto flex justify-between items-center">
                < h1
                    className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                    User
                    Dashboard
                < /h1>
                <nav className="space-x-4">
                    <button
                        onClick={() => console.log("Profile clicked")}
                        className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => console.log("Settings clicked")}
                        className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Settings
                    </button>
                    <button onClick={() => {
                        localStorage.removeItem("token");
                        window.location.reload();
                    }} className="text-red-600 hover:text-red-800 transition-colors">
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    )
}
export default NavBar;