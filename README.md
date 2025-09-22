expense-tracker/

│── index.html

│── style.css

│── app.ts

│── app.js  
                            Note --- (compiled from app.ts)
│── README.md


# Expense Tracker App 💰

A simple **Expense Tracker Web App** built with **TypeScript**, **HTML**, **CSS**, and **Chart.js**.  
You can add your income and expenses, view your balance, and see a graphical summary.  
All data is saved in **LocalStorage**, and you can filter transactions by **Month**.

---

## Features

- Add **Income** and **Expense** transactions.
- **Balance calculation**: Income - Expense.
- **Transactions list** with delete option.
- **Pie Chart** using Chart.js for Income vs Expense.
- **Monthly Filter** to view transactions of a selected month.
- **LocalStorage support** to save data even after page refresh.

  ---

## How to Run Locally

1. Clone the repository:
   ```bash
   https://github.com/Rahul70079/Expense-Tracker-App
   cd expense-tracker

  2. Install TypeScript (if not installed):
     npm install -g typescript

  3.Compile TypeScript:
    tsc app.ts

   4. Open index.html in your browser:
     . Either double-click the file
      . Or use a local server:
      npx serve . -p 5500

      Then open http://localhost:5500 in your browser.


Demo Screenshot
Tech Stack

TypeScript
HTML5
CSS3
Chart.js
LocalStorage API

License

This project is licensed under the MIT License.

---





