import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createSquare(x: number, y: number, color: string){
  return { type: 'rect', props: { x: 100 * x, y: 100 * y, width: 100, height: 100, fill: color } };
}

export function createCircle(x: number, y: number, color: string){
  return { type: 'circle', props: { x: 100 * x + 50, y: 100 * y + 50, radius: 50, fill: color } };
}

// Konva a besoin du nombre de branches pour construire les sommets de l'étoile.
// Le rayon intérieur vient du serveur; le rayon extérieur reste fixé à 50 pixels.
export function createStar(x: number, y: number, innerRadius:number, color: string){
  return { type: 'star', props: { x: 100 * x + 50, y: 100 * y + 50, numPoints: 5, innerRadius: innerRadius, outerRadius: 50, fill: color } };
}
