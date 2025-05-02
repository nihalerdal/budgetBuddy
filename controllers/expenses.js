const getAllExpenses = async (req, res) => {
  res.send("get all expenses");
};
const getExpense = async (req, res) => {
  res.send("get an expense");
};
const createExpense = async (req, res) => {
  res.json(req.user);
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
