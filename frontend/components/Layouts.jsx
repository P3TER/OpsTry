import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Toast } from './Toast';

export function Layout({ children }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const checkAuthAndRole = async () => {
    try {
      const response = await api.get('/auth/check-session');
      const isAuthenticated = response.data.loggedIn;
      const role = response.data.user ? response.data.user.rol : '';
      setIsLoggedIn(isAuthenticated);
      setUserRole(role);
    } catch (error) {
      console.error('Error checking session:', error);
      setIsLoggedIn(false);
      setUserRole('');
    }
  };

  useEffect(() => {
    checkAuthAndRole();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); // Asegúrate de que esta ruta existe en tu API
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      setIsLoggedIn(false);
      setUserRole('');
      setToastMessage('Sesión cerrada exitosamente');
      setShowToast(true);
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setToastMessage('Error al cerrar sesión');
      setShowToast(true);
    }
  };


  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Opstry Management System</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
      </Head>

      <nav className="bg-white text-black p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Opstry
          </Link>
          {isLoggedIn && (
            <div className="flex space-x-4">
              <span className="text-gray-500">{userRole}</span>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline"
                aria-label="Cerrar sesión"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <Toast show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    </div>
  );
}