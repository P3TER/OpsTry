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

function DirectorSede() {
    const router = useRouter()
    const [activeTable, setActiveTable] = useState('usuarios')
    const [usuarios, setUsuarios] = useState([])
    const [vigilantes, setVigilantes] = useState([])
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [selectedSede, setSelectedSede] = useState('')
    const [vigilanteNombre, setVigilanteNombre] = useState('');
    const [vigilanteNumeroDocumento, setVigilanteNumeroDocumento] = useState('');
    const [sedes, setSedes] = useState([]);
    const [contra, setContra] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState('');
    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [searchTerm, setSearchTerm] = useState('')
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [showLogoutPopup, setShowLogoutPopup] = useState(false)
    const [showCreateVigilanteForm, setShowCreateVigilanteForm] = useState(false)
    const [showEditUsuarioForm, setShowEditUsuarioForm] = useState(false)
    const [showEditVigilanteForm, setShowEditVigilanteForm] = useState(false)
    const [selectedItemForEdit, setSelectedItemForEdit] = useState(null)
    const [documentTypes, setDocumentTypes] = useState([
        { id: "CC", name: "Cédula de Ciudadanía" },
        { id: "TI", name: "Tarjeta de Identidad" },
        { id: "CE", name: "Cédula de Extranjería" },
        { id: "OT", name: "Otro" },
    ]);
    const usuario = localStorage.getItem('id_usuario');
    const sede = localStorage.getItem('sede_id');

    const userId = localStorage.getItem('userId')
    const sede_id = localStorage.getItem('sede_id')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usuariosResponse, vigilantesResponse, sedesResponse] = await Promise.all([
                    api.get('/sedes'),
                    api.get('/auth/usuarios-por-rol?rol=Usuario'),
                    api.get('/auth/usuarios-por-rol?rol=Vigilante'),
                ]);

                console.log(sedesResponse); // Verifica la respuesta de la API
                setSedes(sedesResponse.data)
                setUsuarios(usuariosResponse.data.filter(usuario => usuario.sede_id === sede_id));
                setVigilantes(vigilantesResponse.data.filter(vigilante => vigilante.sede_id === sede_id));
            } catch (error) {
                console.error('Error fetching data:', error);
                setToastMessage('Error al cargar los datos');
                setShowToast(true);
            } finally {
                setLoading(false);
            }
        };

        setSelectedSede(sede_id);


        fetchData();
    }, [sede_id]);

    const filteredUsuarios = usuarios.filter(usuario =>
        (usuario.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (usuario.numero_documento || '').includes(searchTerm)
    )

    const filteredVigilantes = vigilantes.filter(vigilante =>
        (vigilante.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (vigilante.numero_documento || '').includes(searchTerm)
    )
    const handleSubmitVigilante = async (e) => {
        e.preventDefault();
        try {

            // Asegúrate de que estos valores están definidos
            if (!vigilanteNombre || !apellido || !vigilanteNumeroDocumento || !tipoDocumento || !telefono || !contra) {
                throw new Error('Todos los campos son requeridos');
            }

            const vigilanteData = {
                nombre: vigilanteNombre.trim(),
                apellido: apellido.trim(),
                numero_documento: vigilanteNumeroDocumento.trim(),
                tipo_documento: tipoDocumento.trim(),
                telefono: telefono.trim(),
                contra,
                sede_id: sede,
                novedad: `Creado por el usuario con id: ${usuario}`,
                rol: 'Vigilante',
            };

            console.log('Datos del vigilante a enviar:', vigilanteData); // Verifica los datos

            await api.post('/auth/registrarUsuario', vigilanteData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setToastMessage('Vigilante creado exitosamente');
            setShowToast(true);
            setShowCreateVigilanteForm(false);
            const vigilantesResponse = await api.get('/auth/usuarios-por-rol?rol=Vigilante');
            setVigilantes(vigilantesResponse.data);
        } catch (error) {
            console.error('Error creando vigilante:', error);
            console.error('Error de respuesta:', error.response?.data);
            setToastMessage('Error al crear el vigilante');
            setShowToast(true);
        }
    };

    const handleUpdateUsuario = async (e) => {
        e.preventDefault();
        try {
            const userId = selectedItemForEdit.numero_documento;
            const usuario = localStorage.getItem('id_usuario');
            const data = {
                nombre: usuarioNombre.trim(),
                apellido,
                numero_documento: usuarioNumeroDocumento,
                tipo_documento: tipoDocumento.trim(),
                telefono: telefono.trim(),
                novedad: `Actualizado por el usuario con id: ${usuario}`
            };
            await api.put(`/auth/actualizar/${userId}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setToastMessage('Usuario actualizado exitosamente');
            setShowToast(true);
            setShowEditUsuarioForm(false);
            const usuariosResponse = await api.get('/auth/usuarios-por-rol?rol=Usuario');
            setUsuarios(usuariosResponse.data);
        } catch (error) {
            console.error('Error actualizando usuario:', error);
            setToastMessage('Error al actualizar el usuario');
            setShowToast(true);
        }
    };


    const handleUpdateVigilante = async (e) => {
        e.preventDefault();
        try {
            const userId = selectedItemForEdit.numero_documento;
            const usuario = localStorage.getItem('id_usuario');
            const data = {
                nombre: vigilanteNombre.trim(),
                apellido,
                numero_documento: vigilanteNumeroDocumento,
                tipo_documento: tipoDocumento.trim(),
                telefono: telefono.trim(),
                novedad: `Actualizado por el usuario con id: ${usuario}`
            };
            await api.put(`/auth/actualizar/${userId}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setToastMessage('Vigilante actualizado exitosamente');
            setShowToast(true);
            setShowEditVigilanteForm(false);
            const vigilantesResponse = await api.get('/auth/usuarios-por-rol?rol=Vigilante');
            setVigilantes(vigilantesResponse.data);
        } catch (error) {
            console.error('Error actualizando vigilante:', error);
            setToastMessage('Error al actualizar el vigilante');
            setShowToast(true);
        }
    };


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
                    <h2 className="text-2xl font-bold mb-6">Director de Sede - Gestión de Usuarios y Vigilantes</h2>
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
                                onClick={() => setActiveTable('vigilantes')}
                                className={`py-2 px-4 border rounded ${activeTable === 'vigilantes' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}
                            >
                                Vigilantes
                            </button>
                        </div>
                        <div className="space-x-2">
                            <button
                                className="py-2 px-4 border rounded bg-orange-500 text-white"
                                onClick={() => setShowCreateVigilanteForm(true)}
                            >
                                Crear Vigilante
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
                                                        setSelectedItemForEdit(usuario);
                                                        setNombre(usuario.nombre);
                                                        setApellido(usuario.apellido);
                                                        setNumeroDocumento(usuario.numero_documento);
                                                        setTipoDocumento(usuario.tipo_documento);
                                                        setTelefono(usuario.telefono);
                                                        setShowEditUsuarioForm(true);
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

                    {activeTable === 'vigilantes' && (
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
                                    {filteredVigilantes.map((vigilante) => (
                                        <tr key={vigilante.id_usuario}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vigilante.nombre} {vigilante.apellido}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vigilante.numero_documento}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vigilante.telefono}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <button
                                                    onClick={() => {
                                                        setSelectedItemForEdit(vigilante);
                                                        setNombre(vigilante.nombre);
                                                        setApellido(vigilante.apellido);
                                                        setNumeroDocumento(vigilante.numero_documento);
                                                        setTipoDocumento(vigilante.tipo_documento);
                                                        setTelefono(vigilante.telefono);
                                                        setShowEditVigilanteForm(true);
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

                    {showCreateVigilanteForm && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold mb-4">Crear Nuevo Vigilante</h3>
                                <form onSubmit={handleSubmitVigilante}>
                                    <div className="flex flex-wrap justify-center">
                                        <div className="w-1/2 pr-4">
                                            <div className="mb-2">
                                                <label htmlFor="nombreVigilante" className="block text-sm font-medium text-gray-700">Nombre</label>
                                                <input
                                                    type="text"
                                                    id="nombreVigilante"
                                                    value={vigilanteNombre}
                                                    onChange={(e) => setVigilanteNombre(e.target.value)}
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
                                                    value={vigilanteNumeroDocumento}
                                                    onChange={(e) => setVigilanteNumeroDocumento(e.target.value)}
                                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                                    required
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
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateVigilanteForm(false)}
                                            className="py-2 px-4 border rounded bg-gray-300 text-black"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="py-2 px-4 border rounded bg-blue-500 text-white"
                                        >
                                            Crear Vigilante
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showEditUsuarioForm && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold mb-4">Editar Usuario</h3>
                                <form onSubmit={handleEditUsuario}>
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
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditUsuarioForm(false)}
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

                    {showEditUsuarioForm && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <h3 className="text-lg font-bold mb-4">Actualizar Usuario</h3>
                                <form onSubmit={handleUpdateUsuario}>
                                    <div className="flex flex-wrap justify-center">
                                        <div className="w-1/2 pr-4">
                                            <div className="mb-2">
                                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                                                <input
                                                    type="text"
                                                    id="nombre"
                                                    value={usuarioNombre}
                                                    onChange={(e) => setUsuarioNombre(e.target.value)}
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
                                                    value={usuarioNumeroDocumento}
                                                    onChange={(e) => setUsuarioNumeroDocumento(e.target.value)}
                                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                                    required
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
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditUsuarioForm(false)}
                                            className="py-2 px-4 border rounded bg-gray-300 text-black"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="py-2 px-4 border rounded bg-blue-500 text-white"
                                        >
                                            Actualizar Usuario
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

export default withAuth(DirectorSede, ['Director'])