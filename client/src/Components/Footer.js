import React from 'react';



const footer = ({children}) => {
    return(
    <footer className="bg-white/80 backdrop-blur-sm shadow-md p-6 border-t border-white/20 mt-auto">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} Simple Task Management System. All rights reserved.</p>
            <div className="mt-2 space-x-4">
                <a href="#" className="hover:text-blue-600 transition-colors">
                    Privacy Policy
                </a>
                <a href="#" className="hover:text-blue-600 transition-colors">
                    Terms of Service
                </a>
                <a href="#" className="hover:text-blue-600 transition-colors">
                    Contact Us
                </a>
            </div>
        </div>
    </footer>
    )
}

export default footer;