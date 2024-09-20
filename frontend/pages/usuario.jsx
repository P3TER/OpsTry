import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import api from '@/utils/api'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Layout } from '@/components/Layouts'
import { LoadingIndicator } from '@/components/LoadingIndicator'
import { Toast } from '@/components/Toast'
import { withAuth } from '@/components/withAuth'
import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"

function Usuario() {
  const router = useRouter()
  const [activeTable, setActiveTable] = useState('info')
  const [userInfo, setUserInfo] = useState(null)
  const [movimientos, setMovimientos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)

  // const userName = localStorage.getItem('nombre')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId')
        const [userInfoResponse, movimientosResponse] = await Promise.all([
          api.get(`/auth/usuarios/${userId}`),
          api.get(`/movimientos/usuario/${userId}`),
        ]);

        setUserInfo(userInfoResponse.data);
        setMovimientos(movimientosResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setToastMessage('Error al cargar los datos');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMovimientos = movimientos.filter(movimiento =>
    (movimiento.equipo?.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const handleLogout = () => {
    setShowLogoutPopup(true)
  }

  const confirmLogout = async () => {
    try {
      await api.post('/auth/logout')
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userId')
      localStorage.removeItem('userRole')
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
      setToastMessage('Error al cerrar sesión')
      setShowToast(true)
    }
  }

  if (loading) {
    return <LoadingIndicator />
  }

  return (
    <ErrorBoundary>
      <Layout>
        <div className="p-8 bg-gray-100 min-h-screen text-black">
          <h2 className="text-2xl font-bold mb-6">Usuario - Información Personal y Movimientos</h2>

          {/* Botones de Navegación */}
          <div className="mb-4 flex justify-between">
            <div className="space-x-2">
              <button
                onClick={() => setActiveTable('info')}
                className={`py-2 px-4 border rounded ${activeTable === 'info' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}
              >
                Información Personal
              </button>
              <button
                onClick={() => setActiveTable('movimientos')}
                className={`py-2 px-4 border rounded ${activeTable === 'movimientos' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}
              >
                Movimientos
              </button>
            </div>
          </div>

          {/* Tablas */}
          {activeTable === 'info' && userInfo && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Información Personal</h3>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{`${userInfo.nombre} ${userInfo.apellido}`}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Tipo de documento</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userInfo.tipo_documento}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Número de documento</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userInfo.numero_documento}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userInfo.telefono}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTable === 'movimientos' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMovimientos.map((movimiento) => (
                    <tr key={movimiento.id_movimiento}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movimiento.equipo?.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movimiento.tipo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(movimiento.fecha).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showToast && (
            <Toast message={toastMessage} onClose={() => setShowToast(false)} />
          )}

          {showLogoutPopup && (
            <Dialog open={showLogoutPopup} onOpenChange={setShowLogoutPopup}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Cierre de Sesión</DialogTitle>
                </DialogHeader>
                <p>¿Estás seguro de cerrar sesión?</p>
                <div className="flex justify-end space-x-2">
                  <Button onClick={confirmLogout} variant="destructive">Sí</Button>
                  <Button onClick={() => setShowLogoutPopup(false)} variant="outline">No</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </Layout>
    </ErrorBoundary>
  )
}

export default withAuth(Usuario, 'Usuario')