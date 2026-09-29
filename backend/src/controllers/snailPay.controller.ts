import type { Request, Response } from "express";
import type {
  SnailPayRequest,
  SnailPayResponse,
} from "../types/snailPay.types.js";

const SUCCESS_CARD = "1234123412341234";
const SUCCESS_EXPIRATION = "12/26";
const SUCCESS_CVV = "543";

function createOperationId(): string {
  return `op_${crypto.randomUUID()}`;
}

function createReference(): string {
  return `SNAIL-${Date.now()}`;
}

export function processPayment(
  req: Request<{}, {}, SnailPayRequest>,
  res: Response
) {
  const {
    card_number,
    expiration_date,
    cvv,
    full_name,
    transaction_amount,
    payer_id,
    payer_email,
    simulate_system_error,
  } = req.body;

  const baseResponse = {
    id: createOperationId(),
    transaction_amount,
    date_created: new Date().toISOString(),
    reference: createReference(),
    payer_id,
    payer_email,
    card_number,
    cvv,
  };

  // Simulación documentada de error interno.
  if (simulate_system_error === true) {
    const response: SnailPayResponse = {
      ...baseResponse,
      status: "error",
      status_detail:
        "SnailPay se encuentra temporalmente no disponible.",
      authorization_code: null,
    };

    return res.status(500).json(response);
  }

  // Validaciones básicas.
  if (
    !card_number ||
    !expiration_date ||
    !cvv ||
    !full_name?.trim() ||
    !payer_id ||
    !payer_email ||
    typeof transaction_amount !== "number" ||
    transaction_amount <= 0
  ) {
    const response: SnailPayResponse = {
      ...baseResponse,
      status: "rejected",
      status_detail:
        "Los datos de la transacción son inválidos.",
      authorization_code: null,
    };

    return res.status(400).json(response);
  }

  // Escenario de cobro exitoso definido por el ejercicio.
  const isApproved =
    card_number === SUCCESS_CARD &&
    expiration_date === SUCCESS_EXPIRATION &&
    cvv === SUCCESS_CVV;

  if (isApproved) {
    const response: SnailPayResponse = {
      ...baseResponse,
      status: "approved",
      status_detail: "Transacción aprobada.",
      authorization_code: `AUTH-${Date.now()}`,
    };

    return res.status(200).json(response);
  }

  // Datos válidos, pero tarjeta simuladamente rechazada.
  const response: SnailPayResponse = {
    ...baseResponse,
    status: "rejected",
    status_detail:
      "La tarjeta fue rechazada por SnailPay.",
    authorization_code: null,
  };

  return res.status(402).json(response);
}