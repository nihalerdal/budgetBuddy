const puppeteer = require("puppeteer");
require("../app");
const { seed_db, testUserPassword } = require("../utils/seed_db");
const Expense = require("../models/Expense");

let testUser = null;
let browser = null;
let page = null;

describe("expense-ejs puppeteer test", function () {
  this.timeout(30000);

  before(async function () {
    this.timeout(10000);
    browser = await puppeteer.launch({
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });

  after(async function () {
    this.timeout(5000);
    await browser.close();
  });

  describe("go to site", function () {
    it("should have completed a connection", async function () {
    });
  });

  describe("index page test", function () {
    this.timeout(10000);

    it("finds the index page logon link", async function () {
      this.logonLink = await page.waitForSelector(
        "a ::-p-text(Click this link to logon)"
      );
    });

    it("gets to the logon page", async function () {
      await this.logonLink.click();
      await page.waitForNavigation();
      await page.waitForSelector('input[name="email"]');
    });
  });

  describe("logon page test", function () {
    this.timeout(20000);

    it("resolves all the fields", async function () {
      this.email = await page.waitForSelector('input[name="email"]');
      this.password = await page.waitForSelector('input[name="password"]');
      this.submit = await page.waitForSelector("button ::-p-text(Logon)");
    });

    it("sends the logon", async function () {
      testUser = await seed_db();
      await this.email.type(testUser.email);
      await this.password.type(testUserPassword);
      await this.submit.click();
      await page.waitForNavigation();

      await page.waitForSelector(`p ::-p-text(${testUser.name} is logged on.)`);
      await page.waitForSelector("a ::-p-text(change the secret)");
      await page.waitForSelector('a[href="/secretWord"]');

      const copyr = await page.waitForSelector("p ::-p-text(copyright)");
      const copyrText = await copyr.evaluate((el) => el.textContent);
      console.log("copyright text:", copyrText);
    });
  });

  // --- Expense CRUD tests ---
  describe("puppeteer expense operations", function () {
    this.timeout(30000);

    it("should show 20 expense entries on the list page", async function () {

      const expensesLink = await page.waitForSelector(
        "a ::-p-text(Expenses List)"
      );
      await expensesLink.click();
      await page.waitForNavigation();

      const html = await page.content();
      const rows = html.split("<tr>");
      expect(rows.length).to.equal(21); 
    });

    it("should open the add expense form", async function () {
      const addExpenseBtn = await page.waitForSelector(
        "a ::-p-text(Add An Expense)"
      );
      await addExpenseBtn.click();
      await page.waitForNavigation();

      this.titleInput = await page.waitForSelector('input[name="title"]');
      this.amountInput = await page.waitForSelector('input[name="amount"]');
      this.mainCategoryInput = await page.waitForSelector(
        'input[name="mainCategory"]'
      );
      this.subCategoryInput = await page.waitForSelector(
        'input[name="subCategory"]'
      );
      this.submitBtn = await page.waitForSelector(
        "button ::-p-text(Add Expense)"
      );

  
      const { expect } = require("chai");
      expect(this.titleInput).to.not.be.null;
      expect(this.amountInput).to.not.be.null;
      expect(this.mainCategoryInput).to.not.be.null;
      expect(this.subCategoryInput).to.not.be.null;
      expect(this.submitBtn).to.not.be.null;
    });

    it("should add a new expense and confirm it in the list and DB", async function () {
      const { expect } = require("chai");
      const title = "Test Expense " + Math.floor(Math.random() * 10000);
      const amount = (Math.random() * 1000).toFixed(2);
      const mainCategory = "Food";
      const subCategory = "Groceries";

      await this.titleInput.type(title);
      await this.amountInput.type(amount);
      await this.mainCategoryInput.type(mainCategory);
      await this.subCategoryInput.type(subCategory);
      await this.submitBtn.click();

      await page.waitForNavigation();

      const bodyText = await page.evaluate(() => document.body.innerText);
      expect(bodyText).to.include("Expense added"); 

      // DB 
      const expenses = await Expense.find({ title });
      expect(expenses.length).to.equal(1);
      expect(expenses[0].amount.toFixed(2)).to.equal(amount);
    });
  });
});
