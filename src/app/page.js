'use client';
import { useState, useEffect } from "react";
import { Car, BadgeCheck, MapPin, Check, AlertCircle, Clock, Trash2 } from "lucide-react";

export default function EstacionamientoForm() {
  const [vehiculo, setVehiculo] = useState("");
  const [patente, setPatente] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [status, setStatus] = useState(null);
  const [autos, setAutos] = useState([]);

  const fetchAutos = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);
      if (response.ok) {
        const data = await response.json();
        // Ordenar los autos por fecha, los más recientes primero
        const autosOrdenados = data.sort((a, b) => {
          return new Date(b.fecha) - new Date(a.fecha);
        });
        setAutos(autosOrdenados);
      }
    } catch (error) {
      console.error('Error al obtener la lista de autos:', error);
    }
  };

  useEffect(() => {
    fetchAutos();
    const interval = setInterval(fetchAutos, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { vehiculo, patente, ubicacion };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMensaje("¡Registro de estacionamiento exitoso!");
        setStatus("success");
        setVehiculo("");
        setPatente("");
        setUbicacion("");
        fetchAutos(); // Actualizar la lista después de un registro exitoso
      } else {
        setMensaje("Error al guardar los datos. Por favor, intente nuevamente.");
        setStatus("error");
      }
    } catch (error) {
      setMensaje("Error en la conexión con el servidor. Verifique su conexión.");
      setStatus("error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden p-8 border border-gray-300">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Registro de Estacionamiento
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Car className="w-5 h-5 inline-block mr-2 text-amber-500" /> Vehículo
          </label>
          <input
            type="text"
            value={vehiculo}
            onChange={(e) => setVehiculo(e.target.value)}
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Ej: Toyota Corolla"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <BadgeCheck className="w-5 h-5 inline-block mr-2 text-amber-500" /> Patente
          </label>
          <input
            type="text"
            value={patente}
            onChange={(e) => setPatente(e.target.value)}
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Ej: ABC123"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-5 h-5 inline-block mr-2 text-amber-500" /> Ubicación
          </label>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Ej: D4"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="subscribe" className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
          <label htmlFor="subscribe" className="text-sm text-gray-700">Cupon de Estacionamiento Gratis</label>
        </div>

        <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg">
          Registrar
        </button>
      </form>

      {mensaje && (
        <div className={`mt-6 p-4 rounded-lg text-white flex items-center ${status === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {status === "success" ? <Check className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
          {mensaje}
        </div>
      )}
      
      {/* Lista de Autos */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Vehículos Registrados</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Ingreso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {autos.map((auto, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Car className="w-5 h-5 text-amber-500 mr-2" />
                      <span className="text-sm text-gray-900">{auto.vehiculo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BadgeCheck className="w-5 h-5 text-amber-500 mr-2" />
                      <span className="text-sm text-gray-900">{auto.patente}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-amber-500 mr-2" />
                      <span className="text-sm text-gray-900">{auto.ubicacion}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-amber-500 mr-2" />
                      <span className="text-sm text-gray-900">{new Date(auto.fecha).toLocaleString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
