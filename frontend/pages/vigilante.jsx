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

function Vigilante() {
  const router = useRouter()
  const [activeTable, setActiveTable] = useState('usuarios')
  const [usuarios, setUsuarios] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [equipos, setEquipos] = useState([])
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contra, setContra] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [searchTerm, setSearchTerm] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [showCreateUsuarioForm, setShowCreateUsuarioForm] = useState(false)
  const [showCreateMovimientoForm, setShowCreateMovimientoForm] = useState(false)
  const [showEditMovimientoForm, setShowEditMovimientoForm] = useState(false)
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null)
  const [documentTypes, setDocumentTypes] = useState([
    { id: "CC", name: "Cédula de Ciudadanía" },
    { id: "TI", name: "Tarjeta de Identidad" },
    { id: "CE", name: "Cédula de Extranjería" },
    { id: "OT", name: "Otro" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usuariosResponse, movimientosResponse, equiposResponse] = await Promise.all([
          api.get('/auth/usuarios-por-rol?rol=Usuario'),
          api.get('/movimientos'),
          api.get('/equipos'),
        ]);

        setUsuarios(usuariosResponse.data);
        setMovimientos(movimientosResponse.data);
        setEquipos(equiposResponse.data);
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

  const filteredUsuarios = usuarios.filter(usuario =>
    (usuario.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (usuario.numero_documento || '').includes(searchTerm)
  )

  const filteredMovimientos = movimientos.filter(movimiento =>
    (movimiento.usuario?.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (movimiento.equipo?.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const filteredEquipos = equipos.filter(equipo =>
    (equipo.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (equipo.serial || '').includes(searchTerm)
  )

  const handleSubmitUsuario = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/registrarUsuario', {
        nombre,
        apellido,
        numero_documento: numeroDocumento,
        tipo_documento: tipoDocumento,
        telefono,
        contra,
        rol: 'Usuario'
      })
      setToastMessage('Usuario creado exitosamente')
      setShowToast(true)
      setShowCreateUsuarioForm(false)
      const usuariosResponse = await api.get('/auth/usuarios-por-rol?rol=Usuario');
      setUsuarios(usuariosResponse.data);
    } catch (error) {
      console.error('Error creating usuario:', error)
      setToastMessage('Error al crear el usuario')
      setShowToast(true)
    }
  }

  const handleSubmitMovimiento = async (e) => {
    e.preventDefault()
    // Implement the logic to submit a new movement
    // You'll need to add state variables for the movement form fields
  }

  const handleEditMovimiento = async (e) => {
    e.preventDefault()
    // Implement the logic to edit an existing movement
    // You'll need to add state variables for the movement form fields
  }

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
          <h2 className="text-2xl font-bold mb-6">Vigilante - Gestión de Usuarios, Movimientos y Equipos</h2>
          {/* Buscador */}
          <div className="mb-4 flex items-center">
            <input
              type="text"
              placeholder="Buscar registro"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm mr-2 p-2 border border-gray-300 rounded"
            />
            <Image src="/buscar.png" alt="Buscar" width={20} height={20} />
          </div>

          {/* Botones de Navegación */}
          <div className="mb-4 flex justify-between">
            <div className="space-x-2">
              <button
                onClick={() => setActiveTable('usuarios')}
                className={`py-2 px-4 border rounded ${activeTable === 'usuarios' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}
              >
                Usuarios
              </button>
              <button
                onClick={() => setActiveTable('movimientos')}
                className={`py-2 px-4 border rounded ${activeTable === 'movimientos' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}
              >
                Movimientos
              </button>
              <button
                onClick={() => setActiveTable('equipos')}
                className={`py-2 px-4 border rounded ${activeTable === 'equipos' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}
              >
                Equipos
              </button>
            </div>
            <div className="space-x-2">
              <button
                className="py-2 px-4 border rounded bg-green-500 text-white"
                onClick={() => setShowCreateUsuarioForm(true)}
              >
                Crear Usuario
              </button>
              <button
                className="py-2 px-4 border rounded bg-orange-500 text-white"
                onClick={() => setShowCreateMovimientoForm(true)}
              >
                Crear Movimiento
              </button>
            </div>
          </div>

          {/* Tablas */}
          {activeTable === 'usuarios' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Documento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id_usuario}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.nombre} {usuario.apellido}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.numero_documento}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.telefono}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTable === 'movimientos' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMovimientos.map((movimiento) => (
                    <tr key={movimiento.id_movimiento}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movimiento.usuario?.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movimiento.equipo?.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movimiento.tipo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(movimiento.fecha).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => {
                            setSelectedItemForEdit(movimiento);
                            setShowEditMovimientoForm(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTable === 'equipos' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEquipos.map((equipo) => (
                    <tr key={equipo.id_equipo}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.serial}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Formularios y modales */}
          {showCreateUsuarioForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-4">Crear Nuevo Usuario</h3>
                <form onSubmit={handleSubmitUsuario}>
                  <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      type="text"
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
                    <input
                      type="text"
                      id="apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
                    <select
                      id="tipoDocumento"
                      value={tipoDocumento}
                      onChange={(e) => setTipoDocumento(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="">Seleccione un tipo de documento</option>
                      {documentTypes.map((documentType) => (
                        <option key={documentType.id} value={documentType.id}>
                          {documentType.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700">Número de Documento</label>
                    <input
                      type="text"
                      id="numeroDocumento"
                      value={numeroDocumento}
                      onChange={(e) => setNumeroDocumento(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                      type="text"
                      id="telefono"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="contra" className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                      type="password"
                      id="contra"
                      value={contra}
                      onChange={(e) => setContra(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateUsuarioForm(false)}
                      className="py-2 px-4 border rounded bg-gray-300 text-black"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 border rounded bg-blue-500 text-white"
                    >
                      Crear Usuario
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showCreateMovimientoForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-4">Crear Nuevo Movimiento</h3>
                <form onSubmit={handleSubmitMovimiento}>
                  {/* Add form fields for creating a new movement */}
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateMovimientoForm(false)}
                      className="py-2 px-4 border rounded bg-gray-300 text-black"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 border rounded bg-blue-500 text-white"
                    >
                      Crear Movimiento
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showEditMovimientoForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-4">Editar Movimiento</h3>
                <form onSubmit={handleEditMovimiento}>
                  {/* Add form fields for editing a movement */}
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowEditMovimientoForm(false)}
                      className="py-2 px-4 border rounded bg-gray-300 text-black"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 border rounded bg-blue-500 text-white"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
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

export default withAuth(Vigilante, ['Vigilante'])