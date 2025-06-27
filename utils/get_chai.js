let chai_obj = null;

async function get_chai() {
  if (!chai_obj) {
    const chaiModule = await import("chai");
    const chaiHttpModule = await import("chai-http");

    const chai = chaiModule.default ?? chaiModule;
    const chaiHttp = chaiHttpModule.default ?? chaiHttpModule;

    chai.use(chaiHttp); 

    chai_obj = {
      expect: chai.expect,
      request: chaiHttp.request, 
    };
  }

  return chai_obj;
}

module.exports = get_chai;
