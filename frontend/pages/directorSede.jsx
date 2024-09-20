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

function VigilanteSede() {
    const router = useRouter()
    const [activeTable, setActiveTable] = useState('equipos')
    const [equipos, setEquipos] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [marca, setMarca] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [selectedSede, setSelectedSede] = useState('')
    const [usuarioNombre, setUsuarioNombre] = useState('')
    const [usuarioNumeroDocumento, setUsuarioNumeroDocumento] = useState('')
    const [sedes, setSedes] = useState([])
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [telefono, setTelefono] = useState('')
    const [contra, setContra] = useState('')
    const [tipoDocumento, setTipoDocumento] = useState('')
    const [currentUser, setCurrentUser] = useState(null)
    const [numeroDocumento, setNumeroDocumento] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [showLogoutPopup, setShowLogoutPopup] = useState(false)
    const [showCreateUsuarioForm, setShowCreateUsuarioForm] = useState(false)
    const [showCreateEquipoForm, setShowCreateEquipoForm] = useState(false)
    const [showEditEquipoForm, setShowEditEquipoForm] = useState(false)
    const [showEditUsuarioForm, setShowEditUsuarioForm] = useState(false)
    const [selectedItemForEdit, setSelectedItemForEdit] = useState(null)
    const [selectedUsuarioId, setSelectedUsuarioId] = useState('')
    const [documentTypes, setDocumentTypes] = useState([
        { id: "CC", name: "Cédula de Ciudadanía" },
        { id: "TI", name: "Tarjeta de Identidad" },
        { id: "CE", name: "Cédula de Extranjería" },
        { id: "OT", name: "Otro" },
    ])

    const vigilante = localStorage.getItem('id_usuario')
    const sede_id = localStorage.getItem('sede_id')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sedesResponse, usuariosResponse, equiposResponse] = await Promise.all([
                    api.get('/sedes/'),
                    api.get('/auth/usuarios-por-rol?rol=Vigilante'),
                    api.get('/equipos/'),
                ])

                setSedes(sedesResponse.data)
                setUsuarios(usuariosResponse.data)
                setEquipos(equiposResponse.data)
            } catch (error) {
                console.error('Error fetching data:', error)
                setToastMessage('Error al cargar los datos')
                setShowToast(true)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [sede_id])

    const filteredEquipos = equipos.filter(equipo =>
        (equipo.marca?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (equipo.descripcion?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )

    const filteredUsuarios = usuarios.filter(usuario =>
        (usuario.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (usuario.numero_documento || '').includes(searchTerm) ||
        (usuario.sede_id?.nombre_sede?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )

    const handleSubmitUsuario = async (e) => {
        e.preventDefault()
        try {
            await api.post('/auth/registrarUsuario', {
                nombre: nombre,
                apellido,
                numero_documento: numeroDocumento,
                tipo_documento: tipoDocumento,
                telefono: telefono || '00293010',
                contra: contra || 'jhon123',
                sede_id: localStorage.getItem('sede_id'),
                rol: 'Vigilante'
            })
            setToastMessage('Usuario creado exitosamente')
            setShowToast(true)
            setShowCreateUsuarioForm(false)
            const usuariosResponse = await api.get('/auth/usuarios-por-rol?rol=Vigilante')
            setUsuarios(usuariosResponse.data)
            return router.reload()
        } catch (error) {
            console.error('Error creating Usuario:', error)
            setToastMessage('Error al crear el Usuario')
            setShowToast(true)
        }
    }

    const handleSubmitEquipo = async (e) => {
        e.preventDefault()
        try {
            const equipoData = {
            marca,
            descripcion,
            usuario_id: selectedUsuarioId
        };
        console.log('Sending equipment data:', equipoData);
        const response = await api.post('/equipos/registrarEquipo', equipoData)
            if(!response){
                setToastMessage('Error al crear el Equipo')
                setShowToast(true)
                return;
            }
            setToastMessage('Equipo creado exitosamente')
            setShowToast(true)
            setShowCreateEquipoForm(false)
            const equiposResponse = await api.get('/equipos/')
            setEquipos(equiposResponse.data)
        } catch (error) {
            console.error('Error creating Equipo:', error)
            setToastMessage(error.response?.data?.message || 'Error al crear el Equipo')
            setShowToast(true)
        }
    }

    const handleUpdateEquipo = async (e) => {
        e.preventDefault()
        try {
            const equipoId = selectedItemForEdit.id
            const data = {
                marca,
                descripcion,
                novedad: `Actualizado por el vigilante con id: ${vigilante}`,
            }
            console.log(data);

            await api.put(`/equipos/${equipoId}`, data)

            setToastMessage('Equipo actualizado exitosamente')
            setShowToast(true)
            setShowEditEquipoForm(false)

            const equiposResponse = await api.get('/equipos/')
            setEquipos(equiposResponse.data)
        } catch (error) {
            console.error('Error actualizando equipo:', error)
            setToastMessage('Error al actualizar el equipo')
            setShowToast(true)
        }
    }

    const handleUpdateUsuario = async (formData) => {
        try {
            const userId = selectedItemForEdit.numero_documento
            const data = {
                ...formData,
                novedad: `Actualizado por el vigilante con id: ${vigilante}`,
            }
            await api.put(`/auth/actualizar/${userId}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            setToastMessage('Usuario actualizado exitosamente')
            setShowToast(true)
            setShowEditUsuarioForm(false)
            const usuariosResponse = await api.get('/auth/usuarios-por-rol?rol=Vigilante')
            setUsuarios(usuariosResponse.data)
        } catch (error) {
            console.error('Error actualizando usuario:', error)
            setToastMessage('Error al actualizar el usuario')
            setShowToast(true)
        }
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
            localStorage.removeItem('sede_id')
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
                    <h2 className="text-2xl font-bold mb-6">Vigilante de Sede - Gestión de Equipos y Usuarios</h2>
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
                                onClick={() => setActiveTable('equipos')}
                                className={`py-2 px-4 border rounded ${activeTable === 'equipos' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}
                            >
                                Equipos
                            </button>
                        </div>
                        <div className="space-x-2">
                            <button
                                className="py-2 px-4 border rounded bg-orange-500 text-white"
                                onClick={() => setShowCreateUsuarioForm(true)}
                            >
                                Crear Usuario
                            </button>
                            <button
                                className="py-2 px-4 border rounded bg-green-500 text-white"
                                onClick={() => setShowCreateEquipoForm(true)}
                            >
                                Crear Equipo
                            </button>
                        </div>
                    </div>

                    {activeTable === 'usuarios' && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Documento</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsuarios.map((usuario) => (
                                        <tr key={usuario.id_usuario}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.nombre} {usuario.apellido}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.numero_documento}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.telefono}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <button
                                                    onClick={() => {
                                                        setSelectedItemForEdit(usuario)
                                                        setNombre(usuario.nombre)
                                                        setApellido(usuario.apellido)
                                                        setNumeroDocumento(usuario.numero_documento)
                                                        setTipoDocumento(usuario.tipo_documento)
                                                        setTelefono(usuario.telefono)
                                                        setShowEditUsuarioForm(true)
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-2"
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código de Barras</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredEquipos.map((equipo) => (
                                        <tr key={equipo.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.marca}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.descripcion}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipo.codigoBarras}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <button
                                                    onClick={() => {
                                                        setSelectedItemForEdit(equipo)
                                                        setMarca(equipo.marca)
                                                        setDescripcion(equipo.descripcion)
                                                        setShowEditEquipoForm(true)
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-2"
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

                    {showCreateUsuarioForm && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold mb-4">Crear Nuevo Usuario</h3>
                                <form onSubmit={handleSubmitUsuario}>
                                    <div className="flex flex-wrap justify-center">
                                        <div className="w-1/2 pr-4">
                                            <div className="mb-2">
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
                                            <div className="mb-2">
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
                                            <div className="mb-2">
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
                                            <div className="mb-2">
                                                <label htmlFor="Rol" className="block text-sm font-medium text-gray-700">Rol</label>
                                                <input
                                                    type="text"
                                                    id="Rol"
                                                    value='Vigilante'
                                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="w-1/2 pl-4">
                                            <div className="mb-2">
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
                                            <div className="mb-2">
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
                                            <div className="mb-2">
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
                                        </div>
                                    </div>
                                    <input type="hidden" id="rol" value="Vigilante" />
                                    <div className="flex justify-center">
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

                    {showCreateEquipoForm && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold mb-4">Crear Nuevo Equipo</h3>
                                <form onSubmit={handleSubmitEquipo}>
                                    <div className="mb-4">
                                        <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca</label>
                                        <input
                                            type="text"
                                            id="marca"
                                            value={marca}
                                            onChange={(e) => setMarca(e.target.value)}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                                        <textarea
                                            id="descripcion"
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">Usuario</label>
                                        <select
                                            id="usuario"
                                            value={selectedUsuarioId}
                                            onChange={(e) => setSelectedUsuarioId(e.target.value)}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                            required
                                        >
                                            <option value="">Seleccione un usuario</option>
                                            {usuarios.map((usuario) => (
                                                <option key={usuario.id_usuario} value={usuario.id_usuario}>
                                                    {usuario.nombre} {usuario.apellido} - {usuario.numero_documento}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateEquipoForm(false)}
                                            className="py-2 px-4 border rounded bg-gray-300 text-black"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="py-2 px-4 border rounded bg-blue-500 text-white"
                                        >
                                            Crear Equipo
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showEditEquipoForm && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold mb-4">Editar Equipo</h3>
                                <form onSubmit={handleUpdateEquipo}>
                                    <div className="mb-4">
                                        <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca</label>
                                        <input
                                            type="text"
                                            id="marca"
                                            value={marca}
                                            onChange={(e) => setMarca(e.target.value)}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                                        <textarea
                                            id="descripcion"
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditEquipoForm(false)}
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

export default withAuth(VigilanteSede, ['Director'])