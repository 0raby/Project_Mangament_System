"use client"

import { useState, useEffect } from "react"
import axios from "axios";
import {useNavigate} from "react-router-dom";



// Reusable Dialog Component (copied from UserDashboard for self-containment)
const Dialog = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 w-full max-w-md p-8 relative">
                <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
                    {title}
                </h2>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {children}
            </div>
        </div>
    )
}

// Task Form Dialog (for Add and Edit)
const TaskFormDialog = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [title, setTitle] = useState(initialData ? initialData.title : "")
    const [status, setStatus] = useState(initialData ? initialData.status : "TODO")
    const [dueDate, setDueDate] = useState(initialData ? initialData.dueDate : "")
    const [id, setId] = useState(initialData ? initialData.id : null)
    useEffect(() => {
        if (initialData) {
            setId(initialData.id);
            setTitle(initialData.title);
            setStatus(initialData.status);
            setDueDate(initialData.dueDate);
        } else {
            setId(null);
            setTitle("");
            setStatus("TODO");
            setDueDate("");
        }
    }, [initialData]);
    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({ id: initialData ? initialData.id : undefined, title, status, dueDate })
        onClose()
    }

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Task" : "Add New Task"}>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700">
                        Task Title
                    </label>
                    <input
                        id="taskTitle"
                        type="text"
                        placeholder="Enter task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <select
                        id="taskStatus"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                        required
                    >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-700">
                        Due Date
                    </label>
                    <input
                        id="taskDueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {initialData ? "Save Changes" : "Add Task"}
                </button>
            </form>
        </Dialog>
    )
}

// Confirm Delete Dialog (copied from UserDashboard for self-containment)
const ConfirmDeleteDialog = ({ isOpen, onClose, onConfirm, itemName }) => {
    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
            <p className="text-gray-700 text-center mb-6">
                Are you sure you want to delete "<span className="font-semibold text-gray-900">{itemName}</span>"? This action
                cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
                <button
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200"
                >
                    Delete
                </button>
            </div>
        </Dialog>
    )
}

const Tasks = ({userId}) => {
    // In a real app, you'd extract projectId from URL params (e.g., using useParams from react-router-dom)
    // For now, let's simulate getting it from a query parameter or a default
    const [projectId, setProjectId] = useState(null) // State to hold the current project ID
    const BaseAPIURL = process.env.REACT_APP_BASE_API_URL
    const [currentPage, setCurrentPage] = useState(0);
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([])
    const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingTask, setEditingTask] = useState(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [taskToDelete, setTaskToDelete] = useState(null)
    const navigate = useNavigate();
    const [totalPages, setTotalPages] = useState(0);
    const [projectName , setProjectName] = useState(null);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BaseAPIURL}tasks/project/${projectId}/tasks` , {
                params: {
                    page: currentPage,
                    size: 5
                },
                headers: {
                    Authorization:`Bearer ${token}`
                }
            })
            // console.log({"TASKS" : res.data.content})
            setTasks(res.data.content);

            setTotalPages(res.data.totalPages);

        }catch(e){
            alert("UNAUTHORIZED")
            navigate("/user")
        }
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get("projectId")
        if (id) {
            setProjectId(id)

        }

    }, [])
    useEffect(() => {
        console.log({"PROJECT ID" : projectId})
        if(projectId !== null) {
            fetchTasks();
        }
    }, [projectId, currentPage]);

    const getProject = async () => {
        try {
            const res = await axios.get(`${BaseAPIURL}projects/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setProjectName(res.data.title);
        }
        catch(e){
            alert("failed to load project")
            navigate("/admin")
        }
    }
    useEffect(() => {
        if(projectId !== null) {
            getProject();
        }
    }, [projectId]);


    const handleAddTask = async (toCreate) => {
        // console.log(newTask);
        await axios.post(`${BaseAPIURL}tasks`, {
            title : toCreate.title,
            status : toCreate.status,
            dueDate : toCreate.dueDate,
            projectId : projectId

        },{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setCurrentPage(0);
        fetchTasks();
    }

    const handleEditTask = async (updatedTask) => {
        try {
            await axios.put(`${BaseAPIURL}tasks`, {
                id: updatedTask.id,
                title: updatedTask.title,
                status: updatedTask.status,
                dueDate: updatedTask.dueDate
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            fetchTasks();
        }
        catch (e) {
            alert("Error updating task please try again later")
        }


    }

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`${BaseAPIURL}tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setIsDeleteDialogOpen(false)
            setTaskToDelete(null)
            fetchTasks();
        }catch(e){
            alert("Error deleting tasks");
        }
    }

    const openEditDialog = (task) => {
        setEditingTask(task)
        setIsEditDialogOpen(true)
    }

    const openDeleteConfirmDialog = (task) => {
        setTaskToDelete(task)
        setIsDeleteDialogOpen(true)
    }

    // Function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case "TODO":
                return "bg-blue-100 text-blue-800"
            case "IN_PROGRESS":
                return "bg-yellow-100 text-yellow-800"
            case "DONE":
                return "bg-green-100 text-green-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

            {/* Main Content Area */}
            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">{projectName}</h2>
                        <button
                            onClick={() => setIsAddTaskDialogOpen(true)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Task
                        </button>
                    </div>

                    {tasks.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">No tasks found. Click "Add New Task" to get started!</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                task.status,
                            )}`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{task.dueDate?.split('-').reverse().join('-')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => openEditDialog(task)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-50"
                                                    title="Edit Task"
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteConfirmDialog(task)}
                                                    className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50"
                                                    title="Delete Task"
                                                >
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 space-x-2">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                        index === currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </main>



            {/* Add Task Dialog */}
            <TaskFormDialog
                key={isAddTaskDialogOpen ? "add-project" : "closed"}
                isOpen={isAddTaskDialogOpen}
                onClose={() => setIsAddTaskDialogOpen(false)}
                onSubmit={handleAddTask}
            />

            {/* Edit Task Dialog */}
            <TaskFormDialog
                isOpen={isEditDialogOpen}
                onClose={() => {setIsEditDialogOpen(false);
                    setEditingTask({title: null , status: null , dueData:null})}}
                onSubmit={handleEditTask}
                initialData={editingTask}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDeleteDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={() => handleDeleteTask(taskToDelete.id)}
                itemName={taskToDelete?.title}
            />
        </div>
    )
}

export default Tasks
