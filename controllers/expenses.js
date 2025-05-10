const Expense = require("../models/Expense");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllExpenses = async (req, res) => {
  const expenses = await Expense.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ expenses, count: expenses.length });
};

const getExpense = async (req, res) => {
  res.send("get an expense");
};
const createExpense = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.userId;
    const expense = await Expense.create(req.body);
    res.status(StatusCodes.CREATED).json({ expense });
  } catch {
    next(error);
  }
};
const updateExpense = async (req, res) => {
  res.send("update expense");
};
const deleteExpense = async (req, res) => {
  res.send("delete expense");
};

module.exports = {
  getAllExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
};
