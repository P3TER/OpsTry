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

function SuperAdmin() {
  const router = useRouter()
  const [activeTable, setActiveTable] = useState('sedes')
  const [sedes, setSedes] = useState([])
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contra, setContra] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [directores, setDirectores] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [ciudades, setCiudades] = useState([])
  const [selectedDepartamento, setSelectedDepartamento] = useState('')
  const [selectedCiudad, setSelectedCiudad] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [sedeNombre, setSedeNombre] = useState('')
  const [directorNombre, setDirectorNombre] = useState('')
  const [directorNumeroDocumento, setDirectorNumeroDocumento] = useState('')
  const [selectedSede, setSelectedSede] = useState('')
  const [showCreateSedeForm, setShowCreateSedeForm] = useState(false)
  const [showCreateDirectorForm, setShowCreateDirectorForm] = useState(false)
  const [showEditSedeForm, setShowEditSedeForm] = useState(false)
  const [showEditDirectorForm, setShowEditDirectorForm] = useState(false)
  const [showDeleteSedeConfirm, setShowDeleteSedeConfirm] = useState(false)
  const [showDeleteDirectorConfirm, setShowDeleteDirectorConfirm] = useState(false)
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null)
  const [selectedItemForDelete, setSelectedItemForDelete] = useState(null)
  const [documentTypes, setDocumentTypes] = useState([
    { id: "CC", name: "Cédula de Ciudadanía" },
    { id: "TI", name: "Tarjeta de Identidad" },
    { id: "CE", name: "Cédula de Extranjería" },
    { id: "OT", name: "Otro" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sedesResponse, departamentosResponse, directoresResponse] = await Promise.all([
          api.get('/sedes/').catch((error) => console.error('Error fetching sedes:', error)),
          api.get('/auth/departamentos-ciudades').catch((error) => console.error('Error fetching departamentos-ciudades:', error)),
          api.get('/auth/usuarios-por-rol?rol=Director').catch((error) => console.error('Error fetching directores:', error)),
        ]);

        console.log(sedesResponse); // Verifica la respuesta de la API
        console.log(departamentosResponse); // Verifica la respuesta de la API
        console.log(directoresResponse); // Verifica la respuesta de la API

        if (departamentosResponse && departamentosResponse.data) {
          const departamentosData = departamentosResponse.data;
          setDepartamentos(departamentosData.map(item => item.departamento));
          setCiudades(departamentosData.flatMap(item =>
            item.ciudades.map(ciudad => ({ nombre: ciudad, departamento: item.departamento }))
          ));
        } else {
          console.error('Error fetching departamentos-ciudades:', departamentosResponse);
        }

        setSedes(sedesResponse.data);
        setDirectores(directoresResponse.data);
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

  const filteredSedes = sedes.filter(sede =>
    (sede.departamento?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (sede.ciudad?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (sede.nombre_sede?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const filteredDirectores = directores.filter(director =>
    (director.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (director.numero_documento || '').includes(searchTerm) ||
    (director.sede_id?.nombre_sede?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const handleDepartamentoChange = (e) => {
    const selectedDep = e.target.value;
    setSelectedDepartamento(selectedDep);
    setSelectedCiudad('');
  };

  const handleCiudadChange = (e) => {
    setSelectedCiudad(e.target.value);
  };

  const handleSubmitSede = async (e) => {
    e.preventDefault()
    try {
      await api.post('/sedes/crear', { nombre_sede: sedeNombre, departamento: selectedDepartamento, ciudad: selectedCiudad })
      setToastMessage('Sede creada exitosamente')
      setShowToast(true)
      setShowCreateSedeForm(false)
      // Recargar las sedes
      const sedesResponse = await api.get('/sedes/');
      setSedes(sedesResponse.data);
    } catch (error) {
      console.error('Error creating sede:', error)
      setToastMessage('Error al crear la sede')
      setShowToast(true)
    }
  }

  const handleSubmitDirector = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/registrarUsuario', {
        nombre: directorNombre,
        apellido,
        numero_documento: directorNumeroDocumento,
        tipo_documento: tipoDocumento,
        telefono,
        contra,
        sede_id: selectedSede,
        rol: 'Director'
      })
      setToastMessage('Director creado exitosamente')
      setShowToast(true)
      setShowCreateDirectorForm(false)
      const directoresResponse = await api.get('/auth/usuarios-por-rol?rol=Director');
      setDirectores(directoresResponse.data);
    } catch (error) {
      console.error('Error creating director:', error)
      setToastMessage('Error al crear el director')
      setShowToast(true)
    }
  }

  const handleEditSede = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/sedes/actualizar/${selectedItemForEdit.id_sede}`, {
        nombre_sede: sedeNombre,
        departamento: selectedDepartamento,
        ciudad: selectedCiudad
      })
      setToastMessage('Sede actualizada exitosamente')
      setShowToast(true)
      setShowEditSedeForm(false)
      const sedesResponse = await api.get('/sedes/');
      setSedes(sedesResponse.data);
    } catch (error) {
      console.error('Error updating sede:', error)
      setToastMessage('Error al actualizar la sede')
      setShowToast(true)
    }
  }

  const handleEditDirector = async (e) => {
    e.preventDefault()
    try {
      const userId = selectedItemForEdit.numero_documento; 
      const usuario = localStorage.getItem('id_usuario')
      const data = {
        nombre: directorNombre.trim(),
        apellido,
        numero_documento: directorNumeroDocumento,
        tipo_documento: tipoDocumento.trim(),
        telefono: telefono.trim(),
        sede_id: parseInt(selectedSede, 10),
        novedad: `Actualizado por el usuario con id: ${usuario}`
      };
      await api.put(`/auth/actualizar/${userId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setToastMessage('Director actualizado exitosamente')
      setShowToast(true)
      setShowEditDirectorForm(false)
      const directoresResponse = await api.get('/auth/usuarios-por-rol?rol=Director');
      setDirectores(directoresResponse.data);
    } catch (error) {
      console.error('Error updating director:', error)
      setToastMessage('Error al actualizar el director')
      setShowToast(true)
    }
  }

  const handleDeleteSede = async () => {
    try {
      await api.delete(`/sedes/borrar/${setDirectorNumeroDocumento.id_sede}`)
      setToastMessage('Sede eliminada exitosamente')
      setShowToast(true)
      setShowDeleteSedeConfirm(false)
      const sedesResponse = await api.get('/sedes/');
      setSedes(sedesResponse.data);
    } catch (error) {
      console.error('Error deleting sede:', error)
      setToastMessage('Error al eliminar la sede')
      setShowToast(true)
    }
  }

  const handleDeleteDirector = async () => {
    try {
      const userId = selectedItemForDelete.id_usuario; // Utiliza el ID del usuario en lugar del número de la fila
      await api.delete(`/auth/usuarios/${userId}`)
      setToastMessage('Director eliminado exitosamente')
      setShowToast(true)
      setShowDeleteDirectorConfirm(false)
      const directoresResponse = await api.get('/auth/usuarios-por-rol?rol=Director');
      setDirectores(directoresResponse.data);
    } catch (error) {
      console.error('Error deleting director:', error)
      setToastMessage('Error al eliminar el director')
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
          <h2 className="text-2xl font-bold mb-6">SuperAdmin - Gestión de Sedes y Directores de Sede</h2>
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
                onClick={() => setActiveTable('sedes')}
                className={`py-2 px-4 border rounded ${activeTable === 'sedes' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}
              >
                Sedes
              </button>
              <button
                onClick={() => setActiveTable('directores')}
                className={`py-2 px-4 border rounded ${activeTable === 'directores' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}
              >
                Directores
              </button>
            </div>
            <div className="space-x-2">
              <button
                className="py-2 px-4 border rounded bg-green-500 text-white"
                onClick={() => setShowCreateSedeForm(true)}
              >
                Crear Sede
              </button>
              <button
                className="py-2 px-4 border rounded bg-orange-500 text-white"
                onClick={() => setShowCreateDirectorForm(true)}
              >
                Crear Director
              </button>
            </div>
          </div>

          {/* Tablas */}
          {activeTable === 'sedes' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de Sede</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSedes.map((sede) => (
                    <tr key={sede.id_sede}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sede.departamento}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sede.ciudad}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sede.nombre_sede}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => {
                            setSelectedItemForEdit(sede);
                            setSedeNombre(sede.nombre_sede);
                            setSelectedDepartamento(sede.departamento);
                            setSelectedCiudad(sede.ciudad);
                            setShowEditSedeForm(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItemForDelete(sede);
                            setShowDeleteSedeConfirm(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTable === 'directores' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Documento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDirectores.map((director) => (
                    <tr key={director.id_usuario}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{director.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{director.numero_documento}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sedes.find(sede => sede.id_sede === director.sede_id)?.nombre_sede}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => {
                            setSelectedItemForEdit(director);
                            setDirectorNombre(director.nombre);
                            setApellido(director.apellido);
                            setDirectorNumeroDocumento(director.numero_documento);
                            setTipoDocumento(director.tipo_documento);
                            setTelefono(director.telefono);
                            setSelectedSede(director.sede_id?.id_sede);
                            setShowEditDirectorForm(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItemForDelete(director);
                            setShowDeleteDirectorConfirm(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Formularios y modales */}
          {showCreateSedeForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-4">Crear Nueva Sede</h3>
                <form onSubmit={handleSubmitSede}>
                  <div className="mb-4">
                    <label htmlFor="nombreSede" className="block text-sm font-medium text-gray-700">Nombre de la Sede</label>
                    <input
                      type="text"
                      id="nombreSede"
                      value={sedeNombre}
                      onChange={(e) => setSedeNombre(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Departamento</label>
                    <select
                      id="departamento"
                      value={selectedDepartamento}
                      onChange={handleDepartamentoChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="">Seleccione un departamento</option>
                      {departamentos.map((dep, index) => (
                        <option key={index} value={dep}>{dep}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">Ciudad</label>
                    <select
                      id="ciudad"
                      value={selectedCiudad}
                      onChange={handleCiudadChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="">Seleccione una ciudad</option>
                      {ciudades
                        .filter(ciudad => !selectedDepartamento || ciudad.departamento === selectedDepartamento)
                        .map((ciudad, index) => (
                          <option key={index} value={ciudad.nombre}>{ciudad.nombre}</option>
                        ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateSedeForm(false)}
                      className="py-2 px-4 border rounded bg-gray-300 text-black"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 border rounded bg-blue-500 text-white"
                    >
                      Crear Sede
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showCreateDirectorForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-4">Crear Nuevo Director</h3>
                <form onSubmit={handleSubmitDirector}>
                  <div className="flex flex-wrap justify-center">
                    <div className="w-1/2 pr-4">
                      <div className="mb-2">
                        <label htmlFor="nombreDirector" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                          type="text"
                          id="nombreDirector"
                          value={directorNombre}
                          onChange={(e) => setDirectorNombre(e.target.value)}
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
                          value={directorNumeroDocumento}
                          onChange={(e) => setDirectorNumeroDocumento(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label htmlFor="Rol" className="block text-sm font-medium text-gray-700">Rol</label>
                        <input
                          type="text"
                          id="Rol"
                          value='Director'
                          onChange={(e) => setRol(e.target.value)}
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
                      <div className="mb-2">
                        <label htmlFor="sede" className="block text-sm font-medium text-gray-700">Sede</label>
                        <select
                          id="sede"
                          value={selectedSede}
                          onChange={(e) => setSelectedSede(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded"
                          required
                        >
                          <option value="">Seleccione una sede</option>
                          {sedes.map((sede) => (
                            <option key={sede.id_sede} value={sede.id_sede}>{sede.nombre_sede}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <input type="hidden" id="rol" value="Director" />
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowCreateDirectorForm(false)}
                      className="py-2 px-4 border rounded bg-gray-300 text-black"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 border rounded bg-blue-500 text-white"
                    >
                      Crear Director
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showEditSedeForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-4">Editar Sede</h3>
                <form onSubmit={handleEditSede}>
                  <div className="mb-4">
                    <label htmlFor="nombreSede" className="block text-sm font-medium text-gray-700">Nombre de la Sede</label>
                    <input
                      type="text"
                      id="nombreSede"
                      value={sedeNombre}
                      onChange={(e) => setSedeNombre(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Departamento</label>
                    <select
                      id="departamento"
                      value={selectedDepartamento}
                      onChange={handleDepartamentoChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="">Seleccione un departamento</option>
                      {departamentos.map((dep, index) => (
                        <option key={index} value={dep}>{dep}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">Ciudad</label>
                    <select
                      id="ciudad"
                      value={selectedCiudad}
                      onChange={handleCiudadChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="">Seleccione una ciudad</option>
                      {ciudades
                        .filter(ciudad => !selectedDepartamento || ciudad.departamento === selectedDepartamento)
                        .map((ciudad, index) => (
                          <option key={index} value={ciudad.nombre}>{ciudad.nombre}</option>
                        ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowEditSedeForm(false)}
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

          {showEditDirectorForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-4">Editar Director</h3>
                <form onSubmit={handleEditDirector}>
                  <input type="hidden" name="_method" value="PUT" />
                  <div className="flex flex-wrap justify-center">
                    <div className="w-1/2 pr-4">
                      <div className="mb-2">
                        <label htmlFor="nombreDirector" className="block text-sm font-medium text-gray-700">Nombre del Director</label>
                        <input
                          type="text"
                          id="nombreDirector"
                          value={directorNombre}
                          onChange={(e) => setDirectorNombre(e.target.value)}
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
                          value={directorNumeroDocumento}
                          onChange={(e) => setDirectorNumeroDocumento(e.target.value)}
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
                        <label htmlFor="sede" className="block text-sm font-medium text-gray-700">Sede</label>
                        <select
                          id="sede"
                          value={selectedSede}
                          onChange={(e) => setSelectedSede(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded"
                          required
                        >
                          <option value="">Seleccione una sede</option>
                          {sedes.map((sede) => (
                            <option key={sede.id_sede} value={sede.id_sede}>{sede.nombre_sede}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowEditDirectorForm(false)}
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

          {showDeleteSedeConfirm && (
            <Dialog open={showDeleteSedeConfirm} onOpenChange={setShowDeleteSedeConfirm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Eliminación de Sede</DialogTitle>
                </DialogHeader>
                <p>¿Estás seguro de que quieres eliminar esta sede?</p>
                <div className="flex justify-end space-x-2">
                  <Button onClick={handleDeleteSede} variant="destructive">Sí</Button>
                  <Button onClick={() => setShowDeleteSedeConfirm(false)} variant="outline">No</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {showDeleteDirectorConfirm && (
            <Dialog open={showDeleteDirectorConfirm} onOpenChange={setShowDeleteDirectorConfirm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Eliminación de Director</DialogTitle>
                </DialogHeader>
                <p>¿Estás seguro de que quieres eliminar este director?</p>
                <div className="flex justify-end space-x-2">
                  <Button onClick={handleDeleteDirector} variant="destructive">Sí</Button>
                  <Button onClick={() => setShowDeleteDirectorConfirm(false)} variant="outline">No</Button>
                </div>
              </DialogContent>
            </Dialog>
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

export default withAuth(SuperAdmin, ['SuperAdmin'])