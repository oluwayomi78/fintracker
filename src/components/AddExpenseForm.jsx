import { useState } from 'react';
import { Plus, Utensils, Car, Home, HeartPulse, BookOpen, ShoppingBag, ShoppingCart, Receipt, Cable, TrendingUp, CalendarDays } from 'lucide-react';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const categories = [
    { name: 'Food', icon: <Utensils className="w-4 h-4" /> },
    { name: 'Transport', icon: <Car className="w-4 h-4" /> },
    { name: 'Housing', icon: <Home className="w-4 h-4" /> },
    { name: 'Health', icon: <HeartPulse className="w-4 h-4" /> },
    { name: 'Education', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Shopping', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Groceries', icon: <ShoppingCart className="w-4 h-4" /> },
    { name: 'Bills', icon: <Receipt className="w-4 h-4" /> },
    { name: 'Electronics', icon: <Cable className="w-4 h-4" /> },
    { name: 'Income', icon: <TrendingUp className="w-4 h-4" /> },
];

const AddExpenseForm = () => {
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Food');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const URI = 'https://fintracker-backend-v4fu.onrender.com/expense/add';
        const token = localStorage.getItem("token");
        axios.post(URI, {
            amount: amount,
            selectedCategory: selectedCategory,
            date: date,
            notes: notes
        }, {
            headers: {
                "x-auth-token": token
            }
        })
            .then((response) => {
                console.log(response.data);
                setAmount('');
                setSelectedCategory('Food');
                setDate('')
                setNotes('')
                toast.success('Add Expense successfully!');
                navigate('/');
            })
            .catch((error) => {
                console.log(error)
                toast.error(error.response.data.message || 'Something went wrong, please try again.');
            });

    };

    return (
        <>
        <div>
            <div>
                <Navbar />
            </div>
            <div className="flex items-center justify-center min-h-screen dark:bg-gray-900 bg-gray-100 p-4">
                <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Add New Expense
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="amount"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                                    ₦
                                </span>
                                <input
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                                Category
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {categories.map((category) => (
                                    <button
                                        type="button"
                                        key={category.name}
                                        onClick={() => setSelectedCategory(category.name)}
                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category.name
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {category.icon}
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="date"
                                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                            >
                                Date
                            </label>
                            <div className="relative">
                                <CalendarDays
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 "
                                    aria-hidden="true"
                                />
                                <input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="notes"
                                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                            >
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add a brief description or note..."
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <Plus className="w-5 h-5" />
                                Add Expense
                            </button>
                        </div>
                    </form>
                </div>

            </div>
            <footer className="w-full text-center py-6 text-gray-500 dark:text-gray-400 text-sm dark:bg-gray-900 bg-gray-100">
                © 2025 FinTrack. All rights reserved.
            </footer>
        </div>
        </>
    );
}

export default AddExpenseForm;