import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Bell, Lock, Palette, LogOut, CircleUser, Wallet } from 'lucide-react';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://fintracker-backend-v4fu.onrender.com';
import { toast } from 'react-toastify';


const Setting = ({ isDarkMode, setIsDarkMode }) => {
    const [activeTab, setActiveTab] = useState('Profile');
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        try {
            const userData = localStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        } catch {
            return null;
        }
    });

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/signin');
    }

    const [formData, setFormData] = useState({ name: '', email: '' });
    const [loadingInfo, setLoadingInfo] = useState(false);
    const [loadingPhoto, setLoadingPhoto] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
        }
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setLoadingInfo(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(
                `${API}/users/edit`,
                formData,
                {
                    headers: { 'x-auth-token': token }
                }
            );
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update info');
        } finally {
            setLoadingInfo(false);
        }
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadFormData = new FormData();
        uploadFormData.append('profilePic', file);
        setLoadingPhoto(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `${API}/users/update-photo`,
                uploadFormData,
                {
                    headers: { 'x-auth-token': token }
                }
            );
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload photo');
        } finally {
            setLoadingPhoto(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };


    return (
        <>
            <nav className="w-full bg-white dark:bg-gray-800 p-4 flex overflow-hidden justify-between items-center border-b border-gray-200 dark:border-gray-700 rounded-lg sticky top-0 z-10">
                <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 p-2 rounded-lg ml-4">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <Link to='/'>
                        <span className="text-2xl font-bold text-blue-600">FinTracker</span>
                    </Link>
                </div>
                <div>
                    {user && user.photoUrl ? (
                        <img
                            src={user.photoUrl ? `${API}/${user.photoUrl}` : "https://i.imgur.com/gBqWAiQ.png"}
                            alt="Profile"
                            className="w-9 h-9 rounded-full mr-4 object-cover"
                        />
                    ) : (
                        <Link to='/signin'>
                            <CircleUser className="w-9 h-9 text-gray-600 dark:text-gray-400 mr-4" />
                        </Link>
                    )}
                </div>
            </nav>
            
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
                <main className="flex-grow p-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
                    <div className="flex flex-col md:flex-row gap-8">
                        <aside className="w-full md:w-1/4">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-1">
                                <button
                                    onClick={() => setActiveTab('Profile')}
                                    className={`flex items-center w-full text-left px-4 py-2 rounded-lg ${activeTab === 'Profile'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <User className="w-5 h-5 mr-3" />
                                    Profile Information
                                </button>
                                <button
                                    onClick={() => setActiveTab('Notifications')}
                                    className={`flex items-center w-full text-left px-4 py-2 rounded-lg ${activeTab === 'Notifications'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Bell className="w-5 h-5 mr-3" />
                                    Notification Preferences
                                </button>
                                <button
                                    onClick={() => setActiveTab('Security')}
                                    className={`flex items-center w-full text-left px-4 py-2 rounded-lg ${activeTab === 'Security'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Lock className="w-5 h-5 mr-3" />
                                    Security Settings
                                </button>
                                <button
                                    onClick={() => setActiveTab('Theme')}
                                    className={`flex items-center w-full text-left px-4 py-2 rounded-lg ${activeTab === 'Theme'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Palette className="w-5 h-5 mr-3" />
                                    Theme & Display
                                </button>
                                <hr className="my-2 border-gray-300 dark:border-gray-600" />
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Logout
                                </button>
                            </div>
                        </aside>

                        <main className="w-full md:w-3/4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                                {activeTab === 'Profile' && (
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-2 dark:text-white">Profile Information</h2>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">Manage your personal details and profile picture.</p>
                                        <div className="flex items-center gap-6 mb-8">
                                            <img
                                                src={user && user.photoUrl ? `https://fintracker-backend-v4fu.onrender.com/${user.photoUrl}` : "https://i.imgur.com/gBqWAiQ.png"}
                                                alt="Profile"
                                                className="w-20 h-20 rounded-full object-cover"
                                            />
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                            <button
                                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                onClick={triggerFileInput}
                                                disabled={loadingPhoto}
                                            >
                                                {loadingPhoto ? 'Uploading...' : 'Change Profile Picture'}
                                            </button>
                                        </div>
                                        <form className="space-y-6" onSubmit={handleInfoSubmit}>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="mt-1 w-full max-w-lg px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="mt-1 w-full max-w-lg px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={loadingInfo}
                                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
                                            >
                                                {loadingInfo ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {activeTab === 'Notifications' && (
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-2 dark:text-white">Notification Preferences</h2>
                                        <p className="dark:text-gray-300">Manage your notification settings here.</p>
                                    </div>
                                )}

                                {activeTab === 'Security' && (
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-2 dark:text-white">Security Settings</h2>
                                        <p className="dark:text-gray-300">Manage your password and 2-factor authentication here.</p>
                                    </div>
                                )}

                                {activeTab === 'Theme' && (
                                    <div className="p-4 transition-all duration-300">
                                        <h2 className="text-2xl font-semibold mb-2 dark:text-white">Theme & Display</h2>
                                        <p className="mb-4 dark:text-gray-300">Choose between light and dark mode.</p>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setIsDarkMode(false)}
                                                className={`px-4 py-2 rounded-lg transition-all duration-300
                                                ${!isDarkMode
                                                        ? "bg-blue-600 text-white shadow-md"
                                                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
                                                    }`}
                                            >
                                                Light
                                            </button>
                                            <button
                                                onClick={() => setIsDarkMode(true)}
                                                className={`px-4 py-2 rounded-lg transition-all duration-300
                                                ${isDarkMode
                                                        ? "bg-blue-600 text-white shadow-md"
                                                        : "bg-gray-900 text-white dark:bg-gray-800"
                                                    }`}
                                            >
                                                Dark
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </main>

                <footer className="w-full text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                    © 2025 FinTrack. All rights reserved.
                </footer>
            </div>
        </>
    );
}

export default Setting;