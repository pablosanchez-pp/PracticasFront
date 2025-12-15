'use client';

import Link from 'next/link';
import { Button, Card, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/common/components/Auth/Infrastructure/requests';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const router = useRouter();
  const [logged, setLogged] = useState<boolean>(false);

  useEffect(() => {
    try {
      const isLogged = sessionStorage.getItem('loggedIn') === '1';
      if (!isLogged) {
        router.replace('/login');
        return;
      }
      setLogged(true);
    } catch (e) {
      router.replace('/login');
    }
  }, [router]);

  const handleDisconnect = () => {
    try {
      const id = sessionStorage.getItem('USER_ID');
      if (id) {
        // call backend logout; ignore errors and continue to redirect
        logoutUser(id).catch(() => {});
      }
    } catch (e) {
      // ignore
    }
    try { sessionStorage.removeItem('loggedIn'); } catch (e) {}
    try { sessionStorage.removeItem('USER_ID'); } catch {}
    try { sessionStorage.removeItem('USERNAME'); } catch {}
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-slate-800 text-white">
      <div className="max-w-5xl mx-auto p-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center text-lg font-bold">DF</div>
            <div>
              <div className="text-lg font-semibold">Demo frontend</div>
            </div>
          </div>

          <div>
            {logged && (
              <Button onClick={handleDisconnect} danger ghost>
                Desconectar
              </Button>
            )}
          </div>
        </header>

        <Card className="bg-slate-900 border-slate-700" bordered={false} bodyStyle={{ padding: 28 }}>
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <Title style={{ color: 'white', margin: 0 }} level={2}>Inicio</Title>
              <Paragraph style={{ color: '#9aa4b2', marginTop: 8, maxWidth: 720 }}>
                Este es un pequeño frontend de prueba para practicar Next.js y la conexión con tu microservicio de clientes. Usa los botones para navegar a las secciones principales.
              </Paragraph>
            </div>

            <div className="mt-6 md:mt-0">
              <Space direction="vertical" size="middle">
                <Link href="/clients">
                  <Button type="primary" size="large">Clientes</Button>
                </Link>
                <Link href="/merchants">
                  <Button type="primary" size="large">Merchants</Button>
                </Link>
              </Space>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
