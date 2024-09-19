import { useState, useEffect } from 'react';
import axios from 'axios'; // or your preferred HTTP client

export const CreateUsuarioForm = ({ onSubmit, userRole, userId }) => {
    const [tipoDocumento, setTipoDocumento] = useState('');
    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contra, setContra] = useState('');
    const [rol, setRol] = useState('');
    const [novedad, setNovedad] = useState('');
    const [documentTypes, setDocumentTypes] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setDocumentTypes([
            { id: 1, name: "Cédula" },
            { id: 2, name: "Tarjeta de Identidad" },
            { id: 3, name: "Otro" },
        ]);

        axios.get('/api/sedes') // or your API endpoint
            .then(response => {
                setSedes(response.data);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (userRole === 'superadmin') {
            setRol('director');
        } else if (userRole === 'director') {
            setRol('vigilante');
        } else if (userRole === 'vigilante') {
            setRol('usuario');
        }
    }, [userRole]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            tipoDocumento,
            numeroDocumento,
            nombre,
            apellido,
            telefono,
            contra,
            rol,
            novedad: `Creado por ${userRole} con id ${userId}`,
            sedeId: userId
        };
        onSubmit(userData);
    };

    if (loading) {
        return <p>Cargando...</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Tipo de Documento:
                <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
                    <option value="">Seleccione un tipo de documento</option>
                    {documentTypes.map((documentType) => (
                        <option key={documentType.id} value={documentType.id}>{documentType.name}</option>
                    ))}
                </select>
            </label>
            <label>
                Número de Documento:
                <input type="text" value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} />
            </label>
            <label>
                Nombre:
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>
            <label>
                Apellido:
                <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} />
            </label>
            <label>
                Teléfono:
                <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </label>
            <label>
                Contraseña:
                <input type="password" value={contra} onChange={(e) => setContra(e.target.value)} />
            </label>
            <label>
                Rol:
                <input type="text" value={rol} disabled />
            </label>
            <label>
                Novedad:
                <input type="text" value={novedad} disabled />
            </label>
            {userRole === 'superadmin' && (
                <label>
                    Sede Asignada:
                    <select value={sedes.id} onChange={(e) => setSedes(e.target.value)}>
                        <option value="">Seleccione una sede</option>
                        {sedes.map((sede) => (
                            <option key={sede.id} value={sede.id}>{sede.name}</option>
                        ))}
                    </select>
                </label>
            )}
            <button type="submit">Crear Director</button>
        </form>
    );
};