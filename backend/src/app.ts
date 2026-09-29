import express from "express";
import cors from "cors";
import snailPayRoutes from "./routes/snailPay.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API funcionando correctamente",
  });
});

app.use("/api/snailpay", snailPayRoutes);

export default app;