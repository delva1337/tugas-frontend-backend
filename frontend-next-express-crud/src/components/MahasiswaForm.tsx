"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Mahasiswa, MahasiswaInput, Prodi } from "@/lib/api";

type Props = {
  selectedMahasiswa: Mahasiswa | null;
  prodiList: Prodi[];
  onSubmit: (payload: MahasiswaInput, foto: File | null) => Promise<void>;
  onCancelEdit: () => void;
};

const initialForm: MahasiswaInput = {
  nim: "",
  nama: "",
  prodi_id: 0,
  angkatan: new Date().getFullYear(),
};

export default function MahasiswaForm({
  selectedMahasiswa,
  prodiList,
  onSubmit,
  onCancelEdit,
}: Props) {
  const [form, setForm] = useState<MahasiswaInput>(initialForm);
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({
        nim: selectedMahasiswa.nim,
        nama: selectedMahasiswa.nama,
        prodi_id: selectedMahasiswa.prodi_id,
        angkatan: selectedMahasiswa.angkatan,
      });
    } else {
      setForm(initialForm);
    }
    setFoto(null);
    if (fileRef.current) fileRef.current.value = "";
  }, [selectedMahasiswa]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await onSubmit(form, foto);
      setForm(initialForm);
      setFoto(null);
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>{selectedMahasiswa ? "✏️ Edit Mahasiswa" : "➕ Tambah Mahasiswa"}</h2>

      <div className="grid">
        <div className="form-group">
          <label htmlFor="nim">NIM</label>
          <input
            id="nim"
            value={form.nim}
            onChange={(e) => setForm({ ...form, nim: e.target.value })}
            placeholder="Contoh: 2201001"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nama">Nama</label>
          <input
            id="nama"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            placeholder="Nama mahasiswa"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="prodi">Prodi</label>
          <select
            id="prodi"
            value={form.prodi_id}
            onChange={(e) => setForm({ ...form, prodi_id: Number(e.target.value) })}
            required
          >
            <option value={0} disabled>
              -- Pilih Prodi --
            </option>
            {prodiList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama_prodi}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="angkatan">Angkatan</label>
          <input
            id="angkatan"
            type="number"
            value={form.angkatan}
            onChange={(e) => setForm({ ...form, angkatan: Number(e.target.value) })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="foto">Foto (JPG/PNG/WEBP, maks 2MB)</label>
          <input
            id="foto"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            ref={fileRef}
            onChange={(e) => setFoto(e.target.files?.[0] || null)}
          />
        </div>
      </div>

      <div className="actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Menyimpan..." : selectedMahasiswa ? "Update" : "Simpan"}
        </button>

        {selectedMahasiswa && (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Batal Edit
          </button>
        )}
      </div>
    </form>
  );
}