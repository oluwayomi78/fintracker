import { useState, useEffect } from 'react';
import { Wallet, CircleUser, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [user, setUser] = useState(() => {
        try {
            const userData = localStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        } catch {
            return null;
        }
    });

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                try {
                    const userData = localStorage.getItem('user');
                    setUser(userData ? JSON.parse(userData) : null);
                } catch {
                    setUser(null);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const API = import.meta.env.VITE_API_URL || 'https://fintracker-backend-v4fu.onrender.com';

    return (
        <div>
            <nav className="w-full bg-white dark:bg-gray-800 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 rounded-lg sticky top-0 z-10 gap-4">
                <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 p-2 rounded-lg ml-4">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <Link to="/">
                        <span className="text-2xl font-bold text-blue-600">FinTracker</span>
                    </Link>
                </div>
                
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <Link to='/setting'>
                        {user && user.photoUrl ? (
                            <img
                                src={user.photoUrl ? `${API}/${user.photoUrl}` : "https://i.imgur.com/gBqWAiQ.png"}
                                alt="Profile"
                                className="w-9 h-9 rounded-full mr-4 object-cover"
                            />
                        ) : (
                            <CircleUser className="w-9 h-9 text-gray-600 dark:text-gray-400 mr-4" />
                        )}
                    </Link>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;