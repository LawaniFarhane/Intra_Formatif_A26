namespace SignalR.Services
{
    // Pizza avec ou sans ananas
    public enum PizzaChoice
    {
        WITHOUT_PINEAPPLE,
        WITH_PINEAPPLE
    }
    class PizzaData
    {
        public int Money { get; set; }
        public int NbPizzas { get; set; }
    }

    public class PizzaManager
    {
        public int NbConnectedUsers { get; private set; }

        public int MONEY_INCREMENT = 2;
        readonly int[] PIZZA_PRICES = new int[2] { 10, 12 };

        // Le data pour les 2 types de pizza
        PizzaData[] PizzasData { get; set; } = [new(), new()];

        public void AddUser()
        {
            NbConnectedUsers++;
        }

        public int GetPizzaPrice(PizzaChoice choice)
        {
            return PIZZA_PRICES[(int)choice];
        }   

        public int GetMoney(PizzaChoice choice)
        {
            return PizzasData[(int)choice].Money;
        }

        public int GetNbPizzas(PizzaChoice choice)
        {
            return PizzasData[(int)choice].NbPizzas;
        }

        public void RemoveUser()
        {
            NbConnectedUsers--;
        }

        public void IncreaseMoney(PizzaChoice choice)
        {
            PizzasData[(int)choice].Money += MONEY_INCREMENT;
        }

        public void BuyPizza(PizzaChoice choice)
        {
            // Si il y a assez d'argent
            if(PizzasData[(int)choice].Money >= PIZZA_PRICES[(int)choice])
            {
                // On retire l'argent
                PizzasData[(int)choice].Money -= PIZZA_PRICES[(int)choice];
                // Et augmente le nombre de pizzas
                PizzasData[(int)choice].NbPizzas++;
            }
        }

        public string GetGroupName(PizzaChoice choice)
        {
            return choice.ToString() + "_Group";
        }
    }
}
