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

  const [cuponGratis, setCuponGratis] = useState(false);
  const [tarifaPorHora, setTarifaPorHora] = useState("2.00");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { 
      vehiculo, 
      patente, 
      ubicacion,
      cupon_gratis: cuponGratis,
      tarifa_por_hora: tarifaPorHora
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}`,{
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
        setTarifaPorHora("2.00");
        setCuponGratis(false);
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
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden p-8 border border-gray-300">
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tarifa por hora ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={tarifaPorHora}
              onChange={(e) => setTarifaPorHora(e.target.value)}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="cuponGratis"
              checked={cuponGratis}
              onChange={(e) => setCuponGratis(e.target.checked)}
              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <label htmlFor="cuponGratis" className="text-sm text-gray-700">Cupón de Estacionamiento Gratis</label>
          </div>
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
      
      {/* Lista de Autos */}<h3 className="text-2xl font-bold text-center mt-8 text-gray-800 mb-4">Vehículos Registrados</h3>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }} className="mt-8">
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Ingreso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarifa/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total ($)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cupón</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">${auto.tarifa_por_hora}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">{auto.tiempo_estacionado}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${auto.cupon_gratis ? 'text-green-600' : 'text-gray-900'}`}>
                        ${auto.tarifa_actual}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${auto.cupon_gratis ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {auto.cupon_gratis ? 'Sí' : 'No'}
                      </span>
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
