import { jwtDecode } from "jwt-decode";

export function isAuthenticated() {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const decoded = jwtDecode(token); // decode base64 payload
            const { role, exp, id } = decoded;

            // Optional: Check token expiry
            if (Date.now() >= exp * 1000) {
                return { authenticated: false, role: null, id: 0};
            }

            return { authenticated: true, role, id };
        } catch (error) {
            return { authenticated: false, role: null, id: 0 };
        }
    }

    return { authenticated: false, role: null, id: 0 };
}
