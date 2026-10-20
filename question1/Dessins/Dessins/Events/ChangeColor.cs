namespace Dessins.Events
{
    // Change la couleur des formes suivantes, sans dessiner de forme.
    public class ChangeColor(string color) : DrawingEvent
    {
        public override string Type => "ChangeColor";
        public string Color { get; set; } = color;
    }
}
