let activeDiv = null;

export const setDiv = (newDiv) => {
  console.log("Inside setDiv. Current activeDiv:", activeDiv);
  console.log("New div passed:", newDiv);

  if (activeDiv && activeDiv !== newDiv) {
    activeDiv.style.display = "none";
  }

  if (newDiv) {
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};

export let token = null;
export const setToken = (value) => {
  if (!value || value === "null") {
    token = null;
    localStorage.removeItem("token");
  } else {
    token = value;
    localStorage.setItem("token", value);
  }
};

export let message = null;

import { showExpenses, handleExpenses } from "./expenses.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit , showAddEdit} from "./addEdit.js";
import { handleRegister } from "./register.js";

document.addEventListener("DOMContentLoaded", () => {
  const storedToken = localStorage.getItem("token");
  if (storedToken && storedToken !== "null") {
    setToken(storedToken);
  } else {
    setToken(null);
  }
  message = document.getElementById("message");
  handleLoginRegister();
  handleLogin();
  handleExpenses();
  handleRegister();
  handleAddEdit();

  if (token) {
    showExpenses();
  } else {
    showLoginRegister();
  }
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-button")) {
    const id = e.target.dataset.id;
    const token = localStorage.getItem("token");
    if (!id || !token) return;

    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        const res = await fetch(`/api/v1/expenses/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          document.getElementById("message").textContent =
            "Expense deleted successfully.";
          await showExpenses();
        } else {
          const data = await res.json();
          document.getElementById("message").textContent =
            data.msg || "Delete failed.";
        }
      } catch (err) {
        console.error(err);
        document.getElementById("message").textContent = "An error occurred.";
      }
    }
  } else if (e.target.id === "add-expense") {
     await showAddEdit(); 
  } else if (e.target.id === "logoff") {
    setToken(null);
    if (message) {
      message.textContent = "You have been logged off.";
    }

    const expensesTable = document.getElementById("expenses-table");
    const expensesTableHeader = document.getElementById(
      "expenses-table-header"
    );
    if (expensesTable && expensesTableHeader) {
      expensesTable.replaceChildren(expensesTableHeader);
    }

    showLoginRegister();
  }
});
