namespace Dessins.Events
{
    public class ChangeColor : DrawingEvent
    {
        public override string Type => "ChangeColor";
        public string Color { get; set; }

        public ChangeColor(string color)
        {
            Color = color;
        }
    }
}