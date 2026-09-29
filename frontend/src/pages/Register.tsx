import { useState, type FormEvent } from "react";
import { hashPassword } from "../utils/hashPassword";

interface RegisterProps {
  onRegister: () => void;
  onGoToLogin: () => void;
}

function Register({
  onRegister,
  onGoToLogin,
}: RegisterProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!email.includes("@")) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    if (password.length < 8) {
      setError(
        "La contraseña debe tener al menos 8 caracteres."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const passwordHash = await hashPassword(password);

    const user = {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      balance: 0,
    };

    localStorage.setItem(
      "snail_user",
      JSON.stringify(user)
    );

    localStorage.setItem("snail_session", "true");

    onRegister();
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">
          <div className="brand-logo">🐌</div>
          <span className="brand-name">SnailBet</span>
        </div>

        <h1>Crear cuenta</h1>

        <p className="auth-subtitle">
          Regístrate para comenzar a utilizar la plataforma.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">
              Nombre completo
            </label>

            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              autoComplete="name"
              placeholder="Diego Rodriguez"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              id="email"
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
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirmar contraseña
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              autoComplete="new-password"
              placeholder="Repite tu contraseña"
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
            Crear cuenta
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes una cuenta?{" "}
          <button
            className="link-button"
            type="button"
            onClick={onGoToLogin}
          >
            Iniciar sesión
          </button>
        </p>
      </section>
    </main>
  );
}

export default Register;