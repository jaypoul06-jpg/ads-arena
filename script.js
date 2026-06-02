document.addEventListener("DOMContentLoaded", () => {

    const app = document.getElementById("app");
    const splash = document.getElementById("splash-screen");

    setTimeout(() => {
        if (splash) splash.style.display = "none";
        if (app) app.style.display = "block";
    }, 2000);

    // Telegram user setup
    try {
        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.ready();

            const user = Telegram.WebApp.initDataUnsafe?.user;

            if (user) {
                const name =
                    `${user.first_name || ""} ${user.last_name || ""}`.trim();

                const userNameEl =
                    document.getElementById("user-name");

                const profileNameEl =
                    document.getElementById("profile-name");

                if (userNameEl) userNameEl.textContent = name;
                if (profileNameEl) profileNameEl.textContent = name;
            }
        }
    } catch (e) {
        console.log("Telegram error:", e);
    }

    updateStats();
    renderHistory();
    updateProfileStats();
    setupReferral();
    setupTheme();
    setupNavigation();
    setupButtons();
});


// ===========================
// USER DATA SAFE LOAD
// ===========================

let userData = {};

try {
    userData = JSON.parse(localStorage.getItem("adsArenaData")) || {};
} catch (e) {
    userData = {};
}

userData.balance = Number(userData.balance) || 0;
userData.totalEarned = Number(userData.totalEarned) || 0;
userData.adsWatched = Number(userData.adsWatched) || 0;
userData.history = Array.isArray(userData.history) ? userData.history : [];
userData.referrals = Array.isArray(userData.referrals) ? userData.referrals : [];
userData.refEarnings = Number(userData.refEarnings) || 0;


// ===========================
// SAVE DATA
// ===========================

function saveData() {
    localStorage.setItem("adsArenaData", JSON.stringify(userData));
}


// ===========================
// UPDATE STATS
// ===========================

function updateStats() {

    const balance = document.getElementById("hero-balance");
    if (balance) {
        balance.innerHTML = `${userData.balance} <span>PTS</span>`;
    }

    const earnings = document.getElementById("stat-earnings");
    if (earnings) earnings.textContent = userData.totalEarned;

    const ads = document.getElementById("stat-ads");
    if (ads) ads.textContent = userData.adsWatched;
}


// ===========================
// HISTORY
// ===========================

function addHistory(title, points) {

    userData.history.unshift({
        title,
        points,
        date: new Date().toLocaleString()
    });

    if (userData.history.length > 50) {
        userData.history = userData.history.slice(0, 50);
    }

    saveData();
    renderHistory();
}

function renderHistory() {

    const recent = document.getElementById("recent-history");
    const ads = document.getElementById("ad-history-list");
    const earnings = document.getElementById("earnings-history-list");

    const history = Array.isArray(userData.history)
        ? userData.history
        : [];

    const html = history.length > 0
        ? history.map(item => `
            <div class="history-item">
                <div class="h-left">
                    <div class="h-title">${item.title || ""}</div>
                    <div class="h-date">${item.date || ""}</div>
                </div>
                <div class="h-pts">+${item.points || 0}</div>
            </div>
        `).join("")
        : `<div class="empty-msg">No history yet</div>`;

    if (recent) recent.innerHTML = html;
    if (ads) ads.innerHTML = html;
    if (earnings) earnings.innerHTML = html;
}


// ===========================
// WATCH AD (MONETAG)
// ===========================

function watchAd() {

    if (typeof show_11083093 !== "function") {
        alert("Ad not loaded yet. Try again.");
        return;
    }

    show_11083093().then(() => {

        userData.balance += 70;
        userData.totalEarned += 70;
        userData.adsWatched += 1;

        addHistory("Watched Monetag Ad", 70);

        saveData();
        updateStats();
        updateProfileStats();

        alert("You earned 70 points!");

    }).catch(() => {
        alert("Ad was not completed");
    });
}


// ===========================
// PROFILE STATS
// ===========================

function updateProfileStats() {

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    set("pstat-balance", userData.balance);
    set("pstat-total", userData.totalEarned);
    set("pstat-ads", userData.adsWatched);
    set("pstat-refs", userData.referrals.length);

    set("ref-total", userData.referrals.length);
    set("ref-earnings", userData.refEarnings);
}


// ===========================
// REFERRAL SYSTEM
// ===========================

function setupReferral() {

    const refLink = "https://t.me/Ads_Arena_Bot?start=" + btoa("user_demo");

    const refText = document.getElementById("ref-link-text");
    if (refText) refText.textContent = refLink;

    const copyBtn = document.getElementById("copy-ref-btn");
    if (copyBtn) {
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(refLink);
            alert("Referral link copied!");
        };
    }

    const shareBtn = document.getElementById("share-ref-btn");
    if (shareBtn) {
        shareBtn.onclick = () => {
            window.open(
                "https://t.me/share/url?url=" + encodeURIComponent(refLink),
                "_blank"
            );
        };
    }
}


// ===========================
// THEME
// ===========================

function setupTheme() {

    const toggle = document.getElementById("dark-mode-toggle");
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        if (toggle) toggle.checked = false;
    }

    if (toggle) {
        toggle.addEventListener("change", () => {

            if (toggle.checked) {
                document.body.classList.remove("light-mode");
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.add("light-mode");
                localStorage.setItem("theme", "light");
            }

        });
    }
}


// ===========================
// NAVIGATION
// ===========================

function setupNavigation() {

    document.querySelectorAll(".nav-btn").forEach(button => {

        button.addEventListener("click", () => {

            const target = button.dataset.screen;

            document.querySelectorAll(".nav-btn")
                .forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            document.querySelectorAll(".screen")
                .forEach(screen => screen.classList.remove("active"));

            const targetScreen = document.getElementById("screen-" + target);

            if (targetScreen) targetScreen.classList.add("active");
        });
    });
}


// ===========================
// BUTTON SETUP
// ===========================

function setupButtons() {

    const mainWatchBtn = document.getElementById("main-watch-btn");
    const quickWatchBtn = document.getElementById("quick-watch-btn");

    if (mainWatchBtn) mainWatchBtn.addEventListener("click", watchAd);
    if (quickWatchBtn) quickWatchBtn.addEventListener("click", watchAd);
}
