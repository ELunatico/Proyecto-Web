"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [esRegistro, setEsRegistro] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', password: '', id: '' });
  const [error, setError] = useState("");
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuario_organizador');
    if (storedUser) {
      router.push('/calendario');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const endpoint = esRegistro ? '/api/v1/register' : '/api/v1/login';

    const payload = esRegistro 
      ? { nombre: form.nombre, email: form.email, password: form.password }
      : { id: parseInt(form.id), password: form.password };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(esRegistro ? "Error al registrarse" : "ID o Contraseña incorrectos");
      }

      const userData = await res.json();

      if (esRegistro) {
        alert(`¡Registro exitoso!\n\nTU ID DE USUARIO ES: ${userData.id}\n\nGuárdalo, lo necesitarás para entrar.`);
        setEsRegistro(false);
        setForm({ ...form, id: String(userData.id), password: '' });
      } else {
        sessionStorage.setItem('usuario_organizador', JSON.stringify(userData));
        router.push('/calendario');
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-8 w-full max-w-md transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="text-[#6a11cb] text-3xl font-bold mb-2">
            {esRegistro ? "Crear Cuenta" : "Bienvenido"}
          </h1>
          <p className="text-gray-500 text-sm">
            {esRegistro ? "Ingresa tus datos para comenzar" : "Ingresa tu ID y contraseña"}
          </p>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center text-sm border border-red-200 font-medium">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {esRegistro && (
            <>
              <div>
                <label className="block mb-2 font-semibold text-[#2c3e50] text-sm">Nombre</label>
                <input 
                  type="text" 
                  className="form-input-tailwind"
                  placeholder="Tu nombre"
                  onChange={e => setForm({...form, nombre: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-[#2c3e50] text-sm">Correo Electrónico</label>
                <input 
                  type="email" 
                  className="form-input-tailwind"
                  placeholder="ejemplo@correo.com"
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
            </>
          )}
          {!esRegistro && (
            <div>
              <label className="block mb-2 font-semibold text-[#2c3e50] text-sm">ID de Usuario</label>
              <input 
                type="number" 
                className="form-input-tailwind"
                placeholder="Ej. 15"
                value={form.id}
                onChange={e => setForm({...form, id: e.target.value})}
                required
              />
            </div>
          )}
          <div>
            <label className="block mb-2 font-semibold text-[#2c3e50] text-sm">Contraseña</label>
            <input 
              type="password" 
              className="form-input-tailwind"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="boton-confirmar-tailwind mt-2">
            {esRegistro ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </form>
        <div className="mt-6 text-center pt-4 border-t border-gray-100">
          <p className="text-gray-500 text-sm mb-2">
            {esRegistro ? "¿Ya tienes cuenta?" : "¿Eres nuevo aquí?"}
          </p>
          <button 
            onClick={() => { setEsRegistro(!esRegistro); setError(""); }} 
            className="text-[#6a11cb] font-bold hover:text-[#410a7c] transition-colors text-sm hover:underline"
          >
            {esRegistro ? "Inicia Sesión con tu ID" : "Regístrate para obtener tu ID"}
          </button>
        </div>
      </div>
    </div>
  );
}