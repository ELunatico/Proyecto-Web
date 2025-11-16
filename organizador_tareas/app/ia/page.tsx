// ❌ import './IA.css' <-- ¡ASEGÚRATE DE BORRAR ESTA LÍNEA!

function IA() {
  return (
    <div className="flex flex-col gap-[25px] w-full">
      
      {/* === Contenedor de Preguntas === */}
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-6 md:p-8 w-full">
        <h2 className="text-[#6a11cb] text-2xl font-bold mb-6 text-center">
          Pregunta lo que necesites saber a la IA, o utiliza las opciones predeterminadas
        </h2>

        <div className="flex flex-col gap-5">
          
          {/* Input y Botón (Responsivo) */}
          <div className="flex flex-col sm:flex-row gap-2.5 w-full">
            <input 
              type="text" 
              placeholder="Preguntame sobre tus tareas" 
              className="form-input-tailwind flex-1" /* Reutilizamos la clase de Tareas */
            />
            <button className="boton-confirmar-tailwind whitespace-nowrap">
              Confirmar
            </button>
          </div>

          {/* Botones por defecto (Responsivos) */}
          <div className="flex flex-col sm:flex-row justify-between gap-2.5">
            <button className="boton-confirmar-tailwind w-full">
              Ultimas Tareas
            </button>
            <button className="boton-confirmar-tailwind w-full">
              Tareas más prontas
            </button>
            <button className="boton-confirmar-tailwind w-full">
              Organiza mi tiempo
            </button>
          </div>
        </div>
      </div>

      {/* === Diálogo de la IA === */}
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-6 md:p-8 leading-relaxed text-base text-[#2c3e50]">
        <h2 className="text-[#6a11cb] text-2xl font-bold mb-6 text-center">
          Respuesta de la IA
        </h2>

        {/* 👇 ¡AQUÍ ESTÁ EL CAMBIO DE COLOR! 👇 */}
        <div className="bg-[#410a7c] rounded-2xl shadow-inner text-white p-6 leading-relaxed text-base">
          Para maximizar la eficiencia en la ejecución de tus objetivos diarios...
          {/* ... etc ... */}
        </div>
      </div>
    </div>
  );
}

export default IA;