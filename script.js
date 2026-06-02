document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    const splash = document.getElementById("splash-screen");

    setTimeout(() => {
        if (splash) splash.style.display = "none";
        if (app) app.style.display = "block";
    }, 2000);

    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.ready();

        const user = Telegram.WebApp.initDataUnsafe.user;

        if (user) {
            const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();

            const userNameEl = document.getElementById("user-name");
            const profileNameEl = document.getElementById("profile-name");

            if (userNameEl) userNameEl.textContent = name;
            if (profileNameEl) profileNameEl.textContent = name;
        }
    }
});// ADS ARENA DATA

let userData = JSON.parse(localStorage.getItem("adsArenaData")) || {
    balance: 0,
    totalEarned: 0,
    adsWatched: 0
};

function saveData() {
    localStorage.setItem(
        "adsArenaData",
        JSON.stringify(userData)
    );
}

function updateStats() {

    const balance = document.getElementById("hero-balance");
    if (balance) {
        balance.innerHTML = userData.balance + " <span>PTS</span>";
    }

    const earnings = document.getElementById("stat-earnings");
    if (earnings) {
        earnings.textContent = userData.totalEarned;
    }

    const ads = document.getElementById("stat-ads");
    if (ads) {
        ads.textContent = userData.adsWatched;
    }
}

function watchAd() {

    if (typeof show_11083093 !== "function") {
        alert("Monetag ad not loaded");
        return;
    }

    show_11083093().then(() => {

        userData.balance += 70;
        userData.totalEarned += 70;
        userData.adsWatched += 1;

        saveData();
        updateStats();

        alert("You earned 70 points!");
    });
}

document.addEventListener("DOMContentLoaded", () => {

    updateStats();

    const mainWatchBtn =
        document.getElementById("main-watch-btn");

    if (mainWatchBtn) {
        mainWatchBtn.addEventListener("click", watchAd);
    }

    const quickWatchBtn =
        document.getElementById("quick-watch-btn");

    if (quickWatchBtn) {
        quickWatchBtn.addEventListener("click", watchAd);
    }
});// Navigation

document.querySelectorAll(".nav-btn").forEach(button => {

    button.addEventListener("click", () => {

        const target = button.dataset.screen;

        document.querySelectorAll(".nav-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        document.querySelectorAll(".screen").forEach(screen => {
            screen.classList.remove("active");
        });

        const targetScreen =
            document.getElementById("screen-" + target);

        if (targetScreen) {
            targetScreen.classList.add("active");
        }
    });

});
