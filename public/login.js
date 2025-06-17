import {
  inputEnabled,
  setDiv,
  token,
  message,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { handleExpenses, showExpenses } from "./expenses.js";

let loginDiv = null;
let email = null;
let password = null;

export const handleLogin = () => {
  loginDiv = document.getElementById("logon-div");
  email = document.getElementById("email");
  password = document.getElementById("password");
  const logonButton = document.getElementById("logon-button");
  const logonCancel = document.getElementById("logon-cancel");
  const logoff = document.getElementById("logoff");
  const expensesTable = document.getElementById("expenses-table");
  const expensesTableHeader = document.getElementById("expenses-table-header");

  loginDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === logonButton) {
        if (!inputEnabled) return;
        enableInput(false);

        try {
          const response = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email.value,
              password: password.value,
            }),
          });

          const data = await response.json();
          const introSection = document.getElementById("intro-section");
          if (response.status === 200) {
            if (message) {
              message.textContent = `Logon successful. Welcome ${data.user.name}`;
            }
            setToken(data.token);

            email.value = "";
            password.value = "";
             showExpenses();
           
            if (introSection) {
              introSection.style.display = "none";
            }
          } else {
            if (message) {
              message.textContent = data.msg;
            }
          }
        } catch (err) {
          console.error(err);
          if (message) {
            message.textContent = "A communications error occurred.";
          }
        }

        enableInput(true);
      } else if (e.target === logonCancel) {
        email.value = "";
        password.value = "";
        showLoginRegister();
      }
    }
  });
};

export const showLogin = () => {
  email.value = null;
  password.value = null;
  const introSection = document.getElementById("intro-section");
  if (introSection) {
    introSection.style.display = "none";
  }
  setDiv(loginDiv);
};
