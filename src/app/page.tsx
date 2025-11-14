import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Home</h1>
      <p>Demo frontend</p>
      <ul>
        <li>
          <Link href="/clients">Ir a clientes</Link>
        </li>
      </ul>
    </main>
  );
}