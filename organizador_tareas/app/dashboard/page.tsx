"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Tarea = {
  id: number;
  nombre: string;
  idPrioridad: number | null;
  idEstado: number | null;
  fechaEntrega: string | null;
  tiempoEstimadoMin: number | null;
};

export default function Dashboard() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuario_organizador');
    if (!storedUser) { router.push('/'); return; }
    const user = JSON.parse(storedUser);

    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/tareas?userId=${user.id}`);
        if (response.ok) {
          const data: Tarea[] = await response.json();
          setTareas(data || []);
        }
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  
  const totalTareas = tareas.length;
  const pendientes = tareas.filter(t => t.idEstado !== 3);
  const numPendientes = pendientes.length;
  const completadas = tareas.filter(t => t.idEstado === 3).length;
  const porcentajeCompletado = totalTareas > 0 ? Math.round((completadas / totalTareas) * 100) : 0;
  const proximas = pendientes
    .filter(t => t.fechaEntrega)
    .sort((a, b) => new Date(a.fechaEntrega!).getTime() - new Date(b.fechaEntrega!).getTime())
    .slice(0, 3);

  const altas = pendientes.filter(t => t.idPrioridad === 3).length;
  const medias = pendientes.filter(t => t.idPrioridad === 2).length;
  const bajas = pendientes.filter(t => t.idPrioridad === 1).length;

  const minutosTotales = pendientes.reduce((acc, t) => acc + (t.tiempoEstimadoMin || 0), 0);
  const horasEstimadas = Math.floor(minutosTotales / 60);
  const StatCard = ({ title, count, color, icon, subtext }: any) => (
    <div className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 ${color} flex flex-col justify-between h-36 transition-transform hover:-translate-y-1`}>
      <div className="flex justify-between items-start">
        <h3 className="text-gray-500 font-semibold text-sm uppercase tracking-wider">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-4xl font-bold text-gray-800">{loading ? "-" : count}</p>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-[#6a11cb] mb-2">Dashboard General</h1>
        <p className="text-gray-600">Resumen de tu productividad en tiempo real.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tareas" count={totalTareas} color="border-blue-500" icon="" subtext="En tu historial" />
        <StatCard title="Pendientes" count={numPendientes} color="border-yellow-500" icon="" subtext="Por hacer" />
        <StatCard title="Prioridad Alta" count={altas} color="border-red-500" icon="" subtext="Requieren atención" />
        <StatCard title="Completadas" count={completadas} color="border-green-500" icon="" subtext={`${porcentajeCompletado}% del total`} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg lg:col-span-2">
          <h3 className="text-xl font-bold text-[#2c3e50] mb-4 flex items-center gap-2">
            Próximas Entregas
          </h3>
          <div className="space-y-3">
            {proximas.length > 0 ? (
              proximas.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-bold text-gray-800">{t.nombre}</p>
                    <p className="text-sm text-gray-500">
                      Vence: {new Date(t.fechaEntrega!).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    t.idPrioridad === 3 ? 'bg-red-100 text-red-600' : 
                    t.idPrioridad === 2 ? 'bg-orange-100 text-orange-600' : 
                    'bg-green-100 text-green-600'
                  }`}>
                    {t.idPrioridad === 3 ? 'Alta' : t.idPrioridad === 2 ? 'Media' : 'Baja'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No tienes fechas próximas pendientes.</p>
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
          <h3 className="text-xl font-bold text-[#2c3e50] mb-6"> Carga de Trabajo</h3>
          <div className="mb-8 text-center bg-purple-50 p-4 rounded-xl border border-purple-100">
            <span className="text-gray-500 text-sm block mb-1">Tiempo estimado para terminar</span>
            <span className="text-3xl font-extrabold text-[#6a11cb]">
              {horasEstimadas}h {(minutosTotales % 60)}m
            </span>
          </div>
          <div className="space-y-4 flex-1">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Urgentes (Alta)</span>
                <span className="font-bold text-gray-800">{altas}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${numPendientes ? (altas/numPendientes)*100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Regulares (Media)</span>
                <span className="font-bold text-gray-800">{medias}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: `${numPendientes ? (medias/numPendientes)*100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Tranquilas (Baja)</span>
                <span className="font-bold text-gray-800">{bajas}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${numPendientes ? (bajas/numPendientes)*100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}