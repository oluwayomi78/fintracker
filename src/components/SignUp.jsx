import {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL || 'https://fintracker-backend-v4fu.onrender.com';
import { User, Mail, Lock, CheckCheck,Eye ,EyeClosed } from 'lucide-react';
import { toast } from 'react-toastify';

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [Loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = async () => {
        const URI = `${API}/users/signUp`
        try {
            const response = await axios.post(URI, {
                name,
                email,
                password,
                confirmPassword
            });
            console.log(response.data);
            toast.success('Account created successfully!');
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setShowPassword(false);
            setLoading(true);
            navigate('/signin')
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message || 'Something went wrong, please try again.');
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    };

    return (
        <>
        {Loading ? (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
) : (
    null
)}
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-gray-900">
                    Create Your Account
                </h1>
                <p className="text-gray-600">
                    Join FinTracker to manage your expenses effortlessly.
                </p>
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Full Name
                        </label>
                        <div className="relative mt-1">
                            <User
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>
                        <div className="relative mt-1">
                            <Mail
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="john.doe@example.com"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="relative mt-1">
                            <Lock
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Eye
                                className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer ${showPassword ? 'hidden' : ''}`} 
                                onClick={() => setShowPassword(!showPassword)}
                                aria-hidden="true"
                            />
                            <EyeClosed
                                className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer ${!showPassword ? 'hidden' : ''}`} 
                                onClick={() => setShowPassword(!showPassword)}
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="confirm-password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <div className="relative mt-1">
                            <CheckCheck
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                            <input
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                name="confirm-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Eye
                                className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer ${showPassword ? 'hidden' : ''}`} 
                                onClick={() => setShowPassword(!showPassword)}
                                aria-hidden="true"
                            />
                            <EyeClosed
                                className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer ${!showPassword ? 'hidden' : ''}`} 
                                onClick={() => setShowPassword(!showPassword)}
                                aria-hidden="true"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleSubmit}
                            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to='/signin' className="font-medium text-blue-600 hover:text-blue-500">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
        </>
    );
}

export default SignUp;