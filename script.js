document.addEventListener("DOMContentLoaded", () => {
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const typeSelect = document.getElementById("type");
  const addBtn = document.getElementById("add-btn");
  const resetBtn = document.getElementById("reset-btn");
  const entryList = document.getElementById("entry-list");
  const totalIncome = document.getElementById("total-income");
  const totalExpense = document.getElementById("total-expense");
  const netBalance = document.getElementById("net-balance");
  const clearAllBtn = document.getElementById("clear-all");
  const filters = document.getElementsByName("filter");

  let entries = JSON.parse(localStorage.getItem("ie_entries_v1")) || [];
  let editIndex = null;

  const updateTotals = () => {
    const income = entries
      .filter((e) => e.type === "income")
      .reduce((acc, cur) => acc + cur.amount, 0);
    const expense = entries
      .filter((e) => e.type === "expense")
      .reduce((acc, cur) => acc + cur.amount, 0);
    const balance = income - expense;

    totalIncome.textContent = `₹${income}`;
    totalExpense.textContent = `₹${expense}`;
    netBalance.textContent = `₹${balance}`;
  };

  const saveToLocalStorage = () => {
    localStorage.setItem("ie_entries_v1", JSON.stringify(entries));
  };

  const renderEntries = (filter = "all") => {
    entryList.innerHTML = "";
    const filtered = entries.filter((e) => filter === "all" || e.type === filter);
    filtered.forEach((entry, index) => {
      const li = document.createElement("li");
      li.classList.add("entry", entry.type);
      li.innerHTML = `
        <span>${entry.description} - ₹${entry.amount}</span>
        <div>
          <button onclick="editEntry(${index})">✏️</button>
          <button onclick="deleteEntry(${index})">🗑️</button>
        </div>
      `;
      entryList.appendChild(li);
    });
    updateTotals();
  };

  addBtn.addEventListener("click", () => {
    const desc = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    const type = typeSelect.value;

    if (!desc || isNaN(amount) || amount <= 0) {
      alert("Please enter valid details.");
      return;
    }

    if (editIndex !== null) {
      entries[editIndex] = { description: desc, amount, type };
      editIndex = null;
      addBtn.textContent = "Add";
    } else {
      entries.push({ description: desc, amount, type });
    }

    saveToLocalStorage();
    renderEntries(getSelectedFilter());
    resetInputs();
  });

  resetBtn.addEventListener("click", resetInputs);

  function resetInputs() {
    descriptionInput.value = "";
    amountInput.value = "";
    typeSelect.value = "income";
    editIndex = null;
    addBtn.textContent = "Add";
  }

  window.editEntry = (index) => {
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeSelect.value = entry.type;
    editIndex = index;
    addBtn.textContent = "Update";
  };

  window.deleteEntry = (index) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      entries.splice(index, 1);
      saveToLocalStorage();
      renderEntries(getSelectedFilter());
    }
  };

  clearAllBtn.addEventListener("click", () => {
    if (confirm("Clear all data?")) {
      entries = [];
      saveToLocalStorage();
      renderEntries();
    }
  });

  const getSelectedFilter = () => {
    return Array.from(filters).find((f) => f.checked).value;
  };

  filters.forEach((filter) =>
    filter.addEventListener("change", () => renderEntries(getSelectedFilter()))
  );

  renderEntries();
});
