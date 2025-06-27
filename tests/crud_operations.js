const { app } = require("../app");
const Expense = require("../models/Expense");
const { seed_db, testUserPassword } = require("../util/seed_db");
const get_chai = require("../util/get_chai");
const { factory } = require("../util/seed_db");

describe("Expense CRUD operations", function () {
  before(async function () {
    const { expect, request } = await get_chai();

    this.test_user = await seed_db();


    let req = request.execute(app).get("/session/logon").send();
    let res = await req;

    const textNoLineEnd = res.text.replaceAll("\n", "");
    this.csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd)[1];

    let cookies = res.headers["set-cookie"];
    this.csrfCookie = cookies.find((element) =>
      element.startsWith("csrfToken")
    );


    const dataToPost = {
      email: this.test_user.email,
      password: testUserPassword,
      _csrf: this.csrfToken,
    };

    req = request
      .execute(app)
      .post("/session/logon")
      .set("Cookie", this.csrfCookie)
      .set("content-type", "application/x-www-form-urlencoded")
      .redirects(0)
      .send(dataToPost);

    res = await req;

    cookies = res.headers["set-cookie"];
    this.sessionCookie = cookies.find((element) =>
      element.startsWith("connect.sid")
    );

    expect(this.csrfToken).to.not.be.undefined;
    expect(this.sessionCookie).to.not.be.undefined;
    expect(this.csrfCookie).to.not.be.undefined;
  });

  it("should get the expense list with 20 expenses", async function () {
    const { expect, request } = await get_chai();

    const req = request
      .execute(app)
      .get("/expenses") 
      .set("Cookie", this.sessionCookie)
      .send();

    const res = await req;

    expect(res).to.have.status(200);

    const pageParts = res.text.split("<tr>");
    expect(pageParts.length).to.equal(21);

  });

  it("should add a new expense", async function () {
    const { expect, request } = await get_chai();


    const newExpense = await factory.build("expense");

    const dataToPost = {
      description: newExpense.description,
      amount: newExpense.amount,
      category: newExpense.category,
      date: newExpense.date.toISOString().slice(0, 10), 
      _csrf: this.csrfToken,
    };

    const req = request
      .execute(app)
      .post("/expenses") 
      .set("Cookie", this.csrfCookie + ";" + this.sessionCookie)
      .set("content-type", "application/x-www-form-urlencoded")
      .send(dataToPost);

    const res = await req;

    expect(res).to.have.status(302); 


    const expenses = await Expense.find({ createdBy: this.test_user._id });
    expect(expenses.length).to.equal(21);
  });
});
