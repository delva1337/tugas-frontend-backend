export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
};

let mahasiswaList: Mahasiswa[] = [
  { id: 1, nim: "2201001", nama: "Ahmad Fauzi", prodi: "Informatika", angkatan: 2022 },
  { id: 2, nim: "2201002", nama: "Siti Nurhaliza", prodi: "Sistem Informasi", angkatan: 2022 },
  { id: 3, nim: "2201003", nama: "Budi Santoso", prodi: "Teknik Komputer", angkatan: 2023 },
];

let nextId = 4;

export function getAll(): Mahasiswa[] {
  return mahasiswaList;
}

export function getById(id: number): Mahasiswa | undefined {
  return mahasiswaList.find((m) => m.id === id);
}

export function create(data: Omit<Mahasiswa, "id">): Mahasiswa {
  const newMahasiswa: Mahasiswa = { id: nextId++, ...data };
  mahasiswaList.push(newMahasiswa);
  return newMahasiswa;
}

export function update(id: number, data: Omit<Mahasiswa, "id">): Mahasiswa | null {
  const index = mahasiswaList.findIndex((m) => m.id === id);
  if (index === -1) return null;
  mahasiswaList[index] = { id, ...data };
  return mahasiswaList[index];
}

export function remove(id: number): boolean {
  const index = mahasiswaList.findIndex((m) => m.id === id);
  if (index === -1) return false;
  mahasiswaList.splice(index, 1);
  return true;
}

export function searchByName(keyword: string): Mahasiswa[] {
  return mahasiswaList.filter((m) =>
    m.nama.toLowerCase().includes(keyword.toLowerCase())
  );
}

export function isNimDuplicate(nim: string): boolean {
  return mahasiswaList.some((m) => m.nim === nim);
}