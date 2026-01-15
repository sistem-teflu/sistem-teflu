import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Lógica de Turnos
export function calcularTurno(): string {
  const now = new Date();
  // Ajuste de zona horaria si el servidor no está en México (opcional, pero recomendado manejar UTC)
  // Asumiremos que la hora del sistema es la correcta o se ajusta en el frontend.
  
  const day = now.getDay(); // 0 = Domingo, 6 = Sábado
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Convertimos todo a minutos desde el inicio del día para comparar fácil
  const currentTime = hours * 60 + minutes; 

  // Definición de límites en minutos
  const t6_00 = 6 * 60;
  const t11_30 = 11 * 60 + 30;
  const t14_30 = 14 * 60 + 30;
  const t16_30 = 16 * 60 + 30;
  const t22_30 = 22 * 60 + 30;

  // Lógica Sábado
  if (day === 6) { 
    if (currentTime >= t6_00 && currentTime < t11_30) return "DIA";
    if (currentTime >= t11_30 && currentTime < t16_30) return "TARDE";
    return "NOCHE"; // Asumiendo que fuera de horario es noche o guardia
  }

  // Lógica Lunes (1) a Viernes (5) y Domingo (0)
  // Nota: Ajusta si domingo tiene horario especial
  if (currentTime >= t6_00 && currentTime < t14_30) return "DIA";
  if (currentTime >= t14_30 && currentTime < t22_30) return "TARDE";
  
  return "NOCHE"; // De 22:30 a 06:00
}