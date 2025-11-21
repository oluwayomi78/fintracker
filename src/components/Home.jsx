import { useState, useEffect } from 'react'
import { CircleUser, Wallet, LayoutDashboard, ArrowRightLeft, Settings, Plus, BarChart3, ReceiptText, ArrowUpRight, Eye, EyeOff, ArrowDownRight, Utensils, Car, HeartPulse, BookOpen, ShoppingBag, ShoppingCart, Receipt, HomeIcon, Banknote, Sun, Moon, Cable, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom';
import axios from 'axios'
const API = import.meta.env.VITE_API_URL || 'https://fintracker-backend-v4fu.onrender.com';
import EditExpenseModal from "./EditExpenseModal";
import DonutChartComponent from './DonutChartComponent';
import LineChartComponent from './LineChartComponent';
import Set from './Set';
import Notification from './Notification';

const Home = () => {
    const [active, setActive] = useState("Dashboard");
    const [expenses, setExpenses] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [showBalance, setShowBalance] = useState(false);
    const [filteredExpenses, setFilteredExpenses] = useState("all");
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
        const token = localStorage.getItem("token");
        const fetchExpenses = async () => {
            try {
                const res = await axios.get(`${API}/expense/get`, {
                    headers: {
                        "x-auth-token": token
                    }
                });
                setExpenses(res.data.expenses);
            } catch (error) {
                console.log(error);
            }
        };
        if (!token) {
            return;
        }
        fetchExpenses();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const handleEdit = (item) => {
        setCurrentEditItem(item);
        setIsEditModalOpen(true);
    };
    const handleSaveEdit = (id, updatedData) => {
        setExpenses((prev) =>
            prev.map((item) => (item._id === id ? { ...item, ...updatedData } : item))
        );
        console.log("Updated Item:", id, updatedData);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API}/expense/${id}`, {
                headers: {
                    "x-auth-token": token
                }
            });
            setExpenses((prev) => prev.filter((item) => item._id !== id));
            alert("Transaction deleted successfully!");
        } catch (error) {
            console.error("Failed to delete expense:", error);
            alert("Failed to delete transaction. Please try again.");
        }
    };


    const chartData = Object.values(
        expenses
            .filter((item) =>
                filteredExpenses === "all" ?
                    true :
                    item.selectedCategory.toLowerCase() === filteredExpenses
            )
            .reduce((acc, item) => {
                const category = item.selectedCategory;
                if (!acc[category]) {
                    acc[category] = {
                        name: category,
                        value: 0
                    };
                }
                acc[category].value += item.amount;
                return acc;
            }, {})
    );

    const categories = ["all", "food", "transport", "housing", "health", "education", "shopping", "groceries", "bills", "electronics", "income"];

    const [user] = useState(() => {
        try {
            const userData = localStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        } catch {
            return null;
        }
    });

    const totalIncome = expenses
        .filter(e => e.selectedCategory.toLowerCase() === "income")
        .reduce((sum, e) => sum + e.amount, 0);

    const totalExpenses = expenses
        .filter(e => e.selectedCategory.toLowerCase() !== "income")
        .reduce((sum, e) => sum + e.amount, 0);

    const netBalance = totalIncome - totalExpenses;
    const BudgetRemaining = totalIncome - totalExpenses;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const expensesThisMonth = expenses.filter((item) => {
        const expenseDate = new Date(item.date);
        return (
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
        );
    });

    const getMonthlySpending = (expenses) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames.map((month, idx) => {
            const monthExpenses = expenses.filter(exp => {
                const date = new Date(exp.date);
                return date.getMonth() === idx;
            });
            const totalSpending = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            return {
                name: month,
                spending: totalSpending
            };
        });
    };

    const getMonthlyBalance = (expenses, monthOffset = 0) => {
        const now = new Date();
        let targetMonth = now.getMonth() - monthOffset;
        let targetYear = now.getFullYear();

        if (targetMonth < 0) {
            targetMonth += 12;
            targetYear -= 1;
        }

        const monthExpenses = expenses.filter(exp => {
            const date = new Date(exp.date);
            return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
        });

        const income = monthExpenses
            .filter(e => e.selectedCategory.toLowerCase() === "income")
            .reduce((sum, e) => sum + e.amount, 0);

        const expense = monthExpenses
            .filter(e => e.selectedCategory.toLowerCase() !== "income")
            .reduce((sum, e) => sum + e.amount, 0);

        return income - expense;
    };

    const currentMonthBalance = getMonthlyBalance(expenses, 0);
    const lastMonthBalance = getMonthlyBalance(expenses, 1);

    const balanceChange = lastMonthBalance === 0 ?
        (currentMonthBalance > 0 ? 100 : 0)
        :
        ((currentMonthBalance - lastMonthBalance) / Math.abs(lastMonthBalance)) * 100;

    return (
        <div className="bg-gray-100 dark:bg-gray-900 overflow-x-hidden min-h-screen" >
            <nav className="w-full bg-white dark:bg-gray-800 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 z-40">
                <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 p-2 rounded-lg ml-0 md:ml-4">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-blue-600 hidden sm:block">FinTracker</span>
                    <span className="text-2xl font-bold text-blue-600 sm:hidden">FinTracker</span>
                </div>

                <div className="flex items-center gap-4 mr-0 md:mr-4">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <Notification />
                    <Link to='/set'>
                        {user && user.photoUrl ? (
                            <img
                                src={user.photoUrl ? `https://fintracker-backend-v4fu.onrender.com/${user.photoUrl}` : "https://i.imgur.com/gBqWAiQ.png"}
                                alt="Profile"
                                className="w-9 h-9 rounded-full object-cover"
                            />
                        ) : (
                            <Link to={'/signin'}>
                                <CircleUser className="w-9 h-9 text-gray-600 dark:text-gray-400" />
                            </Link>
                        )}
                    </Link>
                </div>
            </nav>

            <aside className="w-64 h-screen bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed top-16 left-0 p-4 md:flex md:flex-col hidden z-20">
                <ul className="space-y-5 ml-4">
                    <li onClick={() => setActive("Dashboard")} className={`cursor-pointer px-3 py-2 rounded-md transition-colors flex mt-4 ${active === "Dashboard" ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"}`}> <LayoutDashboard className='mr-4' />Dashboard</li>
                    <li onClick={() => setActive("Transactions")} className={`cursor-pointer px-3 py-2 rounded-md transition-colors flex mt-4 ${active === "Transactions" ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"}`}> <ArrowRightLeft className='mr-4' />Transactions</li>
                    <li onClick={() => setActive("Analytics")} className={`cursor-pointer px-3 py-2 rounded-md transition-colors flex mt-4 ${active === "Analytics" ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"}`}> <BarChart3 className='mr-4' />Analytics</li>
                    <li onClick={() => setActive("Settings")} className={`cursor-pointer px-3 py-2 rounded-md transition-colors flex mt-4 ${active === "Settings" ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"}`}> <Settings className='mr-4' />Settings</li>
                </ul>
                <div className="mt-7 ">
                    <Link to={'/addExpense'}>
                        <button className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"><Plus className='mr-4' />Add Expenses</button>
                    </Link>
                </div>
            </aside>

            <div className="w-full md:hidden fixed bottom-0 left-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <Link to={'/addExpense'}>
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
                            <Plus className="w-5 h-5" /> Add Expense
                        </button>
                    </Link>
                </div>
                <ul className="flex justify-between items-center px-6 py-3">
                    <li onClick={() => setActive("Dashboard")} className={`flex flex-col items-center text-xs cursor-pointer ${active === "Dashboard" ? "text-blue-600" : "text-gray-500 dark:text-gray-400 hover:text-blue-600"}`}>
                        <LayoutDashboard className="w-6 h-6 mb-1" /> Dashboard
                    </li>
                    <li onClick={() => setActive("Transactions")} className={`flex flex-col items-center text-xs cursor-pointer ${active === "Transactions" ? "text-blue-600" : "text-gray-500 dark:text-gray-400 hover:text-blue-600"}`}>
                        <ReceiptText className="w-6 h-6 mb-1" /> Transactions
                    </li>
                    <li onClick={() => setActive("Analytics")} className={`flex flex-col items-center text-xs cursor-pointer ${active === "Analytics" ? "text-blue-600" : "text-gray-500 dark:text-gray-400 hover:text-blue-600"}`}>
                        <BarChart3 className="w-6 h-6 mb-1" /> Analytics
                    </li>
                    <li onClick={() => setActive("Settings")} className={`flex flex-col items-center text-xs cursor-pointer ${active === "Settings" ? "text-blue-600" : "text-gray-500 dark:text-gray-400 hover:text-blue-600"}`}>
                        <Settings className="w-6 h-6 mb-1" /> Settings
                    </li>
                </ul>
            </div>

            <div className="w-full md:ml-64 pt-10 p-4 min-h-screen transition-all duration-300 box-border md:w-[calc(100%-16rem)]">
                {active === "Dashboard" && (
                    <div>
                        {user ? (
                            <>
                                <div className="max-w-6xl w-full mx-auto mt-6 md:mt-10 px-4">
                                    <h1 className="text-xl md:text-2xl mt-10 font-bold dark:text-white">Welcome back, {user.name}!</h1>
                                    <p className="text-gray-600 dark:text-gray-300">Here's your financial overview.</p>
                                </div>
                            </>
                        ) : (
                            <div className="max-w-6xl w-full mx-auto mt-6 md:mt-10 px-4">
                                <p className="dark:text-white">You are not signed in.</p>
                                <Link to="/signin" className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-md">Sign in</Link>
                            </div>
                        )}
                        <div className="max-w-6xl w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6 md:mt-10 px-4 flex flex-col gap-4">

                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</h2>
                                    <p className="text-3xl md:text-4xl font-bold text-blue-600 flex items-center">
                                        {showBalance
                                            ? `₦${Number(netBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                            : '*******'}
                                        <span className="ml-2 cursor-pointer text-gray-400 dark:text-gray-500">
                                            {showBalance ? (
                                                <EyeOff className="w-5 h-5" onClick={() => setShowBalance(false)} />
                                            ) : (
                                                <Eye className="w-5 h-5" onClick={() => setShowBalance(true)} />
                                            )}
                                        </span>
                                    </p>
                                </div>
                                <div className={`flex items-center gap-1 text-sm md:text-base font-medium mt-3 ${balanceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {balanceChange >= 0 ? <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowDownRight className="w-4 h-4 md:w-5 md:h-5" />}
                                    <span className='hidden md:flex'>
                                        {balanceChange >= 0 ? '+' : ''}{balanceChange.toFixed(1)}% last month
                                    </span>
                                </div>
                            </div>

                            <span className='md:hidden text-gray-500 dark:text-gray-400'>Available to spend</span>
                            <hr className="border-gray-200 dark:border-gray-700 my-2 hidden md:flex" />
                            <div className="hidden md:flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget Remaining</h3>
                                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                        ₦{BudgetRemaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Expenses This Month</h3>
                                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                        ₦{expensesThisMonth.reduce((sum, item) => sum + item.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="block md:hidden mt-3">
                            <h1 className='text-1xl font-sans font-bold ml-2 dark:text-white'>Recent Transactions</h1>
                            <div className="max-w-[98%] w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
                                {expenses.slice(-5).reverse().map((item) => {
                                    const isIncome = item.selectedCategory.toLowerCase() === "income";
                                    return (
                                        <div key={item._id} className="flex justify-between items-center mb-4 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                            <div>
                                                <h2 className="text-md font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                    {isIncome ? <ArrowUpRight className="w-4 h-4 text-green-600" /> : <ArrowDownRight className="w-4 h-4 text-red-600" />}
                                                    {item.selectedCategory}
                                                </h2>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.notes}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-md font-semibold ${isIncome ? "text-green-600" : "text-red-600"}`}>
                                                    ₦{item.amount.toLocaleString()}
                                                </p>
                                                <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(item.date)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="max-w-6xl w-full mx-auto rounded-lg p-6 md:mt-3 hidden md:flex flex-wrap gap-2 px-4">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className={`px-4 py-2 rounded-full text-white transition-colors ${filteredExpenses === category ? "bg-blue-800 dark:bg-blue-500" : "bg-blue-600 hover:bg-blue-700"}`}
                                    onClick={() => setFilteredExpenses(category)}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="block md:hidden mt-3">
                            <h1 className='text-1xl font-sans font-bold ml-2 mb-3 dark:text-white'>Spending Analytics</h1>
                        </div>
                        <div className="block md:hidden overflow-auto whitespace-nowrap">
                            <div className="w-full max-w-[98%] mx-auto mb-2 pb-3 mt-3 space-x-3">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        className={`px-4 py-2 rounded-full text-white transition-colors ${filteredExpenses === category ? "bg-blue-800 dark:bg-blue-500" : "bg-blue-600 hover:bg-blue-700"}`}
                                        onClick={() => setFilteredExpenses(category)}
                                    >
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="max-w-6xl w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6 hidden md:flex px-4 flex-col">
                            <h1 className='text-2xl font-sans font-bold dark:text-white'>Recent Transactions</h1>
                            <div className='mt-4 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default dark:border-gray-700'>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[600px] text-sm text-left rtl:text-right text-body">
                                        <thead className="text-sm text-body bg-gray-100 dark:bg-gray-700 dark:text-gray-300 border-b rounded-base border-default dark:border-gray-600">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 font-medium whitespace-nowrap text-center">Category</th>
                                                <th scope="col" className="px-6 py-3 font-medium whitespace-nowrap text-center">Description</th>
                                                <th scope="col" className="px-6 py-3 font-medium whitespace-nowrap text-center">Date</th>
                                                <th scope="col" className="px-6 py-3 font-medium whitespace-nowrap text-center">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="dark:text-gray-200">
                                            {expenses.slice(-5).reverse().map((item) => {
                                                const isIncome = item.selectedCategory.toLowerCase() === "income";
                                                const isFood = item.selectedCategory.toLowerCase() === "food";
                                                const isTransport = item.selectedCategory.toLowerCase() === "transport";
                                                const isHousing = item.selectedCategory.toLowerCase() === "housing";
                                                const isHealth = item.selectedCategory.toLowerCase() === "health";
                                                const isEducation = item.selectedCategory.toLowerCase() === "education";
                                                const isShopping = item.selectedCategory.toLowerCase() === "shopping";
                                                const isGroceries = item.selectedCategory.toLowerCase() === "groceries";
                                                const isBills = item.selectedCategory.toLowerCase() === "bills";
                                                const isElectronics = item.selectedCategory.toLowerCase() === "electronics";
                                                return (
                                                    <tr key={item._id} className="text-center border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="p-2 border-x dark:border-gray-700 px-6 py-4 whitespace-nowrap flex items-center justify-center gap-2">
                                                            {isFood ? <Utensils className="w-4 h-4 " /> : null}
                                                            {isTransport ? <Car className="w-4 h-4 " /> : null}
                                                            {isHousing ? <HomeIcon className="w-4 h-4 " /> : null}
                                                            {isHealth ? <HeartPulse className="w-4 h-4 " /> : null}
                                                            {isEducation ? <BookOpen className="w-4 h-4 " /> : null}
                                                            {isShopping ? <ShoppingBag className="w-4 h-4 " /> : null}
                                                            {isGroceries ? <ShoppingCart className="w-4 h-4 " /> : null}
                                                            {isBills ? <Receipt className="w-4 h-4 " /> : null}
                                                            {isElectronics ? <Cable className="w-4 h-4 " /> : null}
                                                            {isIncome ? <Banknote className="w-4 h-4 " /> : null}
                                                            {item.selectedCategory}
                                                        </td>
                                                        <td className="p-2 border-x dark:border-gray-700 px-6 py-4 whitespace-nowrap">{item.notes}</td>
                                                        <td className="p-2 border-x dark:border-gray-700 px-6 py-4 whitespace-nowrap">{formatDate(item.date)}</td>
                                                        <td className={`p-2 border-x dark:border-gray-700 px-6 py-4 whitespace-nowrap flex items-center justify-center gap-1 font-semibold ${isIncome ? "text-green-600" : "text-red-600"}`}>
                                                            {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                                            ₦{item.amount.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="w-full max-w-6xl mx-auto hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-6 mt-6 px-4">
                            <div className="h-96 w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col gap-4">
                                <h1 className='text-2xl font-sans font-bold dark:text-white'>Category Spending</h1>
                                <div className="mt-4 h-full flex items-center justify-center text-gray-400">
                                    <div className="h-64 md:h-72 w-full flex items-center justify-center">
                                        <DonutChartComponent data={chartData} />
                                    </div>
                                </div>
                            </div>
                            <div className="h-96 w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col gap-4">
                                <h1 className='text-2xl font-sans font-bold dark:text-white'>Monthly Spending</h1>
                                <div className="mt-5 h-full flex items-center justify-center text-gray-400">
                                    <div className="h-64 md:h-72 w-full flex items-center justify-center">
                                        <LineChartComponent data={getMonthlySpending(expenses)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="block md:hidden mt-3 w-full">
                            <div className="w-full max-w-[98%] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6 flex flex-col gap-4">
                                <h1 className='text-1xl font-sans font-bold dark:text-white'>Category Spending</h1>
                                <div className="mt-4 h-64 flex items-center justify-center text-gray-400">
                                    <div className="h-64 md:h-80 w-full flex items-center justify-center">
                                        <DonutChartComponent data={chartData} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="block md:hidden mt-3 mb-10 w-full">
                            <div className="w-full max-w-[98%] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6 flex flex-col gap-4">
                                <h1 className='text-1xl font-sans font-bold dark:text-white'>Monthly Spending</h1>
                                <div className="mt-4 h-64 flex items-center justify-center text-gray-400">
                                    <div className="h-64 md:h-80 w-full flex items-center justify-center">
                                        <LineChartComponent data={getMonthlySpending(expenses)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {active === "Transactions" && (
                    <div className="max-w-6xl w-full mx-auto pt-6 md:mt-10 px-4">
                        <h1 className='text-2xl font-sans font-bold mb-4 hidden md:block dark:text-white'>All Transactions</h1>
                        <div className='mt-4 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default dark:border-gray-700 hidden md:block'>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px] text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-sm text-body bg-gray-100 dark:bg-gray-700 dark:text-gray-300 border-b rounded-base border-default dark:border-gray-600">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 font-medium whitespace-nowrap text-center">Category</th>
                                            <th scope="col" className="px-6 py-3 font-medium whitespace-nowrap text-center">Description</th>
                                            <th scope="col" className="px-6 py-3 font-medium whitespace-nowrap text-center">Date</th>
                                            <th scope="col" className="px-6 py-3 font-medium whitespace-nowrap text-center">Amount</th>
                                            <th scope="col" className="px-6 py-3 font-medium whitespace-nowrap text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="dark:text-gray-200">
                                        {expenses.map((item) => {
                                            const isIncome = item.selectedCategory.toLowerCase() === "income";
                                            const isFood = item.selectedCategory.toLowerCase() === "food";
                                            const isTransport = item.selectedCategory.toLowerCase() === "transport";
                                            const isHousing = item.selectedCategory.toLowerCase() === "housing";
                                            const isHealth = item.selectedCategory.toLowerCase() === "health";
                                            const isEducation = item.selectedCategory.toLowerCase() === "education";
                                            const isShopping = item.selectedCategory.toLowerCase() === "shopping";
                                            const isGroceries = item.selectedCategory.toLowerCase() === "groceries";
                                            const isBills = item.selectedCategory.toLowerCase() === "bills";
                                            const isElectronics = item.selectedCategory.toLowerCase() === "electronics";

                                            return (
                                                <tr key={item._id} className="text-center border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="p-2 border-x dark:border-gray-700 px-6 py-4 whitespace-nowrap flex items-center justify-center gap-2">
                                                        {isFood ? <Utensils className="w-4 h-4 " /> : null}
                                                        {isTransport ? <Car className="w-4 h-4 " /> : null}
                                                        {isHousing ? <HomeIcon className="w-4 h-4 " /> : null}
                                                        {isHealth ? <HeartPulse className="w-4 h-4 " /> : null}
                                                        {isEducation ? <BookOpen className="w-4 h-4 " /> : null}
                                                        {isShopping ? <ShoppingBag className="w-4 h-4 " /> : null}
                                                        {isGroceries ? <ShoppingCart className="w-4 h-4 " /> : null}
                                                        {isBills ? <Receipt className="w-4 h-4 " /> : null}
                                                        {isElectronics ? <Cable className="w-4 h-4 " /> : null}
                                                        {isIncome ? <Banknote className="w-4 h-4 " /> : null}
                                                        {item.selectedCategory}
                                                    </td>
                                                    <td className="p-2 border-x dark:border-gray-700 px-6 py-4 whitespace-nowrap">{item.notes}</td>
                                                    <td className="p-2 border-x dark:border-gray-700 px-6 py-4 whitespace-nowrap">{formatDate(item.date)}</td>
                                                    <td className={`p-2 border-x dark:border-gray-700 px-6 py-4 whitespace-nowrap flex items-center justify-center gap-1 font-semibold ${isIncome ? "text-green-600" : "text-red-600"}`}>
                                                        {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                                        ₦{item.amount.toLocaleString()}
                                                    </td>
                                                    <td className="p-2 border-x dark:border-gray-700 px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button
                                                                onClick={() => handleEdit(item)}
                                                                className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item._id)}
                                                                className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-gray-800"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <EditExpenseModal
                                isOpen={isEditModalOpen}
                                onClose={() => setIsEditModalOpen(false)}
                                itemToEdit={currentEditItem}
                                onSave={handleSaveEdit}
                            />
                        </div>
                        <div className="block md:hidden mt-3 w-full">
                            <h1 className='text-1xl font-sans font-bold ml-2 dark:text-white'>All Transactions</h1>
                            <div className="max-w-[98%] w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6 flex flex-col gap-4">
                                {expenses.map((item) => {
                                    const isIncome = item.selectedCategory.toLowerCase() === "income";
                                    return (
                                        <div key={item._id} className="flex justify-between items-center mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                            <div>
                                                <h2 className="text-md font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                    {isIncome ? <ArrowUpRight className="w-4 h-4 text-green-600" /> : <ArrowDownRight className="w-4 h-4 text-red-600" />}
                                                    {item.selectedCategory}
                                                </h2>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.notes}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-md font-semibold ${isIncome ? "text-green-600" : "text-red-600"}`}>
                                                    ₦{item.amount.toLocaleString()}
                                                </p>
                                                <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(item.date)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {active === "Analytics" && (
                    <div className="max-w-6xl w-full mx-auto pt-6 md:mt-10 px-4">
                        <h1 className='text-2xl font-sans font-bold mb-4 dark:text-white'>Spending Analytics</h1>
                        <div className="max-w-[98%] w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6 flex flex-col gap-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Total Spending</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">This Year</p>
                            </div>
                            <div className="mt-4 h-64 flex items-center justify-center text-gray-400">
                                <div className="h-64 md:h-80 w-full flex items-center justify-center">
                                    <LineChartComponent data={getMonthlySpending(expenses)} />
                                </div>
                            </div>
                        </div>
                        <div className="max-w-[98%] w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6 flex flex-col gap-4">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Spending by Category</h2>
                            <div className="h-64 md:h-80 w-full flex items-center justify-center">
                                <DonutChartComponent data={chartData} />
                            </div>
                        </div>
                    </div>
                )}

                {active === "Settings" && (
                    <div className="max-w-6xl w-full mx-auto pt-6 md:mt-10 px-4">
                        <Set isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                    </div>
                )}
            </div>

            <footer className="w-full text-center py-4 text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 md:pl-64">
                © 2025 <span className="font-semibold text-blue-600">FinTrack</span>. All rights reserved.
            </footer>
        </div>
    )
}

export default Home