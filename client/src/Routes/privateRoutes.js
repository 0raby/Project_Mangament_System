// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { authenticated, role } = isAuthenticated();

    if (!authenticated) return <Navigate to="/login" />;

    if (!allowedRoles.includes(role)) return <Navigate to="/" />;

    return children;
}
