import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const CATEGORIES = [
    "Income",
    "Food",
    "Transport",
    "Housing",
    "Health",
    "Education",
    "Shopping",
    "Groceries",
    "Bills",
    "Electronics"
];
const API = import.meta.env.VITE_API_URL || 'https://fintracker-backend-v4fu.onrender.com';

const EditExpenseModal = ({ isOpen, onClose, itemToEdit, onSave }) => {
    const [formData, setFormData] = useState({
        amount: "",
        selectedCategory: "Food",
        date: "",
        notes: "",
    });

    useEffect(() => {
        if (!isOpen || !itemToEdit) return;
        const d = itemToEdit.date ? new Date(itemToEdit.date) : null;
        const formattedDate =
            d && !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "";

        Promise.resolve().then(() => {
            setFormData({
                amount: itemToEdit.amount || "",
                selectedCategory: itemToEdit.selectedCategory || "Food",
                date: formattedDate,
                notes: itemToEdit.notes || "",
            });
        });
    }, [isOpen, itemToEdit]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const updatedExpense = {
                ...formData,
                amount: parseFloat(formData.amount),
            };

            await axios.put(
                `${API}/expense/${itemToEdit._id}`,
                updatedExpense,
                {
                    headers: {
                        "x-auth-token": token,
                        "Content-Type": "application/json"
                    }
                }
            );
            toast.success("Expense updated successfully");
            onSave();
            onClose();

        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Error updating expense");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700 transform transition-all scale-100">
                <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Edit Transaction
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Amount (₦)
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category
                        </label>
                        <select
                            name="selectedCategory"
                            value={formData.selectedCategory}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            placeholder="What was this for?"
                            className="w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg resize-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        />
                    </div>

                    <div className="flex gap-3 pt-4 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditExpenseModal;
