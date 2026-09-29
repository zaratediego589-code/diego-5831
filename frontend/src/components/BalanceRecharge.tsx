import {
  useState,
  type FormEvent,
} from "react";

interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  balance: number;
}

interface BalanceRechargeProps {
  user: StoredUser;
  onSuccess: (newBalance: number) => void;
  onCancel: () => void;
}

interface SnailPayResponse {
  id: string;
  status: "approved" | "rejected" | "error";
  status_detail: string;
  transaction_amount: number;
  date_created: string;
  authorization_code: string | null;
  reference: string;
  payer_id: string;
  payer_email: string;
  card_number: string;
  cvv: string;
}

function BalanceRecharge({
  user,
  onSuccess,
  onCancel,
}: BalanceRechargeProps) {
  const [cardNumber, setCardNumber] =
    useState("");

  const [expirationDate, setExpirationDate] =
    useState("");

  const [cvv, setCvv] = useState("");

  const [fullName, setFullName] =
    useState(user.fullName);

  const [amount, setAmount] = useState("");

  const [message, setMessage] = useState("");

  const [isError, setIsError] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    simulateSystemError,
    setSimulateSystemError,
  ] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setIsError(false);

    const numericAmount = Number(amount);

    if (
      !cardNumber.trim() ||
      !expirationDate.trim() ||
      !cvv.trim() ||
      !fullName.trim() ||
      !amount
    ) {
      setIsError(true);
      setMessage(
        "Todos los campos son obligatorios."
      );
      return;
    }

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setIsError(true);
      setMessage(
        "El monto debe ser mayor que cero."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/snailpay/charge",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            card_number: cardNumber.trim(),
            expiration_date:
              expirationDate.trim(),
            cvv: cvv.trim(),
            full_name: fullName.trim(),
            transaction_amount:
              numericAmount,
            payer_id: user.id,
            payer_email: user.email,
            simulate_system_error:
              simulateSystemError,
          }),
        }
      );

      const data: SnailPayResponse =
        await response.json();

      localStorage.setItem(
        "snail_last_payment",
        JSON.stringify({
          card_number: data.card_number,
          cvv: data.cvv,
          reference: data.reference,
          status: data.status,
        })
      );

      if (
        !response.ok ||
        data.status !== "approved"
      ) {
        setIsError(true);
        setMessage(data.status_detail);
        return;
      }

      const newBalance =
        user.balance +
        data.transaction_amount;

      const updatedUser: StoredUser = {
        ...user,
        balance: newBalance,
      };

      localStorage.setItem(
        "snail_user",
        JSON.stringify(updatedUser)
      );

      onSuccess(newBalance);
    } catch {
      setIsError(true);

      setMessage(
        "No fue posible conectar con SnailPay."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <section className="recharge-modal">
        <h2>Cargar saldo</h2>

        <p className="recharge-description">
          Procesa una recarga utilizando SnailPay.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cardNumber">
              Número de tarjeta
            </label>

            <input
              id="cardNumber"
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={(event) =>
                setCardNumber(
                  event.target.value
                )
              }
              placeholder="1234123412341234"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expirationDate">
                Vencimiento
              </label>

              <input
                id="expirationDate"
                type="text"
                value={expirationDate}
                onChange={(event) =>
                  setExpirationDate(
                    event.target.value
                  )
                }
                placeholder="12/26"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cvv">
                CVV
              </label>

              <input
                id="cvv"
                type="password"
                inputMode="numeric"
                value={cvv}
                onChange={(event) =>
                  setCvv(event.target.value)
                }
                placeholder="543"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="paymentName">
              Nombre completo
            </label>

            <input
              id="paymentName"
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(
                  event.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">
              Monto a cargar
            </label>

            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              placeholder="500.00"
            />
          </div>

          <label className="test-option">
            <input
              type="checkbox"
              checked={simulateSystemError}
              onChange={(event) =>
                setSimulateSystemError(
                  event.target.checked
                )
              }
            />

            Simular error interno de SnailPay
          </label>

          {message && (
            <p
              className={`payment-message ${
                isError ? "error" : ""
              }`}
              role="alert"
            >
              {message}
            </p>
          )}

          <div className="modal-actions">
            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Procesando..."
                : "Confirmar recarga"}
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default BalanceRecharge;