import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let expensesDiv = null;
let expensesTable = null;
let expensesTableHeader = null;
let expensesTbody = null;

let currentPage = 1;
let totalPages = 1;
const limit = 7;

export const handleExpenses = () => {
  expensesDiv = document.getElementById("expenses");
  expensesTable = document.getElementById("expenses-table");
  expensesTableHeader = document.getElementById("expenses-table-header");
  expensesTbody = document.getElementById("expenses-tbody");

  const logoff = document.getElementById("logoff");
  const addExpense = document.getElementById("add-expense");

  expensesDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addExpense) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);
        message.textContent = "You have been logged off.";
        if (expensesDiv) expensesDiv.style.display = "none";
        showLoginRegister();
      } else if (e.target.classList.contains("edit-button")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      }
    }
  });
};

  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        showExpenses();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        showExpenses();
      }
    });
  }

export const showExpenses = async () => {
  setDiv(expensesDiv);
  expensesTbody = document.getElementById("expenses-tbody");
  try {
    const res = await fetch(`/api/v1/expenses?page=${currentPage}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      message.textContent = data.msg || "Failed to load expenses.";
      return;
    }

    console.log("Fetched expenses:", data.expenses);
    totalPages = data.pages;
    document.getElementById("page-number").textContent = `Page ${data.page} of ${totalPages}`;
    renderExpenses(data.expenses);
  } catch (err) {
    console.error(err);
    message.textContent = "Server error.";
  }
};

const renderExpenses = (expenses) => {
  const tbody = document.getElementById("expenses-tbody");
  console.log("Rendering expenses:", expenses);

  if (!expensesTbody) {
    console.error("Table body (expenses-tbody) not found!");
    return;
  }

  expensesTbody.innerHTML = "";

  if (!expenses.length) {
    expensesTbody.innerHTML = "<tr><td colspan='8'>No expenses found</td></tr>";
    return;
  }

  expenses.forEach((expense) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${expense.title}</td>
      <td>${expense.amount}</td>
      <td>${
        expense.date ? new Date(expense.date).toLocaleDateString() : ""
      }</td>
      <td>${expense.mainCategory}</td>
      <td>${expense.subCategory}</td>
      <td>${expense.description || ""}</td> 
      <td><button class="edit-button" data-id="${
        expense._id
      }">Edit</button></td>
      <td><button class="delete-button" data-id="${
        expense._id
      }">Delete</button></td>
    `;
    expensesTbody.appendChild(row);
  });
};
