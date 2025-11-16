function Tareas() {
  return (
    <div className="flex flex-col gap-[30px]">
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-6 md:p-8 w-full">
        <h2 className="text-[#6a11cb] text-2xl font-bold mb-6 text-center">
          Agregar nueva tarea
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-4 md:col-span-2">
            <label htmlFor="Nombretarea" className="block mb-2 font-semibold text-[#2c3e50]">
              Nombre de la tarea
            </label>
            <input 
              type="text" 
              id="Nombretarea" 
              placeholder="Ingresa el nombre de la tarea" 
              className="form-input-tailwind"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="FechaEntrega" className="block mb-2 font-semibold text-[#2c3e50]">
              Fecha de entrega
            </label>
            <input type="date" id="FechaEntrega" className="form-input-tailwind" />
          </div>
          <div className="mb-4">
            <label htmlFor="Prioridad" className="block mb-2 font-semibold text-[#2c3e50]">
              Prioridad
            </label>
            <select name="Prioridad" id="Prioridad" className="form-input-tailwind">
              <option value="">Selecciona la Prioridad</option>
              <option value="3">Alta</option>
              <option value="2">Media</option>
              <option value="1">Baja</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="Tiempo" className="block mb-2 font-semibold text-[#2c3e50]">
              Tiempo
            </label>
            <select name="Tiempo" id="Tiempo" className="form-input-tailwind">
              <option value="">Selecciona</option>
              <option value="6">5+ hrs</option>
              <option value="5">5 hrs</option>
              <option value="4">4 hrs</option>
              <option value="3">3 hrs</option>
              <option value="2">2 hrs</option>
              <option value="1">1 hr</option>
              <option value="0">30 mins</option>
            </select>
          </div>
          <button className="boton-confirmar-tailwind md:col-span-2">
            Crear tarea
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-6 md:p-8 w-full">
        <h2 className="text-[#6a11cb] text-2xl font-bold mb-6 text-center">
          Lista de Tareas
        </h2>
        <div className="overflow-x-auto">
          <ul className="list-none p-0 min-w-[600px] md:min-w-full">
            <li className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 font-bold p-4 bg-[#f0e6ff] rounded-lg mb-3">
              <span>Nombre</span>
              <span>Tiempo de entrega</span>
              <span>Prioridad</span>
              <span>Tiempo</span>
            </li>
            <li className="lista-item-tailwind">
              <span className="font-bold md:font-normal">
                <span className="md:hidden">Nombre: </span>Tarea web
              </span>
              <span>
                <span className="md:hidden">Entrega: </span>23:59:59
              </span>
              <span className="font-bold text-[#e74c3c]">
                <span className="md:hidden text-gray-700">Prioridad: </span>Alta
              </span>
              <span>
                <span className="md:hidden">Tiempo: </span>2hrs
              </span>
            </li>
            <li className="lista-item-tailwind">
              <span className="font-bold md:font-normal">
                <span className="md:hidden">Nombre: </span>Tarea IDO
              </span>
              <span>
                <span className="md:hidden">Entrega: </span>23:59:59
              </span>
              <span className="font-bold text-[#f39c12]">
                <span className="md:hidden text-gray-700">Prioridad: </span>Media
              </span>
              <span>
                <span className="md:hidden">Tiempo: </span>2hrs
              </span>
            </li>
            <li className="lista-item-tailwind">
              <span className="font-bold md:font-normal">
                <span className="md:hidden">Nombre: </span>Tarea Ciber
              </span>
              <span>
                <span className="md:hidden">Entrega: </span>23:59:59
              </span>
              <span className="font-bold text-[#27ae60]">
                <span className="md:hidden text-gray-700">Prioridad: </span>Baja
              </span>
              <span>
                <span className="md:hidden">Tiempo: </span>1hr
              </span>
            </li>
            <li className="lista-item-tailwind">
              <span className="font-bold md:font-normal">
                <span className="md:hidden">Nombre: </span>Tarea Telematica
              </span>
              <span>
                <span className="md:hidden">Entrega: </span>23:59:59
              </span>
              <span className="font-bold text-[#e74c3c]">
                <span className="md:hidden text-gray-700">Prioridad: </span>Alta
              </span>
              <span>
                <span className="md:hidden">Tiempo: </span>3hrs
              </span>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
}

export default Tareas;