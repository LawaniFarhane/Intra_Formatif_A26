using System.Text.Json.Serialization;

namespace Dessins.Events
{
    // La liste contient des DrawingEvent abstraits. Ces attributs indiquent
    // au sérialiseur les types concrets et leurs propriétés à inclure dans le JSON.
    // Chaque nouveau type, comme ChangeColor, doit aussi être enregistré ici.
    [JsonDerivedType(typeof(DrawCircle))]
    [JsonDerivedType(typeof(DrawStar))]
    [JsonDerivedType(typeof(DrawSquare))]
    [JsonDerivedType(typeof(Wait))]
    [JsonDerivedType(typeof(ChangeColor))]
    public abstract class DrawingEvent
    {
        public abstract string Type { get; }

        public List<DrawingEvent>? DrawingEvents { get; set; } = null;
    }
}
