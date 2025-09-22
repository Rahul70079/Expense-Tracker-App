const descInput = document.getElementById("desc") as HTMLInputElement;
const amountInput = document.getElementById("amount") as HTMLInputElement;
const typeSelect = document.getElementById("type") as HTMLSelectElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const transactionsList = document.getElementById("transactions") as HTMLUListElement;
const balanceEl = document.getElementById("balance") as HTMLSpanElement;

interface Transaction {
  description: string;
  amount: number;
  type: "income" | "expense";
}

let transactions: Transaction[] = [];
let incomeTotal = 0;
let expenseTotal = 0;

const ctx = (document.getElementById("myChart") as HTMLCanvasElement).getContext("2d")!;
let chart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#28a745", "#dc3545"]
      }
    ]
  }
});

// 🔹 LocalStorage से transactions load करो
function loadTransactions() {
  const data = localStorage.getItem("transactions");
  if (data) {
    transactions = JSON.parse(data);
    // Totals calculate करो
    incomeTotal = 0;
    expenseTotal = 0;
    transactions.forEach(t => {
      if (t.type === "income") incomeTotal += t.amount;
      else expenseTotal += t.amount;
    });
  }
}

// 🔹 LocalStorage में save करो
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateUI() {
  transactionsList.innerHTML = "";
  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.textContent = `${t.description} - ${t.amount}₹ (${t.type})`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.addEventListener("click", () => deleteTransaction(index));

    li.appendChild(delBtn);
    transactionsList.appendChild(li);
  });

  balanceEl.textContent = (incomeTotal - expenseTotal).toString();

  chart.data.datasets[0].data = [incomeTotal, expenseTotal];
  chart.update();

  saveTransactions(); // हर update पर LocalStorage में save
}

function addTransaction() {
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value as "income" | "expense";

  if (!desc || isNaN(amount)) return;

  transactions.push({ description: desc, amount, type });

  if (type === "income") incomeTotal += amount;
  else expenseTotal += amount;

  descInput.value = "";
  amountInput.value = "";

  updateUI();
}

function deleteTransaction(index: number) {
  const t = transactions[index];
  if (t.type === "income") incomeTotal -= t.amount;
  else expenseTotal -= t.amount;

  transactions.splice(index, 1);
  updateUI();
}

addBtn.addEventListener("click", addTransaction);

// 🔹 पहले से save किए गए data load करो
loadTransactions();
updateUI();

