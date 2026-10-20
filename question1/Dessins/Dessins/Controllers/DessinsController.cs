using Dessins.Events;
using Microsoft.AspNetCore.Mvc;

namespace Dessins.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class DessinsController : ControllerBase
    {
        [HttpGet]
        // Rien à modifier ici, juste un exemple de dessin très simple
        public ActionResult GetDrawing1()
        {
            var drawSquare = new DrawSquare(2, 2);
            
            return Ok(drawSquare);
        }

        // Les enfants se jouent après leur parent, dans l'ordre de la liste.
        [HttpGet]
        public ActionResult GetDrawing2()
        {
            // Étape 1 : le serveur décrit QUOI faire, il ne dessine pas lui-même.
            // Le cercle est la racine; sa liste décrit les actions suivantes.
            // Les délais sont des événements exécutés par le navigateur.
            DrawingEvent sequence = new DrawCircle(1, 1)
            {
                DrawingEvents = [
                    new Wait(3),
                    // Le rouge reste actif pour les deux carrés suivants.
                    new ChangeColor("red"),
                    new DrawSquare(0, 2),
                    new DrawSquare(2, 2),
                    new Wait(1),
                    new ChangeColor("yellow"),
                    new DrawStar(1, 3, 20)
                ]
            };
            return Ok(sequence);
        }
    }
}
