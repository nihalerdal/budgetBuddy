const Expense = require("../models/Expense");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllExpenses = async (req, res) => {
  res.send("get all expenses");
};
const getExpense = async (req, res) => {
  res.send("get an expense");
};
const createExpense = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const expense = await Expense.create(req.body);
  res.status(StatusCodes.CREATED).json({ expense });
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
