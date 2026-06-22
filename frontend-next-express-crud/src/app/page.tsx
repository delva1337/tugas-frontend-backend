import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container">
      <div className="card" style={{ textAlign: "center", padding: "48px 20px" }}>
        <h1>Sistem Data Mahasiswa - Muhammad Delva</h1>
        <p style={{ marginBottom: 24, color: "#6b7280" }}>
          frontend Next.js yg mengakses backend Express.js melalui REST API.
        </p>

        <Link href="/mahasiswa">
          <button className="btn-primary" style={{ fontSize: 16, padding: "12px 28px" }}>
            buka data mahasiswa →
          </button>
        </Link>
      </div>
    </main>
  );
}