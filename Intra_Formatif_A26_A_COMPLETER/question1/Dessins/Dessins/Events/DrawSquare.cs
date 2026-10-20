namespace Dessins.Events
{
    public class DrawSquare : DrawingEvent
    {
        public override string Type { get { return "Square"; } }
        public int X { get; set; }
        public int Y { get; set; }
        
        public DrawSquare(int x, int y)
        {
            X = x;
            Y = y;
        }
    }
}
