import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Lock, Palette, LogOut } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Set = ({ isDarkMode, setIsDarkMode }) => {
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
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [loadingInfo, setLoadingInfo] = useState(false);
    const [loadingPhoto, setLoadingPhoto] = useState(false);
    
    const [notificationPrefs, setNotificationPrefs] = useState({
        weeklySummary: true,
        budgetAlerts: true,
        largeTransactions: false,
    });
    const [loadingPrefs, setLoadingPrefs] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loadingPassword, setLoadingPassword] = useState(false);

    const fileInputRef = useRef(null);
    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
        }
    }, [user]);
    useEffect(() => {
        if (activeTab === 'Notifications') {
            const fetchPrefs = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(
                        'https://fintracker-backend-v4fu.onrender.com/users/notifications',
                        { headers: { 'x-auth-token': token } }
                    );
                    
                    if (res.data.notificationPrefs) {
                        setNotificationPrefs(res.data.notificationPrefs);
                    } else {
                        setNotificationPrefs(res.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch preferences", error);
                }
            };
            fetchPrefs();
        }
    }, [activeTab]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/signin');
    }

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
                'https://fintracker-backend-v4fu.onrender.com/users/edit',
                formData,
                { headers: { 'x-auth-token': token } }
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
                'https://fintracker-backend-v4fu.onrender.com/users/update-photo',
                uploadFormData,
                { headers: { 'x-auth-token': token } }
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

    const handlePrefChange = (e) => {
        const { name, checked } = e.target;
        setNotificationPrefs(prevPrefs => ({
            ...prevPrefs,
            [name]: checked,
        }));
    };

    const handlePrefSubmit = async (e) => {
        e.preventDefault();
        setLoadingPrefs(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(
                'https://fintracker-backend-v4fu.onrender.com/users/notifications', 
                notificationPrefs, 
                { headers: { 'x-auth-token': token } }
            );
            
            if (res.data.user && res.data.user.notificationPrefs) {
                setNotificationPrefs(res.data.user.notificationPrefs);
            } else if (res.data.notificationPrefs) {
                setNotificationPrefs(res.data.notificationPrefs);
            }
            console.log(res.data.message);
            toast.success(res.data.message || "Preferences saved!");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Could not save preferences.");
        } finally {
            setLoadingPrefs(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        setLoadingPassword(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch( 
                'https://fintracker-backend-v4fu.onrender.com/users/change-password',
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                    confirmNewPassword: passwordData.confirmPassword 
                },
                { headers: { 'x-auth-token': token } }
            );

            toast.success(res.data.message);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoadingPassword(false);
        }
    };


    return (
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
                                <div className="p-4 transition-all duration-300">
                                    <h2 className="text-2xl font-semibold mb-2 dark:text-white">Notification Preferences</h2>
                                    <p className="mb-6 text-gray-600 dark:text-gray-300">Choose how and when you want to be notified.</p>

                                    <form className="space-y-6" onSubmit={handlePrefSubmit}>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <div>
                                                <label htmlFor="weeklySummary" className="font-medium text-gray-900 dark:text-white">
                                                    Weekly Summaries
                                                </label>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Get a summary of your spending every Monday.
                                                </p>
                                            </div>
                                            <label htmlFor="weeklySummary" className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id="weeklySummary"
                                                    name="weeklySummary"
                                                    className="sr-only peer"
                                                    checked={notificationPrefs.weeklySummary}
                                                    onChange={handlePrefChange}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <div>
                                                <label htmlFor="budgetAlerts" className="font-medium text-gray-900 dark:text-white">
                                                    Budget Alerts
                                                </label>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Get notified when you're close to your budget limits.
                                                </p>
                                            </div>
                                            <label htmlFor="budgetAlerts" className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id="budgetAlerts"
                                                    name="budgetAlerts"
                                                    className="sr-only peer"
                                                    checked={notificationPrefs.budgetAlerts}
                                                    onChange={handlePrefChange}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <div>
                                                <label htmlFor="largeTransactions" className="font-medium text-gray-900 dark:text-white">
                                                    Large Transactions
                                                </label>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Get an alert for any transaction over ₦50,000.
                                                </p>
                                            </div>
                                            <label htmlFor="largeTransactions" className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id="largeTransactions"
                                                    name="largeTransactions"
                                                    className="sr-only peer"
                                                    checked={notificationPrefs.largeTransactions}
                                                    onChange={handlePrefChange}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        
                                        <div>
                                            <button
                                                type="submit"
                                                disabled={loadingPrefs}
                                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
                                            >
                                                {loadingPrefs ? 'Saving...' : 'Save Preferences'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'Security' && (
                                <div className="p-4 transition-all duration-300">
                                    <h2 className="text-2xl font-semibold mb-6 dark:text-white">Security Settings</h2>

                                    <div className="mb-8">
                                        <h3 className="text-xl font-medium mb-1 dark:text-white">Change Password</h3>
                                        <p className="mb-4 text-gray-600 dark:text-gray-300">Enter your current password to set a new one.</p>
                                        <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                                            <div>
                                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="currentPassword"
                                                    name="currentPassword"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    className="mt-1 w-full max-w-lg px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="newPassword"
                                                    name="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="mt-1 w-full max-w-lg px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    className="mt-1 w-full max-w-lg px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <button
                                                    type="submit"
                                                    disabled={loadingPassword}
                                                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
                                                >
                                                    {loadingPassword ? 'Saving...' : 'Change Password'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    <hr className="my-8 border-gray-300 dark:border-gray-600" />
                                    <div>
                                        <h3 className="text-xl font-medium mb-1 dark:text-white">Two-Factor Authentication (2FA)</h3>
                                        <p className="mb-4 text-gray-600 dark:text-gray-300">Add an extra layer of security to your account.</p>
                                        <button
                                            disabled
                                            className="px-6 py-2 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                                        >
                                            Enable 2FA (Coming Soon)
                                        </button>
                                    </div>
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
    );
}

export default Set;