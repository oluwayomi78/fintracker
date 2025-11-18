import React from 'react'
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home.jsx';
import SignUp from './components/SignUp.jsx';
import SignIn from './components/SignIn.jsx';
import Setting from './components/Setting.jsx';
import AddExpenseForm from './components/AddExpenseForm.jsx';
import Set from './components/Set.jsx';

const App = () => {
  return (
    <div>
      
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/setting' element={<Setting />} />
        <Route path='/addExpense' element={<AddExpenseForm />} />
        <Route path='/set' element={<Set />} />
      </Routes>
    </div>
  )
}

export default App
