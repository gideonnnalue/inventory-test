import app from "../src/app";
import request from "supertest";
import moment from "moment";
import db from "../src/database/models";

afterAll((done) => {
  db.sequelize.close();
  done();
});

describe("Inventory user test", () => {
  let startTime = 0;

  beforeAll(()=> {
    startTime = moment().unix()
  });


  it("Should add 10 items to inventory", async (done) => {
    try {
      const result = await request(app)
        .post("/item/foo/add")
        .send({
          quantity: 10,
          expiry: startTime + 10000,
        });
      expect(result.status).toEqual(201);

      done();
    } catch (err) {
      done(err);
    }
  });

  it("Should have 10 items left", async (done) => {
    try {
      const result = await request(app).get("/item/foo/quantity");
      expect(result.status).toEqual(200);
      expect(result.body.data).toEqual({
        quantity: 10,
        validTill: startTime + 10000
      })
      console.log(result.body);
      done();
    } catch (err) {
      done(err);
    }
  });

  it("Should sell 7 items from inventory", async (done) => {
    try {
      const result = await request(app).post("/item/foo/sell").send({
        quantity: 7
      });
      expect(result.status).toEqual(200);
      done();
    } catch (err) {
      done(err);
    }
  });

  it("Should have 3 items left", async (done) => {
    try {
      const result = await request(app).get("/item/foo/quantity");
      expect(result.status).toEqual(200);
      expect(result.body.data).toEqual({
        quantity: 3,
        validTill: startTime + 10000
      })
      console.log(result.body);
      done();
    } catch (err) {
      done(err);
    }
  });

  it("Should fail to sell 4 items", async (done) => {
    expect.assertions(1);
    try {
      const result = await request(app).post("/item/foo/sell").send({
        quantity: 4
      });
      expect(result.status).toEqual(400);
      done();
    } catch (err) {
      done(err);
    }
  });
});
