import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import BalanceRecharge from "../components/BalanceRecharge";

interface DashboardProps {
  onLogout: () => void;
}

interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  balance: number;
}

const betData = [
  { name: "Ganadas", value: 8 },
  { name: "Perdidas", value: 4 },
];

const snailData = [
  { name: "Turbo", victories: 2 },
  { name: "Rayo", victories: 1 },
  { name: "Luna", victories: 1 },
  { name: "Flash", victories: 1 },
  { name: "Shelly", victories: 1 },
  { name: "Rocky", victories: 0 },
];

const COLORS = ["#22c55e", "#ef4444"];

function Dashboard({ onLogout }: DashboardProps) {
  const storedUser = localStorage.getItem("snail_user");

  let initialUser: StoredUser | null = null;

  if (storedUser) {
    try {
      initialUser = JSON.parse(storedUser);
    } catch {
      initialUser = null;
    }
  }

  const [user, setUser] =
    useState<StoredUser | null>(initialUser);

  const [showRecharge, setShowRecharge] =
    useState(false);

  const handleLogout = () => {
    localStorage.removeItem("snail_session");
    onLogout();
  };

  const handleRechargeSuccess = (
    newBalance: number
  ) => {
    if (!user) return;

    setUser({
      ...user,
      balance: newBalance,
    });
  };

  if (!user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <h1>Error</h1>

          <p className="auth-subtitle">
            No fue posible cargar la información del usuario.
          </p>

          <button
            className="primary-button"
            onClick={handleLogout}
          >
            Volver al inicio
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-brand">
            <div className="dashboard-brand-logo">
              🐌
            </div>

            <div>
              <strong>SnailBet</strong>
              <span>Panel de apuestas</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="welcome">
          <p>Panel principal</p>
          <h1>Hola, {user.fullName}</h1>
        </section>

        <section className="balance-card">
          <p className="balance-label">
            Saldo disponible
          </p>

          <p className="balance-amount">
            ${user.balance.toFixed(2)}
          </p>

          <button
            className="recharge-button"
            type="button"
            onClick={() => setShowRecharge(true)}
          >
            + Cargar saldo
          </button>
        </section>

        <section>
          <h2 className="section-title">
            Resumen del día
          </h2>

          <div className="charts-grid">
            <article className="chart-card">
              <h3>Apuestas</h3>

              <p className="chart-description">
                Resultados simulados de tus apuestas.
              </p>

              <div className="chart-container">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={betData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={4}
                    >
                      {betData.map(
                        (_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              COLORS[
                                index % COLORS.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="chart-card">
              <h3>Victorias por caracol</h3>

              <p className="chart-description">
                Resultados de las seis carreras
                simuladas del día.
              </p>

              <div className="chart-container">
                <ResponsiveContainer>
                  <BarChart data={snailData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />

                    <Bar
                      dataKey="victories"
                      name="Victorias"
                      fill="#6366f1"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>
        </section>
      </div>

      {showRecharge && (
        <BalanceRecharge
          user={user}
          onSuccess={(newBalance) => {
            handleRechargeSuccess(newBalance);
            setShowRecharge(false);
          }}
          onCancel={() => setShowRecharge(false)}
        />
      )}
    </main>
  );
}

export default Dashboard;