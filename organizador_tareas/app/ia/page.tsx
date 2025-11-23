"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Tarea = {
  id: number;
  nombre: string;
  idPrioridad: number | null;
  idEstado: number | null;
  fechaEntrega: string | null;
  tiempoEstimadoMin: number | null;
};

export default function IA() {
  const [respuesta, setRespuesta] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [preguntaUsuario, setPreguntaUsuario] = useState("");
  
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuario_organizador');
    if (!storedUser) {
      router.push('/');
    }
  }, []);

  const generarAnalisis = (tareas: Tarea[], tipo: 'general' | 'urgente' | 'tiempo') => {
    const pendientes = tareas.filter(t => t.idEstado !== 3);
    const altas = pendientes.filter(t => t.idPrioridad === 3);

    if (pendientes.length === 0) {
      return "¡Increíble! No tienes tareas pendientes en este momento. Es un buen momento para descansar o aprender algo nuevo.";
    }

    if (tipo === 'urgente') {
      if (altas.length > 0) {
        return `Atención: Tienes ${altas.length} tareas de PRIORIDAD ALTA pendientes. Te recomiendo fuertemente comenzar por "${altas[0].nombre}". No lo dejes para después.`;
      } else {
        return "Buenas noticias: No tienes tareas urgentes (Alta prioridad). Puedes trabajar con calma en tus pendientes de prioridad media o baja.";
      }
    }

    if (tipo === 'tiempo') {
      const minutosTotales = pendientes.reduce((acc, t) => acc + (t.tiempoEstimadoMin || 0), 0);
      const horas = Math.floor(minutosTotales / 60);
      const mins = minutosTotales % 60;
      
      if (minutosTotales === 0) return "No has definido tiempos estimados para tus tareas, así que no puedo calcular tu agenda. Intenta editar tus tareas agregando una duración.";

      return `Calculo que necesitas aproximadamente ${horas} horas y ${mins} minutos para terminar todo lo pendiente. Si tienes poco tiempo hoy, enfócate en las tareas más cortas.`;
    }
    return `Analizando tu base de datos... Veo que tienes ${pendientes.length} tareas pendientes en total. ${altas.length > 0 ? `De ellas, ${altas.length} son críticas.` : "Todo parece estar bajo control."} La clave de la productividad es la constancia. ¡Tú puedes!`;
  };

  const consultarIA = async (tipo: 'general' | 'urgente' | 'tiempo' = 'general') => {
    setLoading(true);
    setRespuesta("Conectando con tu base de datos y analizando prioridades...");

    try {
      const storedUser = sessionStorage.getItem('usuario_organizador');
      if (!storedUser) {
        router.push('/');
        return;
      }
      const user = JSON.parse(storedUser);
      const response = await fetch(`${API_URL}/api/v1/tareas?userId=${user.id}`);
      
      if (!response.ok) throw new Error("Error al conectar con el cerebro");
      
      const tareas: Tarea[] = await response.json();
      setTimeout(() => {
        const analisis = generarAnalisis(tareas || [], tipo);
        setRespuesta(analisis);
        setLoading(false);
      }, 800);

    } catch (error) {
      console.error(error);
      setRespuesta("Lo siento, hubo un error al intentar leer tus tareas. Verifica que el backend esté funcionando.");
      setLoading(false);
    }
  };

  const handlePreguntaSubmit = () => {
    if (!preguntaUsuario.trim()) return;
    consultarIA('general');
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-6 md:p-8 w-full">
        <h2 className="text-[#6a11cb] text-2xl font-bold mb-6 text-center">
          Asistente Inteligente de Productividad
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <input 
              type="text" 
              placeholder="Pregúntame: ¿Qué debería hacer hoy?" 
              className="form-input-tailwind flex-1"
              value={preguntaUsuario}
              onChange={(e) => setPreguntaUsuario(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePreguntaSubmit()}
            />
            <button 
              onClick={handlePreguntaSubmit}
              className="boton-confirmar-tailwind whitespace-nowrap sm:w-auto"
            >
              Consultar
            </button>
          </div>
          <div className="border-t border-gray-200 my-2"></div>
          <p className="text-gray-500 text-sm text-center">O selecciona un análisis rápido:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              onClick={() => consultarIA('general')}
              className="bg-purple-100 text-[#6a11cb] py-3 px-4 rounded-lg font-semibold hover:bg-purple-200 transition-colors"
            >
              📝 Resumen General
            </button>
            <button 
              onClick={() => consultarIA('urgente')}
              className="bg-red-100 text-red-600 py-3 px-4 rounded-lg font-semibold hover:bg-red-200 transition-colors"
            >
              🔥 ¿Qué es Urgente?
            </button>
            <button 
              onClick={() => consultarIA('tiempo')}
              className="bg-blue-100 text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
            >
              ⏱️ Análisis de Tiempo
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-6 md:p-8 leading-relaxed text-base text-[#2c3e50]">
        <h2 className="text-[#6a11cb] text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <span>🤖</span> Respuesta de la IA
        </h2>
        <div className={`rounded-2xl shadow-inner p-6 leading-relaxed text-base min-h-[120px] flex items-center justify-center transition-colors duration-500 ${
          loading ? "bg-gray-100 text-gray-500" : "bg-[#410a7c] text-white"
        }`}>
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
          ) : (
            <p className="text-lg text-center">
              {respuesta || "Hola, soy tu asistente. Utiliza las opciones de arriba para analizar tus tareas y optimizar tu tiempo."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}