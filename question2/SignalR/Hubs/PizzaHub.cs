using Microsoft.AspNetCore.SignalR;
using SignalR.Services;

namespace SignalR.Hubs
{
    public class PizzaHub(PizzaManager pizzaManager) : Hub
    {
        // Étape 1 : le gestionnaire est enregistré en Singleton dans Program.cs.
        // Tous les clients partagent donc les mêmes montants et compteurs.
        // Le Hub reçoit ce service par injection; ne pas créer un nouveau manager ici.
        private readonly PizzaManager _pizzaManager = pizzaManager;

        public override async Task OnConnectedAsync()
        {
            // Étape 2 : une connexion représente un utilisateur (donc un onglet).
            // All envoie le total à tout le monde, même sans choix de pizza.
            _pizzaManager.AddUser();
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // SignalR retire automatiquement les connexions fermées de leurs groupes.
            // On met aussi le compteur global à jour, puis on appelle la bonne méthode de base.
            _pizzaManager.RemoveUser();
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SelectChoice(PizzaChoice choice)
        {
            ValidateChoice(choice);
            // Étape 3 : rejoindre le groupe AVANT de recevoir les mises à jour.
            // Caller initialise seulement le nouvel arrivant : les autres ont déjà leur état.
            await Groups.AddToGroupAsync(Context.ConnectionId, _pizzaManager.GetGroupName(choice));
            await Clients.Caller.SendAsync("UpdatePizzaPrice", _pizzaManager.GetPizzaPrice(choice));
            await Clients.Caller.SendAsync("UpdateNbPizzasAndMoney",
                _pizzaManager.GetNbPizzas(choice), _pizzaManager.GetMoney(choice));
        }

        public async Task UnselectChoice(PizzaChoice choice)
        {
            ValidateChoice(choice);
            // Quitter l'ancien groupe évite de recevoir l'argent de l'ancienne pizza.
            // Le client attend la fin de cette méthode avant de montrer le nouveau choix.
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, _pizzaManager.GetGroupName(choice));
        }

        public async Task AddMoney(PizzaChoice choice)
        {
            ValidateChoice(choice);
            // Étape 4 : le serveur ajoute 2 $ via le gestionnaire.
            // Group informe seulement les amateurs de cette pizza.
            // L'énoncé exige UpdateMoney ici : le nombre de pizzas n'a pas changé.
            _pizzaManager.IncreaseMoney(choice);
            await Clients.Group(_pizzaManager.GetGroupName(choice))
                .SendAsync("UpdateMoney", _pizzaManager.GetMoney(choice));
        }

        public async Task BuyPizza(PizzaChoice choice)
        {
            ValidateChoice(choice);
            // Étape 5 : BuyPizza vérifie le solde, déduit le prix et ajoute une pizza.
            // On diffuse les DEUX valeurs ensemble pour actualiser tous les membres.
            // Si le solde était insuffisant, le gestionnaire conserve les valeurs.
            _pizzaManager.BuyPizza(choice);
            await Clients.Group(_pizzaManager.GetGroupName(choice))
                .SendAsync("UpdateNbPizzasAndMoney", _pizzaManager.GetNbPizzas(choice),
                    _pizzaManager.GetMoney(choice));
        }

        private static void ValidateChoice(PizzaChoice choice)
        {
            if (!Enum.IsDefined(choice)) throw new HubException("Choix de pizza invalide.");
        }
    }
}
