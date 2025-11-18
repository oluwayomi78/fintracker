import {useState} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://fintracker-backend-v4fu.onrender.com';
import {toast} from 'react-toastify';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (loading) return;
        setLoading(true);
        const URI = `${API}/users/login`
        axios.post(URI, {
            email,
            password
        })
        .then((response) => {
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success('Signed in successfully!');
            navigate('/');
        })
        .catch((error) => {
            console.error(error);
            toast.error(error.response.data.message || 'Something went wrong, please try again.');
        })
        .finally(() => {
            setLoading(false);
        });
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Sign in to manage your finances.
                    </p>
                </div>
                <div className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="Enter your email"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Eye
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
                                aria-hidden="true"
                            />
                            <EyeOff
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer ${showPassword ? 'block' : 'hidden'}`}
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                    <div className="text-right">
                        <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            Forgot Password?
                        </a>
                    </div>
                    <div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                            `}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>
                </div>
                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to='/signup' className="font-medium text-blue-600 hover:text-blue-500">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignIn;