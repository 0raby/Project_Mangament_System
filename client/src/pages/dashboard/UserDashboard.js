"use client"

import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import axios from "axios";




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

// Project Form Dialog (for Add and Edit)
const ProjectFormDialog = ({ isOpen, onClose, onSubmit, initialData = null }) => {

    const [title, setTitle] = useState(initialData ? initialData.title : "")
    const [description, setDescription] = useState(initialData ? initialData.description : "")
    const[id, setId] = useState(initialData ? initialData.id : undefined)
    useEffect(() => {
        if (initialData) {
            setId(initialData.id);
            setTitle(initialData.title);
            setDescription(initialData.description);
        } else {
            setTitle("");
            setDescription("");
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({id, title, description })
        onClose()
    }

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Project" : "Add New Project"}>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700">
                        Project Title
                    </label>
                    <input
                        id="projectTitle"
                        type="text"
                        placeholder="Enter project title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="projectDescription"
                        placeholder="Enter project description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white resize-y"
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {initialData ? "Save Changes" : "Add Project"}
                </button>
            </form>
        </Dialog>
    )
}

// Confirm Delete Dialog
const ConfirmDeleteDialog = ({ isOpen, onClose, onConfirm, projectName }) => {
    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
            <p className="text-gray-700 text-center mb-6">
                Are you sure you want to delete the project "<span className="font-semibold text-gray-900">{projectName}</span>
                "? This action cannot be undone.
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

const UserDashboard = ({userId}) => {
    const [projects, setProjects] = useState([])

    const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingProject, setEditingProject] = useState({
        id: undefined,
        title: '',
        description: ''
    });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [projectToDelete, setProjectToDelete] = useState(null)
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalProjectsNum, setTotalProjectsNum] = useState(0);
    const BaseAPIURL = "http://localhost:8080/";
    const token = localStorage.getItem("token");
    const [refreshProjects, setRefreshProjects] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                if (userId.id !== 0) {
                    const res = await axios.get(`${BaseAPIURL}projects/users/${userId.id}/projects`, {
                        params: {
                            page: currentPage,
                            size: 5
                        },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    setProjects(res.data.content);
                    setTotalPages(res.data.totalPages);
                    setTotalProjectsNum(res.data.totalElements);

                    console.log({"backend result!!!!" : res})
                }else{
                    console.log({"Userid is" : userId.id})
                }
            } catch (err) {
                console.error('Failed to fetch projects:', err);

            }
        };

        fetchProjects();

    }, [userId,currentPage,refreshProjects]);

    const handleAddProject = async (newProject) => {
        // setProjects((prev) => [...prev, newProject])
        try {
            const res = await axios.post(`${BaseAPIURL}projects`,
                {
                    title: newProject.title,
                    description: newProject.description,
                    userId: userId.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            if(currentPage !== 0){
                setCurrentPage(0);
            }
            setProjects((prev) => [res.data, ...prev.slice(0, prev.length - 1)]);
            if (totalProjectsNum % 5 === 0) {
                setTotalPages((prev) => prev + 1);
            }

        }
        catch(err){
            alert("error");
            if(err.response){
                console.log("Error response:", err.response.data);
                console.log("Status:", err.response.status);
                console.log("Headers:", err.response.headers);
            }
            else if (err.request) {
                // Request was made but no response received
                console.log("No response received:", err.request);
            } else {
                // Something else went wrong setting up the request
                console.log("Error:", err.message);
            }


        }

    }

    const handleEditProject = async (ToUpdate) => {
        console.log("UpdatedProjecttttt")
        // console.log(editingProject)
        // console.log(ToUpdate);
        // console.log(projects[0].id)
        try {
            const res = await axios.put(`${BaseAPIURL}projects`, {
                id: ToUpdate.id,
                title: ToUpdate.title,
                description: ToUpdate.description
                },
                {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updatedProject = res.data;
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === updatedProject.id ? updatedProject : project
                )
            );

        }catch(err){
            console.log(err.response)
        }
    }


    const handleDeleteProject = async (id) => {
        try {
            await axios.delete(`${BaseAPIURL}projects/${id}`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })

            setRefreshProjects(!refreshProjects);
            setProjects((prev) => prev.filter((p) => p.id !== id))
            setIsDeleteDialogOpen(false)
            setProjectToDelete(null)

        }
        catch(err){
            console.log(err);
        }
    }

    const openEditDialog = (project) => {
        setEditingProject(() => ({
            id:project.id,
            title: project.title,
            description: project.description
        }));
        setIsEditDialogOpen(true)
    }

    const openDeleteConfirmDialog = (project) => {
        setProjectToDelete(project)
        setIsDeleteDialogOpen(true)
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Dashboard Header */}
            <header className="bg-white/80 backdrop-blur-sm shadow-md p-6 border-b border-white/20">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                        User Dashboard
                    </h1>
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
                        <button onClick={() => {localStorage.removeItem("token");
                                        window.location.reload();
                                        }} className="text-red-600 hover:text-red-800 transition-colors">
                            Logout
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Your Projects</h2>
                        <button
                            onClick={() => setIsAddProjectDialogOpen(true)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Project
                        </button>
                    </div>

                    {projects.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">
                            No projects found. Click "Add New Project" to get started!
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                        <td
                                            className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                            onClick={() => navigate(`/tasks?projectId=${project.id}`)}
                                        >
                                            <div className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                                {project.title}
                                            </div>
                                        </td>
                                        <td
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 cursor-pointer"
                                            onClick={() => navigate(`/tasks?projectId=${project.id}`)}
                                        >
                                            {project.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => openEditDialog(project)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-50"
                                                    title="Edit Project"
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
                                                    onClick={() => openDeleteConfirmDialog(project)}
                                                    className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50"
                                                    title="Delete Project"
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

            {/* Dashboard Footer */}
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

            {/* Add Project Dialog */}
            <ProjectFormDialog
                isOpen={isAddProjectDialogOpen}
                onClose={() => setIsAddProjectDialogOpen(false)}
                onSubmit={handleAddProject}
            />

            {/* Edit Project Dialog */}
            <ProjectFormDialog
                isOpen={isEditDialogOpen}
                onClose={() => {setIsEditDialogOpen(false);
                    setEditingProject({id: undefined, title: "", description: "" });}
                }
                onSubmit={handleEditProject}
                initialData={editingProject}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDeleteDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={() => handleDeleteProject(projectToDelete.id)}
                projectName={projectToDelete?.title}
            />
        </div>
    )
}

export default UserDashboard
