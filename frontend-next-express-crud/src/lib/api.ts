const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export type Prodi = {
  id: number;
  nama_prodi: string;
};

export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi_id: number;
  nama_prodi: string;
  angkatan: number;
  foto?: string | null;
};

export type MahasiswaInput = {
  nim: string;
  nama: string;
  prodi_id: number;
  angkatan: number;
};

export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

// ===prodi ===

export async function getProdi(): Promise<Prodi[]> {
  const response = await fetch(`${API_URL}/prodi`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data;
}

// === mahasiswa ===

export async function getMahasiswa(params: {
  search?: string;
  prodi_id?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Mahasiswa[]; meta: Meta }> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.prodi_id) query.set("prodi_id", params.prodi_id);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const response = await fetch(`${API_URL}/mahasiswa?${query.toString()}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

export async function createMahasiswa(formData: FormData) {
  const response = await fetch(`${API_URL}/mahasiswa`, {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

export async function updateMahasiswa(id: number, formData: FormData) {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "PUT",
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}

export async function deleteMahasiswa(id: number) {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "DELETE",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}