import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";

function UserForm({ userData, onSubmit, isEditMode = false, currentUser, onClose }) {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        tipo_documento: '',
        numero_documento: '',
        telefono: '',
        sede_id: currentUser ? currentUser.sede_id : '',
        rol: currentUser && currentUser.rol === 'Director' ? 'Vigilante' : 'Usuario',
        contra: '',  // Agregar el campo de contraseña
    });

    const [documentTypes, setDocumentTypes] = useState([
        { id: "CC", name: "Cédula de Ciudadanía" },
        { id: "TI", name: "Tarjeta de Identidad" },
        { id: "CE", name: "Cédula de Extranjería" },
        { id: "OT", name: "Otro" },
    ]);

    useEffect(() => {
        if (userData && isEditMode) {
            setFormData({
                nombre: userData.nombre,
                apellido: userData.apellido,
                tipo_documento: userData.tipo_documento,
                numero_documento: userData.numero_documento,
                telefono: userData.telefono,
                sede_id: userData.sede_id,
                rol: userData.rol,
                contra: '',  // Resetea la contraseña en modo edición
            });
        }
    }, [userData, isEditMode]);

    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                sede_id: currentUser.sede_id,
                rol: currentUser.rol === 'Director' ? 'Vigilante' : 'Usuario',
            }));
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-4">{isEditMode ? 'Editar Usuario' : 'Crear Usuario'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap">
                        <div className="w-1/2 pr-4">
                            <div className="mb-2">
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="tipo_documento" className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
                                <select
                                    name="tipo_documento"
                                    value={formData.tipo_documento}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
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
                                <label htmlFor="numero_documento" className="block text-sm font-medium text-gray-700">Número de Documento</label>
                                <input
                                    type="text"
                                    name="numero_documento"
                                    value={formData.numero_documento}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                        <div className="w-1/2 pl-4">
                            <div className="mb-2">
                                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="contra" className="block text-sm font-medium text-gray-700">Contraseña</label>
                                <input
                                    type="password"
                                    name="contra"  // Este debe coincidir con el nombre en formData
                                    value={formData.contra}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4 space-x-2">
                        <Button
                            type="button"
                            onClick={() => onClose}  // Cerrar el modal
                            className="py-2 px-4 border rounded bg-gray-300 text-black"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="py-2 px-4 border rounded bg-blue-500 text-white"
                        >
                            {isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserForm;