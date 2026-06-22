import express from "express";
import cors from "cors";
import mahasiswaRoutes from "./routes/mahasiswa.route";
import mahasiswaDbRoutes from "./routes/mahasiswa-db.route";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Backend Express berjalan" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/profile", (req, res) => {
  res.json({ nama: "Zenith", role: "Mahasiswa", kampus: "Universitas Terbuka" });
});

app.get("/about", (req, res) => {
  res.json({ app: "Express CRUD Mahasiswa", versi: "1.0.0" });
});

app.use("/api/mahasiswa-array", mahasiswaRoutes);

app.use("/api/mahasiswa", mahasiswaDbRoutes);

export default app;