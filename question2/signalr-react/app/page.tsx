"use client";

import React from "react";
import { useEffect } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Button } from "@/components/ui/button";

export default function Home() {

  const [hubConnection, setHubConnection] = React.useState<HubConnection>();
  const [isConnected, setIsConnected] = React.useState<boolean>(false);

  const [usercount, setUserCount] = React.useState<number>(0);
  const [selectedChoice, setSelectedChoice] = React.useState<number>(-1);

  const [pizzaPrice, setPizzaPrice] = React.useState<number>(0);
  const [money, setMoney] = React.useState<number>(0);
  const [nbPizzas, setNbPizzas] = React.useState<number>(0);

  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  // Étape 1 : ouvrir la connexion au montage; la fermer au démontage.
  // Le nettoyage évite de laisser des connexions fantômes en changeant de page.
  useEffect(() => {
    return connectToHub();
  }, []);

  function connectToHub() {
    let disposed = false;
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5282/hubs/pizza")
      .build();

    // Toujours enregistrer les messages AVANT start() pour ne rien manquer.
    connection.on("UpdateNbUsers", (count: number) => setUserCount(count));
    connection.on("UpdateMoney", (amount: number) => setMoney(amount));
    // L'ordre des arguments doit être identique au SendAsync C# : nombre, puis argent.
    connection.on("UpdateNbPizzasAndMoney", (count: number, amount: number) => {
      setNbPizzas(count);
      setMoney(amount);
    });
    connection.on("UpdatePizzaPrice", (price: number) => setPizzaPrice(price));
    connection.onclose(() => {
      if (disposed) return;
      setIsConnected(false);
      setSelectedChoice(-1);
    });

    // Étape 2 : build() construit l'objet, mais seul start() ouvre la connexion.
    // Afficher les actions uniquement après sa réussite évite les appels trop tôt.
    void connection.start().then(() => {
      if (disposed) return;
      setError("");
      setHubConnection(connection);
      setIsConnected(true);
    }).catch((error: unknown) => {
      if (disposed) return;
      setError(error instanceof Error ? error.message : "Connexion impossible.");
    });
    // React peut monter/nettoyer/remonter l'effet en développement (Strict Mode).
    // Ignorer les résultats tardifs de l'ancienne connexion évite une fausse erreur.
    return () => {
      disposed = true;
      void connection.stop();
    };
  }

  // invoke appelle une méthode du Hub; les messages on(...) actualisent l'écran.
  async function invokeHub(method: string, choice: number): Promise<boolean> {
    if (!hubConnection || !isConnected || busy) return false;
    setBusy(true);
    setError("");
    try {
      // Étape 3 : invoke utilise exactement le nom public de la méthode du Hub.
      // Le choix 0/1 correspond aux valeurs de l'enum PizzaChoice en C#.
      // On ne calcule pas le solde ici : les messages du serveur font autorité.
      await hubConnection.invoke(method, choice);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Opération impossible.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  // Étape 4 : attendre le serveur avant de changer l'écran; en cas d'erreur,
  // on garde le choix précédent et on montre le message.
  async function selectChoice(choice: number) {
    if (await invokeHub("SelectChoice", choice)) setSelectedChoice(choice);
  }

  async function unselectChoice() {
    if (await invokeHub("UnselectChoice", selectedChoice)) {
      setSelectedChoice(-1);
      setPizzaPrice(0);
      setMoney(0);
      setNbPizzas(0);
    }
  }

  async function addMoney() {
    await invokeHub("AddMoney", selectedChoice);
  }

  async function buyPizza() {
    await invokeHub("BuyPizza", selectedChoice);
  }
  return (
    <>
      <h1>Pizza Hub</h1>
      <div className="main">
        {error && <p role="alert">{error}</p>}
        {!isConnected && (
          <div>
            Connecting...
          </div>
        )}
        {isConnected && (
          <div className="m-4">
            <h1>Achat de pizza en groupe!</h1>
            <div>
              Nb connected users: {usercount}
            </div>
            <br></br>
            {selectedChoice < 0 && (
              <>
                <h2>Choisissez une pizza</h2>
                <div className="flex gap-4 w-full max-w-4xl mx-auto gap-4">

                  <button disabled={busy} onClick={() => selectChoice(0)}>Pizza sans ananas (10 $)</button>
                  <button disabled={busy} onClick={() => selectChoice(1)}>Pizza avec ananas (12 $)</button>
                </div>
              </>
            )}
            {selectedChoice >= 0 && (
              <div>
                <h2>Votre pizza</h2>
                {selectedChoice === 0 && (
                  <p>Pizza sans ananas</p>
                )}
                {selectedChoice === 1 && (
                  <p>Pizza avec ananas</p>
                )}
                <div>
                  <Button disabled={busy} onClick={unselectChoice}>Changer de pizza</Button>
                </div>
                <h2>Achetez des pizzas</h2>
                <div className="section">
                  Prix d'une pizza: <b>{pizzaPrice}$</b>
                </div>
                <div className="section">
                  <span className="info">Total d'argent: {money}$</span>
                  <Button disabled={busy} onClick={addMoney}>Ajouter 2$</Button>
                </div>
                <div className="section">
                  <span className="info">Nombre de pizzas: {nbPizzas}</span>
                  <Button disabled={busy || pizzaPrice <= 0 || money < pizzaPrice} onClick={buyPizza}>Acheter une pizza</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
