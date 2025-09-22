const descInput = document.getElementById("desc") as HTMLInputElement;
const amountInput = document.getElementById("amount") as HTMLInputElement;
const typeSelect = document.getElementById("type") as HTMLSelectElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const transactionsList = document.getElementById("transactions") as HTMLUListElement;
const balanceEl = document.getElementById("balance") as HTMLSpanElement;
const monthFilter = document.getElementById("monthFilter") as HTMLSelectElement;

interface Transaction {
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string; // 🔹 Added date
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

// 🔹 LocalStorage से load
function loadTransactions() {
  const data = localStorage.getItem("transactions");
  if (data) {
    transactions = JSON.parse(data);
  }
}

// 🔹 LocalStorage में save
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateUI() {
  transactionsList.innerHTML = "";

  const selectedMonth = monthFilter.value;
  incomeTotal = 0;
  expenseTotal = 0;

  const filtered = transactions.filter(t => {
    if (selectedMonth === "all") return true;
    const txMonth = new Date(t.date).getMonth().toString();
    return txMonth === selectedMonth;
  });

  filtered.forEach((t, index) => {
    const li = document.createElement("li");
    const dateStr = new Date(t.date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
    li.textContent = `${t.description} - ${t.amount}₹ (${t.type}) [${dateStr}]`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.addEventListener("click", () => deleteTransaction(index, filtered));

    li.appendChild(delBtn);
    transactionsList.appendChild(li);

    if (t.type === "income") incomeTotal += t.amount;
    else expenseTotal += t.amount;
  });

  balanceEl.textContent = (incomeTotal - expenseTotal).toString();

  chart.data.datasets[0].data = [incomeTotal, expenseTotal];
  chart.update();

  saveTransactions();
}

function addTransaction() {
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value as "income" | "expense";

  if (!desc || isNaN(amount)) return;

  transactions.push({
    description: desc,
    amount,
    type,
    date: new Date().toISOString() // 🔹 Save current date
  });

  descInput.value = "";
  amountInput.value = "";

  updateUI();
}

function deleteTransaction(index: number, filtered: Transaction[]) {
  const tx = filtered[index];
  transactions = transactions.filter(t => t !== tx); // remove from all
  updateUI();
}

addBtn.addEventListener("click", addTransaction);
monthFilter.addEventListener("change", updateUI);

loadTransactions();
updateUI();
