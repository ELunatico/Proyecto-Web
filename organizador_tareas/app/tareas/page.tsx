"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Tarea = {
  id: number;
  nombre: string;
  descripcion: string | null;
  fechaEntrega: string | null;
  tiempoEstimadoMin: number | null;
  fechaCreacion: string;
  idMateria: number | null;
  idPrioridad: number | null;
  idEstado: number | null;
  idUsuario: number;
};

type FormState = {
  nombre: string;
  fechaEntrega: string;
  prioridad: string;
  tiempo: string;
};

const PrioridadLabel = ({ id }: { id: number | null }) => {
  if (id === 3) return <span className="font-bold text-[#e74c3c]">Alta</span>;
  if (id === 2) return <span className="font-bold text-[#f39c12]">Media</span>;
  if (id === 1) return <span className="font-bold text-[#27ae60]">Baja</span>;
  return <span className="font-bold text-gray-400">N/A</span>;
};

const TiempoLabel = ({ minutos }: { minutos: number | null }) => {
  if (!minutos) return "N/A";
  if (minutos >= 60) {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins > 0 ? `${mins}m` : ''}`;
  }
  return `${minutos}m`;
};

export default function Tareas() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [usuario, setUsuario] = useState<{ id: number, nombre: string } | null>(null);
  
  const [form, setForm] = useState<FormState>({
    nombre: '',
    fechaEntrega: '',
    prioridad: '',
    tiempo: '',
  });

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuario_organizador');
    if (!storedUser) {
      router.push('/');
      return;
    }
    const userParsed = JSON.parse(storedUser);
    setUsuario(userParsed);
    fetchTareas(userParsed.id);
  }, []);

  const fetchTareas = async (userId: number) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/tareas?userId=${userId}`);
      if (!response.ok) throw new Error('Error al cargar las tareas');
      const data: Tarea[] = await response.json();
      const tareasOrdenadas = (data || []).sort((a, b) => {
        if (a.idEstado === b.idEstado) return 0;
        if (a.idEstado === 3) return 1;
        if (b.idEstado === 3) return -1;
        return 0;
      });

      setTareas(tareasOrdenadas);
    } catch (error) {
      console.error(error);
      setTareas([]);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    const nuevaTarea = {
      nombre: form.nombre,
      fechaEntrega: form.fechaEntrega ? new Date(form.fechaEntrega).toISOString() : null,
      idPrioridad: form.prioridad ? parseInt(form.prioridad) : null,
      tiempoEstimadoMin: form.tiempo ? parseInt(form.tiempo) : null,
      idEstado: 1,
      idUsuario: usuario.id
    };

    try {
      const response = await fetch(`${API_URL}/api/v1/tareas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaTarea),
      });
      if (!response.ok) throw new Error('Error al crear la tarea');
      
      setForm({ nombre: '', fechaEntrega: '', prioridad: '', tiempo: '' });
      fetchTareas(usuario.id);
    } catch (error) {
      console.error('Error al enviar la tarea:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!usuario) return;
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) return;

    try {
      const response = await fetch(`${API_URL}/api/v1/tareas/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar la tarea');
      fetchTareas(usuario.id);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleToggleEstado = async (tarea: Tarea) => {
    if (!usuario) return;
    const nuevoEstado = tarea.idEstado === 3 ? 1 : 3;

    try {
      const response = await fetch(`${API_URL}/api/v1/tareas/${tarea.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idEstado: nuevoEstado }),
      });

      if (!response.ok) throw new Error('Error al actualizar');
      fetchTareas(usuario.id);
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  if (!usuario) return null;
  return (
    <div className="flex flex-col gap-[30px]">
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-6 md:p-8 w-full">
        <h2 className="text-[#6a11cb] text-2xl font-bold mb-6 text-center">
          Agregar nueva tarea
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
          <div className="mb-4 md:col-span-2">
            <label htmlFor="nombre" className="block mb-2 font-semibold text-[#2c3e50]">Nombre de la tarea</label>
            <input type="text" id="nombre" placeholder="Ingresa el nombre de la tarea" className="form-input-tailwind" value={form.nombre} onChange={handleFormChange} required />
          </div>
          <div className="mb-4">
            <label htmlFor="fechaEntrega" className="block mb-2 font-semibold text-[#2c3e50]">Fecha de entrega</label>
            <input type="date" id="fechaEntrega" className="form-input-tailwind" value={form.fechaEntrega} onChange={handleFormChange} />
          </div>
          <div className="mb-4">
            <label htmlFor="prioridad" className="block mb-2 font-semibold text-[#2c3e50]">Prioridad</label>
            <select id="prioridad" className="form-input-tailwind" value={form.prioridad} onChange={handleFormChange}>
              <option value="">Selecciona la Prioridad</option>
              <option value="3">Alta</option>
              <option value="2">Media</option>
              <option value="1">Baja</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="tiempo" className="block mb-2 font-semibold text-[#2c3e50]">Tiempo</label>
            <select id="tiempo" className="form-input-tailwind" value={form.tiempo} onChange={handleFormChange}>
              <option value="">Selecciona</option>
              <option value="300">5+ hrs</option>
              <option value="240">4 hrs</option>
              <option value="180">3 hrs</option>
              <option value="120">2 hrs</option>
              <option value="60">1 hr</option>
              <option value="30">30 mins</option>
            </select>
          </div>
          <button type="submit" className="boton-confirmar-tailwind md:col-span-2">Crear tarea</button>
        </form>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-6 md:p-8 w-full">
        <h2 className="text-[#6a11cb] text-2xl font-bold mb-6 text-center">Lista de Tareas</h2>
        
        <div className="overflow-x-auto">
          <ul className="list-none p-0 min-w-[600px] md:min-w-full">
            <li className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_1.2fr] gap-4 font-bold p-4 bg-[#f0e6ff] rounded-lg mb-3">
              <span>Nombre</span>
              <span>Fecha de entrega</span>
              <span>Prioridad</span>
              <span>Tiempo</span>
              <span>Acciones</span>
            </li>
            {tareas.length > 0 ? (
              tareas.map((tarea) => (
                <li 
                  key={tarea.id} 
                  className={`lista-item-tailwind md:grid-cols-[2fr_1.5fr_1fr_1fr_1.2fr] ${tarea.idEstado === 3 ? 'opacity-60 bg-gray-100' : ''}`}
                >
                  <span className="font-bold md:font-normal flex flex-col">
                    <span className="md:hidden">Nombre: </span>
                    <span className={tarea.idEstado === 3 ? "line-through text-gray-500" : ""}>
                      {tarea.nombre}
                    </span>
                  </span>
                  <span>
                    <span className="md:hidden">Entrega: </span>
                    {tarea.fechaEntrega ? new Date(tarea.fechaEntrega).toLocaleDateString() : 'N/A'}
                  </span>
                  <span className="font-bold">
                    <span className="md:hidden text-gray-700">Prioridad: </span>
                    <PrioridadLabel id={tarea.idPrioridad} />
                  </span>
                  <span>
                    <span className="md:hidden">Tiempo: </span>
                    <TiempoLabel minutos={tarea.tiempoEstimadoMin} />
                  </span>
                  <span className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleEstado(tarea)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        tarea.idEstado === 3 
                          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {tarea.idEstado === 3 ? 'Desmarcar' : 'Completar'}
                    </button>
                    <button 
                      onClick={() => handleDelete(tarea.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Borrar
                    </button>
                  </span>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No hay tareas pendientes para ti.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}