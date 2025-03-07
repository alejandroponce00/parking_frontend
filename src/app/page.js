'use client';
import { useState } from "react";
import { Car, BadgeCheck, MapPin, Check, AlertCircle } from "lucide-react";

export default function EstacionamientoForm() {
  const [vehiculo, setVehiculo] = useState("");
  const [patente, setPatente] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [status, setStatus] = useState(null);

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
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-2xl overflow-hidden p-8 border border-gray-300">
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
    </div>
  );
}
