const API_BASE = "http://localhost:8080";

function fetchGames() {
    fetch(`${API_BASE}/games`)
        .then(res => res.json())
        .then(games => renderGames(games))
        .catch(err => console.error("Failed to fetch games:", err));
}

function buyGames(){
     fetch(`${API_BASE}/users/${userId}/games/${gameId}/buy`, {
             method: "POST"
         })
}

function renderGames(games) {
    const container = document.getElementById("game-list");
    container.innerHTML = "";

    games.forEach(game => {
        const card = document.createElement("div");
        card.classList.add("game-card");
        card.innerHTML = `
            <img src="${game.coverArtUrl}" alt="${game.name}">
            <h3>${game.name}</h3>
            <p>${game.price}€</p>
            <p>${game.releaseYear}</p>
            <button class="buy-button">Buy</button>
        `;
        container.appendChild(card);
    });
}

fetchGames();