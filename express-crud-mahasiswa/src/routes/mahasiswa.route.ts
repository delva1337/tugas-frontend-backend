import { Router, Request, Response } from "express";
import { getAll, getById, create, update, remove, searchByName, isNimDuplicate } from "../data/mahasiswa.data";

const router = Router();

//GET semua
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Data mahasiswa (array)", data: getAll() });
});

//cari berdasarkan nama
router.get("/search/:keyword", (req: Request, res: Response) => {
  const result = searchByName(req.params.keyword as string);
  res.json({ message: `Hasil pencarian: ${result.length} data`, data: result });
});

//detail
router.get("/:id", (req: Request, res: Response) => {
  const mahasiswa = getById(Number(req.params.id));
  if (!mahasiswa) {
    res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    return;
  }
  res.json({ message: "Detail mahasiswa", data: mahasiswa });
});

// tambah
router.post("/", (req: Request, res: Response) => {
  const { nim, nama, prodi, angkatan } = req.body;

  if (!nim || !nama || !prodi || !angkatan) {
    res.status(400).json({ message: "Semua field wajib diisi" });
    return;
  }
  if (nama.length < 3) {
    res.status(400).json({ message: "Nama minimal 3 karakter" });
    return;
  }
  if (isNimDuplicate(nim)) {
    res.status(400).json({ message: "NIM sudah terdaftar" });
    return;
  }

  const newMahasiswa = create({ nim, nama, prodi, angkatan });
  res.status(201).json({ message: "Mahasiswa berhasil ditambahkan", data: newMahasiswa });
});

// update
router.put("/:id", (req: Request, res: Response) => {
  const { nim, nama, prodi, angkatan } = req.body;

  if (!nim || !nama || !prodi || !angkatan) {
    res.status(400).json({ message: "Semua field wajib diisi" });
    return;
  }

  const updated = update(Number(req.params.id), { nim, nama, prodi, angkatan });
  if (!updated) {
    res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    return;
  }
  res.json({ message: "Mahasiswa berhasil diperbarui", data: updated });
});

//delete 
router.delete("/:id", (req: Request, res: Response) => {
  const deleted = remove(Number(req.params.id));
  if (!deleted) {
    res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
    return;
  }
  res.json({ message: "Mahasiswa berhasil dihapus" });
});

export default router;