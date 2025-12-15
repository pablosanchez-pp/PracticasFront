"use client";

import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '@/common/components/Auth/Infrastructure/requests';

const { Title, Paragraph } = Typography;

export function LoginDelivery() {
  const router = useRouter();

  const onFinish = async (values: { username: string; password: string }) => {
    const hide = message.loading('Iniciando sesión...', 0);
    try {
      const resp: any = await loginUser(values);
      hide();
      message.success('Login correcto');
      try {
        sessionStorage.setItem('loggedIn', '1');
        if (resp && resp.id) sessionStorage.setItem('USER_ID', String(resp.id));
        if (resp && resp.username) sessionStorage.setItem('USERNAME', String(resp.username));
      } catch {}
      router.replace('/');
    } catch (err: unknown) {
      hide();
      message.error((err as Error)?.message ?? 'Error en login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: '#1e293b' , marginTop: '120px' }}>
      <Card style={{ width: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Title level={3}>Iniciar sesión</Title>
          <Paragraph type="secondary">Introduce usuario y contraseña para continuar</Paragraph>
        </div>

        <Form name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Usuario" rules={[{ required: true, message: 'Introduce usuario' }]}>
            <Input prefix={<UserOutlined />} placeholder="Usuario" />
          </Form.Item>

          <Form.Item name="password" label="Contraseña" rules={[{ required: true, message: 'Introduce contraseña' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Entrar
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Button type="link" onClick={() => router.push('/register')}>¿No tienes cuenta? Registrarse</Button>
          </div>
        </Form>

      </Card>
    </div>
  );
}

export function RegisterDelivery() {
  const router = useRouter();

  const onFinish = async (values: { username: string; password: string }) => {
    const hide = message.loading('Registrando...', 0);
    try {
      const resp: any = await registerUser(values);
      hide();
      message.success('Usuario registrado — iniciando sesión...');

      try {
        const loginResp: any = await loginUser(values);
        try {
          sessionStorage.setItem('loggedIn', '1');
          if (loginResp && loginResp.id) sessionStorage.setItem('USER_ID', String(loginResp.id));
          if (loginResp && loginResp.username) sessionStorage.setItem('USERNAME', String(loginResp.username));
        } catch {}
        router.replace('/');
      } catch (loginErr: unknown) {
        message.warning('Registro OK, pero no se pudo iniciar sesión automáticamente. Por favor inicia sesión.');
        router.replace('/login');
      }
    } catch (err: unknown) {
      hide();
      message.error((err as Error)?.message ?? 'Error registrando usuario');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: '#1e293b' , marginTop: '120px' }}>
      <Card style={{ width: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Title level={3}>Registro</Title>
          <Paragraph type="secondary">Crea una cuenta nueva</Paragraph>
        </div>

        <Form name="register" layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Usuario" rules={[{ required: true, message: 'Introduce usuario' }]}>
            <Input prefix={<UserOutlined />} placeholder="Usuario" />
          </Form.Item>

          <Form.Item name="password" label="Contraseña" rules={[{ required: true, message: 'Introduce contraseña' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Registrarse
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Button type="link" onClick={() => router.push('/login')}>¿Ya tienes cuenta? Iniciar sesión</Button>
          </div>
        </Form>

      </Card>
    </div>
  );
}

export default { LoginDelivery, RegisterDelivery };
