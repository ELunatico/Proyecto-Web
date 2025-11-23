"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';

type Tarea = {
  id: number;
  nombre: string;
  fechaEntrega: string | null;
  idPrioridad: number | null;
  idEstado: number | null;
};

export default function Calendario() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter(); 

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuario_organizador');
    if (!storedUser) {
      router.push('/'); 
      return;
    }
    const user = JSON.parse(storedUser);

    const fetchTareas = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/tareas?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setTareas(data || []);
        }
      } catch (error) {
        console.error("Error cargando tareas:", error);
      }
    };
    fetchTareas();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getTasksForDay = (day: number) => {
    const dateToCheck = new Date(year, month, day);
    return tareas.filter(t => {
      if (!t.fechaEntrega) return false;
      const tDate = new Date(t.fechaEntrega);
      return tDate.getDate() === dateToCheck.getDate() && 
             tDate.getMonth() === dateToCheck.getMonth() && 
             tDate.getFullYear() === dateToCheck.getFullYear();
    });
  };

  const selectedTasks = tareas.filter(t => {
    if (!t.fechaEntrega) return false;
    const tDate = new Date(t.fechaEntrega);
    return tDate.getDate() === selectedDate.getDate() && 
           tDate.getMonth() === selectedDate.getMonth() && 
           tDate.getFullYear() === selectedDate.getFullYear();
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg">
        <button onClick={prevMonth} className="p-2 hover:bg-purple-100 rounded-full text-[#6a11cb] font-bold text-xl transition-colors">&lt;</button>
        <h2 className="text-2xl font-bold text-[#2c3e50] capitalize">{monthNames[month]} {year}</h2>
        <button onClick={nextMonth} className="p-2 hover:bg-purple-100 rounded-full text-[#6a11cb] font-bold text-xl transition-colors">&gt;</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map(day => <div key={day} className="text-center font-semibold text-gray-400 text-sm uppercase">{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="aspect-square"></div>)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const currentDayDate = new Date(year, month, day);
              const tasksForThisDay = getTasksForDay(day);
              const hasTasks = tasksForThisDay.length > 0;
              const isSelected = isSameDay(currentDayDate, selectedDate);
              const isToday = isSameDay(currentDayDate, new Date());

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(currentDayDate)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all ${isSelected ? 'bg-[#6a11cb] text-white shadow-md transform scale-105' : 'hover:bg-purple-50 text-gray-700'} ${isToday && !isSelected ? 'border-2 border-[#6a11cb]' : ''}`}
                >
                  <span>{day}</span>
                  {hasTasks && (
                    <div className="flex gap-1 mt-1">
                      {tasksForThisDay.slice(0, 3).map((t, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#e74c3c]'}`}></div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col h-full">
          <h3 className="text-xl font-bold text-[#6a11cb] mb-4 border-b pb-2">Tareas para el {selectedDate.getDate()}</h3>
          <div className="flex-1 overflow-y-auto">
            {selectedTasks.length > 0 ? (
              <ul className="space-y-3">
                {selectedTasks.map(t => (
                  <li key={t.id} className={`p-3 rounded-lg border-l-4 ${t.idEstado === 3 ? 'bg-gray-50 border-gray-300 opacity-60' : 'bg-purple-50 border-[#8a2be2]'}`}>
                    <p className={`font-semibold ${t.idEstado === 3 ? 'line-through' : ''}`}>{t.nombre}</p>
                    <div className="flex justify-between text-xs mt-1 text-gray-500">
                      <span>{t.idPrioridad === 3 ? 'Alta' : 'Normal'}</span>
                      <span>{t.idEstado === 3 ? 'Completada' : 'Pendiente'}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                <span className="text-4xl mb-2">📅</span>
                <p>No hay entregas.</p>
                <Link href="/tareas" className="mt-4 text-[#6a11cb] text-sm hover:underline">+ Agregar tarea</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}