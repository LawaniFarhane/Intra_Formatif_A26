namespace Dessins.Events
{
    public class DrawCircle : DrawingEvent
    {
        public override string Type { get { return "Circle"; } }
        public int X { get; set; }
        public int Y { get; set; }
        
        public DrawCircle(int x, int y)
        {
            X = x;
            Y = y;
        }
    }
}
