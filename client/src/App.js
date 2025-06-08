import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/auths/Login';
import Signup from './pages/auths/Signup';
import AdminHome from './pages/dashboard/AdminHome';
import UserDashboard from './pages/dashboard/UserDashboard';
import {isAuthenticated} from './Utils/auth';
import ProtectedRoute from './Components/ProtectedRoute';
import ForgotPassword from './pages/auths/ForgotPassword';
import NavBar from './Components/NavBar'
import Footer from './Components/Footer'
export default function App() {

    const [authStatus, setAuthStatus] = useState({
        authenticated: false,
        role: null,
        id : 0
    });

    useEffect(() => {
        const checkAuth = () => {
            const {authenticated, role, id} = isAuthenticated();
            setAuthStatus({authenticated, role, id});
        };

        checkAuth();

        // Optional: listen to localStorage changes (cross-tab support)
        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    const {authenticated, role, id} = authStatus;


    return (
        <Router>
            <Routes>
                <Route
                    path="/" element={
                    authenticated ? (
                        role === 'ROLE_ADMIN' ? <Navigate to="/admin"/> : <Navigate to="/user"/>
                    ) : (
                        <Navigate to="/login"/>
                    )
                }/>
                <Route path="/login"
                       element={!authenticated ? <Login onAuthChange={setAuthStatus}/> : <Navigate to="/"/>}/>
                <Route path="/signup"
                       element={!authenticated ? <Signup onAuthChange={setAuthStatus}/> : <Navigate to="/"/>}/>

                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>

                        <AdminHome/>
                    </ProtectedRoute>
                }/>
                <Route path="/user" element={
                    <ProtectedRoute allowedRoles={['ROLE_USER']}>
                        <NavBar />
                        <UserDashboard userId={{id}}/>
                        <Footer />
                    </ProtectedRoute>
                }/>
                <Route
                    path="/forgotPassword"
                    element={
                        !authenticated ? <ForgotPassword/> : <Navigate to="/" replace/>
                    }
                />


            </Routes>
        </Router>
    );
}
