import { useState, type FormEvent } from "react";
import { hashPassword } from "../utils/hashPassword";

interface LoginProps {
  onLogin: () => void;
  onGoToRegister: () => void;
}

interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  balance: number;
}

function Login({
  onLogin,
  onGoToRegister,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError(
        "Correo y contraseña son obligatorios."
      );
      return;
    }

    const storedUser =
      localStorage.getItem("snail_user");

    if (!storedUser) {
      setError("No existe un usuario registrado.");
      return;
    }

    let user: StoredUser;

    try {
      user = JSON.parse(storedUser);
    } catch {
      setError(
        "No fue posible leer la información del usuario."
      );
      return;
    }

    const passwordHash =
      await hashPassword(password);

    if (
      user.email !== email.trim().toLowerCase() ||
      user.passwordHash !== passwordHash
    ) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    localStorage.setItem("snail_session", "true");
    onLogin();
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">
          <div className="brand-logo">🐌</div>
          <span className="brand-name">SnailBet</span>
        </div>

        <h1>Bienvenido</h1>

        <p className="auth-subtitle">
          Inicia sesión para acceder a tu cuenta.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="loginEmail">
              Correo electrónico
            </label>

            <input
              id="loginEmail"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginPassword">
              Contraseña
            </label>

            <input
              id="loginPassword"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              placeholder="Tu contraseña"
            />
          </div>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button
            className="primary-button"
            type="submit"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes una cuenta?{" "}
          <button
            className="link-button"
            type="button"
            onClick={onGoToRegister}
          >
            Crear cuenta
          </button>
        </p>
      </section>
    </main>
  );
}

export default Login;