const express = require("express");
const router = express.Router();

const {
  getAllExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenses.js");

router.route("/").get(getAllExpenses).post(createExpense);
router.route("/:id").get(getExpense).delete(deleteExpense).patch(updateExpense);

module.exports = router;
