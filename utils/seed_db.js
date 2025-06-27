const Expense = require("../models/Expense"); 
const User = require("../models/User");
const faker = require("@faker-js/faker").fakerEN_US;
const FactoryBot = require("factory-bot");
require("dotenv").config();

const testUserPassword = faker.internet.password();
const factory = FactoryBot.factory;
const factoryAdapter = new FactoryBot.MongooseAdapter();
factory.setAdapter(factoryAdapter);

factory.define("expense", Expense, {
  description: () => faker.commerce.productName(),
  amount: () => parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
  category: () => faker.commerce.department(),
  date: () => faker.date.recent({ days: 30 }),
});


factory.define("user", User, {
  name: () => faker.person.fullName(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
});

const seed_db = async () => {
  let testUser = null;
  try {
    const mongoURL = process.env.MONGO_URI_TEST;
    const mongoose = require("mongoose");
    await mongoose.connect(mongoURL);

    await Expense.deleteMany({}); 
    await User.deleteMany({});

    testUser = await factory.create("user", { password: testUserPassword });

    await factory.createMany("expense", 20, { createdBy: testUser._id });

    await mongoose.disconnect();
  } catch (e) {
    console.log("database error");
    console.log(e.message);
    throw e;
  }
  return testUser;
};

module.exports = { testUserPassword, factory, seed_db };
