import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import api from '@/utils/api';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { Toast } from '@/components/Toast';

function Login() {
  const router = useRouter();
  const [numero_documento, setNumeroDocumento] = useState('');
  const [contra, setContra] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Nuevo estado para verificar autenticación

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/check-session', { withCredentials: true });
        if (response.data.loggedIn) {
          const { rol } = response.data.user;
          if (rol === 'SuperAdmin') {
            router.push('/superAdmin');
          } else if (rol === 'Director') {
            router.push('/directorSede');
          } else if (rol === 'Vigilante') {
            router.push('/vigilante');
          } else {
            router.push('/usuario');
          }
        } else {
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isCheckingAuth) {
    return <LoadingIndicator />; // O cualquier otro indicador de carga
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        numero_documento,
        contra
      }, {
        withCredentials: true
      });
  
      const { rol } = response.data;
  
      if (rol === 'SuperAdmin') {
        return router.push('/superAdmin');
      } else if (rol === 'Director') {
        return router.push('/directorSede');
      } else if (rol === 'Vigilante') {
        return router.push('/vigilante');
      } else {
        return router.push('/usuario');
      }
  
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        if (error.response.status === 404) {
          setToastMessage('Usuario no encontrado');
        } else if (error.response.status === 401) {
          setToastMessage('Contraseña incorrecta');
        } else {
          setToastMessage(error.response.data.error || 'Error al iniciar sesión');
        }
      } else if (error.request) {
        setToastMessage('No se pudo conectar con el servidor');
      } else {
        setToastMessage('Error al procesar la solicitud');
      }
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={150}
            className="mx-auto"
            priority
          />

          <h1 className="text-2xl font-bold mt-4">Bienvenido</h1>
          <p className="text-gray-600">Inicia Sesión</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              id="numero-documento"
              name="numero-documento"
              type="text"
              required
              className="w-full p-2 border-b focus:border-red-500 transition-colors"
              value={numero_documento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              autoComplete='numero_documento'
            />
            <label
              htmlFor="numero-documento"
              className="absolute left-0 -top-3.5 text-red-500 text-sm transition-all"
            >
              Número de identificación
            </label>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full p-2 border-b border-gray-300 focus:border-red-500 transition-colors"
              value={contra}
              onChange={(e) => setContra(e.target.value)}
              autoComplete='current-password'
            />
            <label
              htmlFor="password"
              className="absolute left-0 -top-3.5 text-red-500 text-sm transition-all"
            >
              Contraseña
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
            disabled={loading}
          >
            {loading ? <LoadingIndicator /> : 'Ingresar'}
          </button>
        </form>

        <a href="#" className="block text-center mt-4 text-red-500 text-sm">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <Toast show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default Login;