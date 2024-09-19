// components/CreateSedeForm.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const CreateSedeForm = ({ onSubmit }) => {
    const [departamento, setDepartamento] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [nombreSede, setNombreSede] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { departamento, ciudad, nombreSede };
        onSubmit(data);
        return false;
      };

    useEffect(() => {
        axios.get('/auth/departamentos-ciudades')
            .then(response => {
                setSedes(response.data);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    })

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Departamento:
                <select onChange={handleDepartamentoChange} value={selectedDepartamento} className="block mb-2 p-2 border border-gray-300 rounded w-full">
                    <option value="">Seleccione un departamento</option>
                    {departamentos.map((dep) => (
                        <option key={dep} value={dep}>{dep}</option>
                    ))}
                </select>
            </label>
            <label>
                <select onChange={handleCiudadChange} value={selectedCiudad} className="block mb-2 p-2 border border-gray-300 rounded w-full">
                    <option value="">Seleccione una ciudad</option>
                    {ciudades
                        .filter(ciudad => !selectedDepartamento || ciudad.departamento === selectedDepartamento)
                        .map((ciudad) => (
                            <option key={ciudad.nombre} value={ciudad.nombre}>{ciudad.nombre}</option>
                        ))}
                </select>
            </label>
            <label>
                Nombre de Sede:
                <input type="text" value={nombreSede} onChange={(e) => setNombreSede(e.target.value)} />
            </label>
            <button type="submit">Crear Sede</button>
        </form>
    );
};

export default CreateSedeForm;