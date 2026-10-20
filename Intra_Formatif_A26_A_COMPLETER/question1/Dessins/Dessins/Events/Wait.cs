namespace Dessins.Events
{
    public class Wait : DrawingEvent
    {
        public override string Type { get { return "Wait"; } }
        public int Secondes { get; set; }
        
        public Wait(int secondes)
        {
            Secondes = secondes;
        }
    }
}
