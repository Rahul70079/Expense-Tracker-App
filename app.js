var descInput = document.getElementById("desc");
var amountInput = document.getElementById("amount");
var typeSelect = document.getElementById("type");
var addBtn = document.getElementById("addBtn");
var transactionsList = document.getElementById("transactions");
var balanceEl = document.getElementById("balance");
var transactions = [];
var incomeTotal = 0;
var expenseTotal = 0;
var ctx = document.getElementById("myChart").getContext("2d");
var chart = new Chart(ctx, {
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
function updateUI() {
    transactionsList.innerHTML = "";
    transactions.forEach(function (t, index) {
        var li = document.createElement("li");
        li.textContent = "".concat(t.description, " - ").concat(t.amount, "\u20B9 (").concat(t.type, ")");
        var delBtn = document.createElement("button");
        delBtn.textContent = "❌";
        delBtn.addEventListener("click", function () { return deleteTransaction(index); });
        li.appendChild(delBtn);
        transactionsList.appendChild(li);
    });
    balanceEl.textContent = (incomeTotal - expenseTotal).toString();
    chart.data.datasets[0].data = [incomeTotal, expenseTotal];
    chart.update();
}
function addTransaction() {
    var desc = descInput.value.trim();
    var amount = parseFloat(amountInput.value);
    var type = typeSelect.value;
    if (!desc || isNaN(amount))
        return;
    transactions.push({ description: desc, amount: amount, type: type });
    if (type === "income")
        incomeTotal += amount;
    else
        expenseTotal += amount;
    descInput.value = "";
    amountInput.value = "";
    updateUI();
}
function deleteTransaction(index) {
    var t = transactions[index];
    if (t.type === "income")
        incomeTotal -= t.amount;
    else
        expenseTotal -= t.amount;
    transactions.splice(index, 1);
    updateUI();
}
addBtn.addEventListener("click", addTransaction);
updateUI();
