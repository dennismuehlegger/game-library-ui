const API_BASE = "http://localhost:8080";
let userId = document.getElementById("users").value; // todo - auth
let toastTimeout;

function fetchGames() {
    fetch(`${API_BASE}/games`)
        .then(res => res.json())
        .then(games => renderGames(games))
        .catch(err => console.error("Failed to fetch games:", err));
}

function fetchOwnedGames() {
    const userId = document.getElementById("users").value;
    fetch(`${API_BASE}/users/${userId}/library`)
        .then(res => res.json())
        .then(games => renderOwnedGames(games))
        .catch(err => console.error("Failed to fetch games:", err));
}

function fetchUsers() {
    fetch(`${API_BASE}/users`)
        .then(res => res.json())
        .then(users => renderUsers(users))
        .catch(err => console.error("Failed to fetch users:", err));
}

function fetchFunds(){
const userId = document.getElementById("users").value;
    fetch(`${API_BASE}/users/${userId}`, {
        method: "GET"
    })
    .then(res => res.json())
    .then(res => {
        document.getElementById("funds-amount").textContent = res.funds;
    })
}

function buyGame(gameId){
    const userId = document.getElementById("users").value;
    fetch(`${API_BASE}/users/${userId}/games/${gameId}/buy`, {
        method: "POST"
    })
    .then(res => res.json())
    .then(res => {
        switch (res) {
            case "SUCCESS":
                showToast("Game purchased successfully!", "success");
                fetchFunds();
                break;
            case "INSUFFICIENT_FUNDS":
                showToast("Not enough funds!", "error");
                break;
            case "GAME_ALREADY_OWNED":
                showToast("You already own this game!", "error");
                break;
            case "USER_OR_GAME_NOT_FOUND":
                showToast("User or game not found!", "error");
                break;
        }
    })
}

function playGame(gameId){
    const userId = document.getElementById("users").value;
    fetch(`${API_BASE}/users/${userId}/games/${gameId}/play`, {
        method: "PUT"
    })
    .then(res => res.json())
    .then(res => {
        switch (res) {
            case "SUCCESS":
                fetchOwnedGames();
                break;
            case "USER_OR_GAME_NOT_FOUND":
                showToast("User or game not found!", "error");
                break;
            case "GAME_NOT_OWNED":
                showToast("Game not owned!", "error");
                break;
        }
    })
}

function getTransactionHistory() {
    const userId = document.getElementById("users").value;
    fetch(`${API_BASE}/users/${userId}/history`, {
        method: "GET"
    })
    .then(res => res.json())
    .then(res => {
        switch (res.result) {
            case "SUCCESS":
                renderTransactionHistory(res.transactions);
                break;
            case "NO_HISTORY":
                showToast("No transaction history!", "error");
                break;
            case "NO_USER":
                showToast("No user found!", "error");
                break;
        }
    });
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


function renderOwnedGames(games) {
    const userId = document.getElementById("users").value;
    const container = document.getElementById("owned-game-list");
    container.innerHTML = "";

    games.forEach(game => {
        const card = document.createElement("div");
        card.classList.add("game-card");
        card.innerHTML = `
            <img src="${game.coverArtUrl}" alt="${game.name}">
            <h3>${game.name}</h3>
            <p>Hours played: ${game.hoursPlayed}</p>
            <p>${game.releaseYear}</p>
            <button class="play-button" onclick="playGame(${game.id})">&#9654;</button>
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
    fetchFunds();
}

function renderTransactionHistory(transactions) {
    const container = document.getElementById("transaction-list");
    container.innerHTML = "";

    transactions.forEach(transaction => {
        const p = document.createElement("p");
        const game = transaction.gameName;
        const msg = `Purchased ${game} for ${transaction.price}€`;
        p.textContent = msg;
        container.appendChild(p);
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

fetchUsers();

function openTab(evt, cityName) {
  var i, tabcontent, tablinks;

  switch (cityName) {
        case "Market Place":
            fetchGames();
            break;
        case "Game Library":
            fetchOwnedGames();
            break;
        case "Transaction History":
            getTransactionHistory();
            break;
        default:
            showToast("Something went wrong.", "error");
    }

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}