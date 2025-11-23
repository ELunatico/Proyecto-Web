"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('usuario_organizador');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserId(String(user.id));
        }
    }, [pathname]);

    if (pathname === "/") {
        return null;
    }

    const handleLogout = () => {
        if (window.confirm("¿Cerrar sesión?")) {
            sessionStorage.removeItem('usuario_organizador');
            router.push('/');
        }
    };

    return (
        <nav className="bg-gradient-to-r from-[#8a2be2] to-[#6a11cb] text-white shadow-lg w-full mb-8 sticky top-0 z-50">
            <div className="flex justify-between h-[64px] max-w-7xl mx-auto items-center px-6">
                <div className="flex flex-1 justify-start gap-1 h-full">
                    <Link href="/calendario" className={`nav-button-tailwind ${pathname === '/calendario' ? 'bg-white/20' : ''}`}>
                        Calendario
                    </Link>
                    <Link href="/dashboard" className={`nav-button-tailwind ${pathname === '/dashboard' ? 'bg-white/20' : ''}`}>
                        Dashboard
                    </Link>
                    <Link href="/tareas" className={`nav-button-tailwind ${pathname === '/tareas' ? 'bg-white/20' : ''}`}>
                        Tareas
                    </Link>
                    <Link href="/ia" className={`nav-button-tailwind ${pathname === '/ia' ? 'bg-white/20' : ''}`}>
                        IA
                    </Link>
                </div>
                {userId && (
                    <button 
                        onClick={handleLogout}
                        className="ml-4 group flex items-center gap-3 bg-black/20 hover:bg-white/20 backdrop-blur-sm border border-white/10 px-5 py-2 rounded-full transition-all duration-300"
                        title="Clic para cerrar sesión"
                    >
                        <div className="flex flex-col items-end leading-none">
                            <span className="text-[10px] uppercase tracking-wider opacity-70 group-hover:text-red-200">Usuario ID</span>
                            <span className="font-bold text-lg">{userId}</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <span className="text-xs">➜</span>
                        </div>
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;