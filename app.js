const API_BASE = "http://localhost:8080";
let userId = document.getElementById("users").value; // todo - auth
let toastTimeout;

function fetchGames() {
    fetch(`${API_BASE}/games`)
        .then(res => res.json())
        .then(games => renderGames(games))
        .catch(err => console.error("Failed to fetch games:", err));
}

function fetchUsers() {
    fetch(`${API_BASE}/users`)
        .then(res => res.json())
        .then(users => renderUsers(users))
        .catch(err => console.error("Failed to fetch users:", err));
}
// todo - tabs
function buyGame(gameId){
const userId = document.getElementById("users").value;
     fetch(`${API_BASE}/users/${userId}/games/${gameId}/buy`, {
             method: "POST"
         })
         .then(res => res.json())
         .then(res => {
             if (res === "SUCCESS") {
                 showToast("Game purchased successfully!", "success");
             } else if (res === "INSUFFICIENT_FUNDS") {
                 showToast("Not enough funds!", "error");
             }
             else if (res === "GAME_ALREADY_OWNED") {
                 showToast("You already own this game!", "error");
             }
             else if (res === "USER_OR_GAME_NOT_FOUND") {
                 showToast("User or game not found!", "error");
             }
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
            <button class="buy-button" onclick="buyGame(${game.id})">Buy</button>
        `;
        container.appendChild(card);
    });
}

function renderUsers(users) {
    const container = document.getElementById("users");
    container.innerHTML = "";
    users.forEach(user => {
    container.innerHTML += `
        <option value=${user.id}>${user.username}</option>
    `;
    });
}

function showToast(message, type) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `${type} show`;

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

fetchGames();
fetchUsers();