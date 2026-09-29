import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";

describe("SnailPay API", () => {

  it("GET /api/health debe responder correctamente", async () => {
    const response = await request(app)
      .get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("debe aprobar una transacción con las credenciales correctas", async () => {
    const response = await request(app)
      .post("/api/snailpay/charge")
      .send({
        card_number: "1234123412341234",
        expiration_date: "12/26",
        cvv: "543",
        full_name: "Diego Rodriguez",
        transaction_amount: 500,
        payer_id: "user-test-001",
        payer_email: "prueba@correo.com"
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("approved");
    expect(response.body.transaction_amount).toBe(500);
    expect(response.body.authorization_code).toBeDefined();
    expect(response.body.reference).toBeDefined();
  });

  it("debe rechazar una tarjeta incorrecta", async () => {
    const response = await request(app)
      .post("/api/snailpay/charge")
      .send({
        card_number: "1111111111111111",
        expiration_date: "12/26",
        cvv: "543",
        full_name: "Diego Rodriguez",
        transaction_amount: 500,
        payer_id: "user-test-001",
        payer_email: "prueba@correo.com"
      });

    expect(response.status).not.toBe(200);
    expect(response.body.status).toBe("rejected");
  });

});