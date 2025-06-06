"use client"

import {useState, useEffect, useRef} from "react"
import {createStaticHandler, useNavigate} from "react-router-dom";
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState("")
    const [cooldown, setCooldown] = useState(0) // Cooldown in seconds
    const [showResetDialog, setShowResetDialog] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
    const navigate = useNavigate();
    const cooldownIntervalRef = useRef(null)
    const BaseAPIUrl = "http://localhost:8080/";

    useEffect(() => {
        if (cooldown > 0) {
            cooldownIntervalRef.current = setInterval(() => {
                setCooldown((prev) => prev - 1)
            }, 1000)
        } else if (cooldown === 0 && cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current)
            cooldownIntervalRef.current = null
        }
        return () => {
            if (cooldownIntervalRef.current) {
                clearInterval(cooldownIntervalRef.current)
            }
        }
    }, [cooldown])

    const handleSendOtp = async (e) => {
        e.preventDefault()
        if (cooldown > 0) return


        const res = await axios.post(BaseAPIUrl + "users/request-reset", {
            email
        });

        alert("Check your email for the OTP!");
        // console.log("Sending OTP to:", email)
        setOtpSent(true)
        setCooldown(30)

    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        const code = otp;

        const res = await axios.put(BaseAPIUrl + "users/verifyResetCode", {
            email,
            code
        });


        const isValid = res.data;
        console.log("Is OTP TRUE?");
        console.log(isValid);
        if (isValid) {
            setShowResetDialog(true)
            console.log("OTP correct!")
        } else {

            alert("Incorrect OTP. Please try again.")
            console.log("Incorrect OTP:", otp)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        try {
        if (newPassword !== confirmNewPassword) {
            alert("New passwords do not match.")
            return
        }


            const res = await axios.put(BaseAPIUrl + "users/ResetPassword", {
                email: email,
                code: otp,
                password: newPassword
            })

        if(res.data) {
            alert("Password has been reset successfully!")
            setShowResetDialog(false)

            navigate("/login")
        }else{
            alert("Error !!!");
        }
        }
        catch(e){
            console.log(e.response.data);
        }
    }


    // Calculate password strength (re-used from Signup)
    const getPasswordStrength = (password) => {
        if (!password) return {strength: 0, label: ""}

        let strength = 0
        if (password.length >= 8) strength += 1
        if (/[A-Z]/.test(password)) strength += 1
        if (/[0-9]/.test(password)) strength += 1
        if (/[^A-Za-z0-9]/.test(password)) strength += 1

        const labels = ["", "Weak", "Fair", "Good", "Strong"]
        const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"]

        return {
            strength,
            label: labels[strength],
            color: colors[strength],
        }
    }

    const passwordStrength = getPasswordStrength(newPassword)
    const passwordsMatch = newPassword && confirmNewPassword && newPassword === confirmNewPassword

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            <div className="w-full max-w-md">
                {/* Main Card */}
                <div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 text-center">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                            Reset Password
                        </h1>
                        <p className="text-gray-600 text-sm">Enter your email to receive a verification code</p>
                    </div>

                    {/* Form */}
                    <div className="px-8 pb-8">
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Send OTP Button */}
                            <button
                                type="submit"
                                disabled={cooldown > 0}
                                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    cooldown > 0 ? "opacity-60 cursor-not-allowed" : "hover:from-blue-700 hover:to-purple-700"
                                }`}
                            >
                                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Send OTP"}
                            </button>
                        </form>

                        {otpSent && !showResetDialog && (
                            <form onSubmit={handleVerifyOtp} className="space-y-5 mt-6">
                                {/* OTP Field */}
                                <div className="space-y-2">
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                        Verification Code
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            id="otp"
                                            type="text"
                                            placeholder="Enter 6-digit code"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                                            maxLength="6"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Verify OTP Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Verify Code
                                </button>
                            </form>
                        )}

                        {/* Back to Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Remembered your password?{" "}
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                    Log in
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Reset Dialog */}
            {showResetDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div
                        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 w-full max-w-md p-8 relative">
                        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
                            Reset Password
                        </h2>
                        <p className="text-gray-600 text-sm text-center mb-6">Enter your new password below.</p>

                        <form onSubmit={handleResetPassword} className="space-y-5">
                            {/* New Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                                    >
                                        {showNewPassword ? (
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                                />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {newPassword && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="text-xs text-gray-500">Password strength:</div>
                                            <div
                                                className="text-xs font-medium"
                                                style={{
                                                    color:
                                                        passwordStrength.color === "bg-green-500"
                                                            ? "#10B981"
                                                            : passwordStrength.color === "bg-yellow-500"
                                                                ? "#F59E0B"
                                                                : passwordStrength.color === "bg-orange-500"
                                                                    ? "#F97316"
                                                                    : passwordStrength.color === "bg-red-500"
                                                                        ? "#EF4444"
                                                                        : "#6B7280",
                                                }}
                                            >
                                                {passwordStrength.label}
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full ${passwordStrength.color}`}
                                                style={{width: `${(passwordStrength.strength / 4) * 100}%`}}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm New Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="confirmNewPassword"
                                        type={showConfirmNewPassword ? "text" : "password"}
                                        placeholder="Re-enter new password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white ${
                                            confirmNewPassword ? (passwordsMatch ? "border-green-300" : "border-red-300") : "border-gray-200"
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmNewPassword ? (
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                                />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {confirmNewPassword && !passwordsMatch && (
                                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                )}
                                {confirmNewPassword && passwordsMatch &&
                                    <p className="text-xs text-green-500 mt-1">Passwords match</p>}
                            </div>

                            {/* Reset Password Button */}
                            <button
                                type="submit"
                                disabled={!passwordsMatch || !newPassword}
                                className={`w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    !passwordsMatch || !newPassword
                                        ? "opacity-60 cursor-not-allowed"
                                        : "hover:from-blue-700 hover:to-purple-700"
                                }`}
                            >
                                Reset Password
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ForgotPassword
