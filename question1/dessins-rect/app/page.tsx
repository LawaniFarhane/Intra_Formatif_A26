"use client";

import axios from "axios";
import { useState, useRef  } from 'react';
import Canvas from './components/canvas';
import { Button } from './components/ui/button';
import { createSquare, createCircle, createStar } from '@/lib/utils';

// Étape 1 : décrire le JSON reçu. Le champ type permet à TypeScript de
// savoir quelles propriétés existent : secondes pour Wait, color pour ChangeColor.
type DrawingEvent = (
  | { type: "Square" | "Circle"; x: number; y: number }
  | { type: "Star"; x: number; y: number; innerRadius: number }
  | { type: "Wait"; secondes: number }
  | { type: "ChangeColor"; color: string }
) & { drawingEvents?: DrawingEvent[] | null };
export default function Home() {
  const [shapes, setShapes] = useState<any[]>([]);
  // useRef conserve la couleur entre les événements sans attendre un rendu React.
  // Les formes déjà créées gardent leur couleur; seules les suivantes changent.
  const currentColor = useRef("blue");

  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');

  // Seulement un exemple local pour comprendre comment dessiner des formes avec un délai
  async function afficherTestLocal(){
    setIsPlaying(true);
    clearShapes();

    await wait(1);
    
    drawSquare(1,1);
    
    await wait(2);

    currentColor.current = "red";
    drawCircle(3,1);
    setIsPlaying(false);
  }

  async function afficherEvents1(){
    await loadDrawing("GetDrawing1");
  }

  async function afficherEvents2(){
    await loadDrawing("GetDrawing2");
  }

  async function loadDrawing(action: string){
    setIsPlaying(true);
    setError("");
    clearShapes();
    try {
      // Étape 2 : GET appelle l'action C#. response.data contient l'événement racine.
      // await attend le serveur, puis attend toute l'animation avant de réactiver les boutons.
      const response = await axios.get<DrawingEvent>(`http://localhost:5269/api/Dessins/${action}`);
      await applyEvents(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Impossible de charger le dessin.");
    } finally {
      setIsPlaying(false);
    }
  }

  // Un événement agit d'abord, puis ses enfants sont exécutés récursivement.
  async function applyEvents(event: DrawingEvent): Promise<void>{
    // Étape 3 : interpréter le type, puis utiliser les fonctions de dessin fournies.
    // ASP.NET transforme les propriétés C# X et InnerRadius en x et innerRadius.
    switch (event.type) {
      case "Square": drawSquare(event.x, event.y); break;
      case "Circle": drawCircle(event.x, event.y); break;
      case "Star": drawStar(event.x, event.y, event.innerRadius); break;
      case "Wait": await wait(event.secondes); break;
      case "ChangeColor": currentColor.current = event.color; break;
      default: throw new Error("Type d'événement inconnu.");
    }
    // Étape 4 : récursion. Chaque enfant peut posséder ses propres enfants.
    // Sans enfant, [] termine naturellement la récursion (cas de base).
    // Le await DANS for...of garde l'ordre et respecte les pauses.
    // Un forEach(async ...) ne ferait pas attendre les événements suivants.
    for (const child of event.drawingEvents ?? []) {
      await applyEvents(child);
    }
  }
  // ATTENTION: Les méthodes suivantes n'ont pas besoin d'être modifiées pour répondre à la question

  return (
    <div className='m-4'>
      <Button disabled={isPlaying} variant="outline" className="mr-2" onClick={() => afficherTestLocal()}>Afficher Test Local</Button>
      <Button disabled={isPlaying} variant="outline" className="mr-2" onClick={() => afficherEvents1()}>Afficher Événements 1</Button>
      <Button disabled={isPlaying} variant="outline" onClick={() => afficherEvents2()}>Afficher Événements 2</Button>
      {error && <p role="alert">{error}</p>}
      <Canvas shapes={shapes} />
    </div>
  );

  function drawSquare(x :number, y:number){
    let color = currentColor.current;
    // La mise à jour fonctionnelle repart de la dernière liste React disponible.
    // Cela préserve les deux carrés ajoutés à la suite, même sans délai entre eux.
    setShapes((shapes) => [...shapes, createSquare(x, y, color)]);
  }

  function drawCircle(x :number, y:number){
    let color = currentColor.current;
    setShapes((shapes) => [...shapes, createCircle(x, y, color)]);
  }

  function drawStar(x :number, y:number, innerRadius:number){
    let color = currentColor.current;
    setShapes((shapes) => [...shapes, createStar(x, y, innerRadius,color)]);
  }

  function clearShapes(){
    setShapes([]);
    currentColor.current = "blue";
  }

  async function wait(s: number){
    return new Promise(resolve => setTimeout(resolve, s * 1000));
  }
}
