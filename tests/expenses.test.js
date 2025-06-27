const app = require("../app");
const get_chai = require("../utils/get_chai");

describe("Expenses API", () => {
  it("should return 401 if not authenticated", async () => {
    const { expect, request } = await get_chai();

    const res = await request(app).get("/api/v1/expenses");

    expect(res).to.have.status(401);
    expect(res.body).to.have.property("msg");
  });
});
