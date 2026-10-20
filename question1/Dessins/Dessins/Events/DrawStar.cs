namespace Dessins.Events
{
    public class DrawStar : DrawingEvent
    {
        // Correction 1 : Circle faisait interpréter l'étoile comme un cercle.
        public override string Type => "Star";
        public int X { get; set; }
        public int Y { get; set; }
        // Correction 2 : le rayon doit être stocké dans une propriété publique
        // pour être inclus dans le JSON, puis lu par drawStar côté React.
        public int InnerRadius { get; set; }

        public DrawStar(int x, int y, int innerRadius)
        {
            X = x;
            Y = y;
            InnerRadius = innerRadius;
        }
    }
}
