"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MahasiswaForm from "@/components/MahasiswaForm";
import MahasiswaTable from "@/components/MahasiswaTable";
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswa,
  getProdi,
  Mahasiswa,
  MahasiswaInput,
  Prodi,
  updateMahasiswa,
} from "@/lib/api";

export default function MahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  //search, filter, pagination
  const [search, setSearch] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const loadProdi = async () => {
    try {
      const data = await getProdi();
      setProdiList(data);
    } catch (err) {
      console.error("Gagal memuat prodi", err);
    }
  };

  const loadMahasiswa = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getMahasiswa({
        search,
        prodi_id: prodiId,
        page,
        limit,
      });
      setMahasiswa(result.data);
      setTotalPage(result.meta.totalPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProdi();
  }, []);

  useEffect(() => {
    loadMahasiswa();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    loadMahasiswa();
  };

  const handleSubmit = async (payload: MahasiswaInput, foto: File | null) => {
    try {
      setMessage("");
      setError("");

      const formData = new FormData();
      formData.append("nim", payload.nim);
      formData.append("nama", payload.nama);
      formData.append("prodi_id", String(payload.prodi_id));
      formData.append("angkatan", String(payload.angkatan));
      if (foto) formData.append("foto", foto);

      if (selectedMahasiswa) {
        await updateMahasiswa(selectedMahasiswa.id, formData);
        setMessage("d mahasiswa berhasil diperbarui");
      } else {
        await createMahasiswa(formData);
        setMessage("data mahasiswa berhasil ditambahkan");
      }

      setSelectedMahasiswa(null);
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "gagal menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("yakin ingin menghapus data ini?");
    if (!confirmed) return;

    try {
      setMessage("");
      setError("");
      await deleteMahasiswa(id);
      setMessage("data mahasiswa berhasil dihapus");
      await loadMahasiswa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
    }
  };

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>CRUD Data Mahasiswa</h1>
          <p>frontend next.js terhubung ke backend express.js</p>
        </div>
        <Link href="/">
          <button className="btn-secondary">← kembali</button>
        </Link>
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <MahasiswaForm
        selectedMahasiswa={selectedMahasiswa}
        prodiList={prodiList}
        onSubmit={handleSubmit}
        onCancelEdit={() => setSelectedMahasiswa(null)}
      />

      <section className="card" style={{ marginTop: 20 }}>
        <h2>daftar mahasiswa</h2>

        <div className="search-bar">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari NIM atau nama..."
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <select value={prodiId} onChange={(e) => setProdiId(e.target.value)}>
            <option value="">Semua Prodi</option>
            {prodiList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama_prodi}
              </option>
            ))}
          </select>

          <button className="btn-primary" onClick={handleSearch}>
            Cari
          </button>
        </div>

        {loading ? (
          <p>memuat data...</p>
        ) : (
          <>
            <MahasiswaTable
              mahasiswa={mahasiswa}
              onEdit={setSelectedMahasiswa}
              onDelete={handleDelete}
            />

            <div className="pagination">
              <button
                className="btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                ← prev
              </button>
              <span>
                Halaman {page} dari {totalPage || 1}
              </span>
              <button
                className="btn-secondary"
                disabled={page >= totalPage}
                onClick={() => setPage(page + 1)}
              >
                next →
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}