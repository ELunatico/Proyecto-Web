"use client";

// ❌ import "./navbar.css" <-- ¡ASEGÚRATE DE BORRAR ESTA LÍNEA!

import Link from "next/link";

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-[#8a2be2] to-[#6a11cb] text-white shadow-lg w-full rounded-xl mb-[30px]">
      <div className="flex justify-center h-[60px] max-w-6xl mx-auto">
        
        <Link 
          href="/" 
          className="nav-button-tailwind"
        >
          Calendario
        </Link>
        <Link 
          href="/dashboard" 
          className="nav-button-tailwind"
        >
          Dashboard
        </Link>
        <Link 
          href="/tareas" 
          className="nav-button-tailwind"
        >
          Tareas
        </Link>
        <Link 
          href="/ia" 
          className="nav-button-tailwind"
        >
          IA
        </Link>

      </div>
      
      {/* Debido a que la animación ::after es muy específica, 
        es más limpio definirla en un solo lugar.
        La agregaremos en 'globals.css'
      */}
      
    </nav>
  );
}

export default Navbar;