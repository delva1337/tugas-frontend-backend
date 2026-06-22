import { Router, Request, Response } from "express";
import pool from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM mahasiswa ORDER BY id ASC");
    res.json({ message: "Data mahasiswa berhasil diambil", data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data mahasiswa" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM mahasiswa WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
      return;
    }
    res.json({ message: "Detail mahasiswa", data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil detail mahasiswa" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { nim, nama, prodi, angkatan } = req.body;

    if (!nim || !nama || !prodi || !angkatan) {
      res.status(400).json({ message: "Semua field wajib diisi" });
      return;
    }
    if (nama.length < 3) {
      res.status(400).json({ message: "Nama minimal 3 karakter" });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO mahasiswa (nim, nama, prodi, angkatan) VALUES (?, ?, ?, ?)",
      [nim, nama, prodi, angkatan]
    );

    res.status(201).json({
      message: "Data mahasiswa berhasil ditambahkan",
      data: { id: result.insertId, nim, nama, prodi, angkatan },
    });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "NIM sudah terdaftar" });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "Gagal menambah data mahasiswa" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { nim, nama, prodi, angkatan } = req.body;

    if (!nim || !nama || !prodi || !angkatan) {
      res.status(400).json({ message: "Semua field wajib diisi" });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE mahasiswa SET nim = ?, nama = ?, prodi = ?, angkatan = ? WHERE id = ?",
      [nim, nama, prodi, angkatan, req.params.id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
      return;
    }

    res.json({ message: "Data mahasiswa berhasil diperbarui" });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "NIM sudah terdaftar" });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui data mahasiswa" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM mahasiswa WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
      return;
    }

    res.json({ message: "Data mahasiswa berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus data mahasiswa" });
  }
});

export default router;