"use client"

import { useEffect } from "react"
import {useNavigate} from "react-router-dom";

const Tasks = () => {
    // In a real app, you'd extract projectId from URL params (e.g., using useParams from react-router-dom)
    // For now, let's simulate getting it from a query parameter
    const navigate = useNavigate();
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const projectId = urlParams.get("projectId")
        if (projectId) {
            console.log("Viewing tasks for Project ID:", projectId)
            // Fetch tasks for this project
        }
    }, [])



    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 w-full">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
                    Project Tasks
                </h1>
                <p className="text-gray-600 mb-6">
                    This is the tasks page for your selected project. You can manage tasks here.
                </p>

                {/* Placeholder for tasks list */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-gray-700">
                    <h3 className="text-xl font-semibold mb-3">Tasks List (Coming Soon!)</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Task 1: Implement user authentication</li>
                        <li>Task 2: Design dashboard UI</li>
                        <li>Task 3: Set up database schema</li>
                        <li>Task 4: Develop API endpoints</li>
                    </ul>
                    <p className="mt-4 text-sm text-gray-500">
                        You would typically see a detailed list of tasks, their statuses, due dates, etc., here.
                    </p>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Tasks
