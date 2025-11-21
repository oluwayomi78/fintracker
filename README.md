FinTracker

FinTracker is a modern expense tracking web application that helps users manage their finances efficiently. Track your expenses, monitor budgets, categorize transactions, and receive alerts for overspending — all in one intuitive interface.

Features

Add, Edit, and Delete Expenses: Keep track of your spending in real-time.

Categorize Transactions: Organize expenses by categories like Food, Transport, Bills, etc.

Track Income: Manage both income and expenses.

Budget Alerts: Get notifications when you exceed your budget.

Weekly Summary: Receive weekly insights on your spending habits.

Responsive Design: Works on mobile, tablet, and desktop.

Dark Mode: Optional dark theme for better readability.

Authentication: Secure login and JWT-based authentication.

Tech Stack

Frontend: React, Tailwind CSS, Axios

Backend: Node.js, Express

Database: MongoDB

Authentication: JWT (JSON Web Tokens)

Installation

Clone the repository

git clone https://github.com/oluwayomi78/fintracker.git
cd fintracker


Install backend dependencies

cd backend
npm install


Install frontend dependencies

cd ../frontend
npm install


Set up environment variables

Create a .env file in the backend folder:

PORT=4500
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


Run the backend server

cd backend
npm run dev


Run the frontend

cd frontend
npm run dev

Usage

Register a new account or log in.

Add expenses or income with categories and descriptions.

Edit or delete existing transactions.

Set budget limits and track alerts.

View weekly summaries and manage finances efficiently.

API Endpoints
Method	Endpoint	Description
POST	/api/users/register	Register a new user
POST	/api/users/login	Login and get JWT token
GET	/api/expenses	Get all user expenses
POST	/api/expenses	Add a new expense
PUT	/api/expenses/:id	Update an existing expense
DELETE	/api/expenses/:id	Delete an expense
Contributing

Fork the repository.

Create a new branch (git checkout -b feature-name).

Make your changes and commit (git commit -m "Add feature").

Push to your branch (git push origin feature-name).

Open a Pull Request.

License

This project is licensed under the MIT License.