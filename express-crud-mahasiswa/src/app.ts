import express from "express";
import cors from "cors";
import path from "path";
import mahasiswaRoutes from "./routes/mahasiswa.route";
import prodiRoutes from "./routes/prodi.route";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

//middleware logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

//static folder buat foto upload
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "backend Express berjalan" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/prodi", prodiRoutes);
app.use("/api/mahasiswa", mahasiswaRoutes);

export default app;