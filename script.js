document.addEventListener("DOMContentLoaded", () => {

    const app = document.getElementById("app");
    const splash = document.getElementById("splash-screen");

    setTimeout(() => {
        if (splash) splash.style.display = "none";
        if (app) app.style.display = "block";
    }, 2000);

    // Telegram user
    try {
        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.ready();

            const user = Telegram.WebApp.initDataUnsafe?.user;

            if (user) {
                const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();

                const userNameEl = document.getElementById("user-name");
                const profileNameEl = document.getElementById("profile-name");

                if (userNameEl) userNameEl.textContent = name;
                if (profileNameEl) profileNameEl.textContent = name;
            }
        }
    } catch (e) {}

    updateStats();
    renderHistory();
    updateProfileStats();
    setupReferral();
    setupTheme();
    setupNavigation();
    setupButtons();
    updateDailyProgress();
});


// ===========================
// SAFE USER DATA
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
// SAVE
// ===========================

function saveData() {
    localStorage.setItem("adsArenaData", JSON.stringify(userData));
}


// ===========================
// STATS
// ===========================

function updateStats() {

    const balance = document.getElementById("hero-balance");
    if (balance) balance.innerHTML = `${userData.balance} <span>PTS</span>`;

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

    userData.history = userData.history.slice(0, 50);

    saveData();
    renderHistory();
}

function renderHistory() {

    const recent = document.getElementById("recent-history");
    const ads = document.getElementById("ad-history-list");
    const earnings = document.getElementById("earnings-history-list");

    const history = userData.history || [];

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
// WATCH ADS (MONETAG + DAILY FIX)
// ===========================

function watchAd() {

    if (typeof show_11083093 !== "function") {
        alert("Ad not loaded yet");
        return;
    }

    show_11083093().then(() => {

        // GLOBAL STATS
        userData.balance += 70;
        userData.totalEarned += 70;
        userData.adsWatched += 1;

        addHistory("Watched Monetag Ad", 70);

        saveData();
        updateStats();
        updateProfileStats();

        // DAILY PROGRESS UPDATE
        let today = new Date().toDateString();

        let daily = JSON.parse(localStorage.getItem("adsArenaDaily")) || {
            date: today,
            watched: 0
        };

        if (daily.date !== today) {
            daily = { date: today, watched: 0 };
        }

        daily.watched += 1;

        localStorage.setItem("adsArenaDaily", JSON.stringify(daily));

        updateDailyProgress();

        alert("You earned 70 points!");

    }).catch(() => {
        alert("Ad not completed");
    });
}


// ===========================
// DAILY PROGRESS
// ===========================

function updateDailyProgress() {

    const target = 200;
    const today = new Date().toDateString();

    let daily = JSON.parse(localStorage.getItem("adsArenaDaily")) || {
        date: today,
        watched: 0
    };

    if (daily.date !== today) {
        daily = { date: today, watched: 0 };
    }

    const percent = Math.min((daily.watched / target) * 100, 100);

    const watchedEl = document.getElementById("daily-watched");
    const targetEl = document.getElementById("daily-target");
    const bar = document.getElementById("daily-progress-bar");
    const pct = document.getElementById("daily-pct");

    if (watchedEl) watchedEl.textContent = daily.watched;
    if (targetEl) targetEl.textContent = target;
    if (bar) bar.style.width = percent + "%";
    if (pct) pct.textContent = Math.floor(percent) + "%";

    localStorage.setItem("adsArenaDaily", JSON.stringify(daily));
}


// ===========================
// PROFILE
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
// REFERRAL
// ===========================

function setupReferral() {

    const refLink = "https://t.me/Ads_Arena_Bot?start=" + btoa("user_demo");

    const refText = document.getElementById("ref-link-text");
    if (refText) refText.textContent = refLink;

    const copyBtn = document.getElementById("copy-ref-btn");
    if (copyBtn) {
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(refLink);
            alert("Copied!");
        };
    }

    const shareBtn = document.getElementById("share-ref-btn");
    if (shareBtn) {
        shareBtn.onclick = () => {
            window.open("https://t.me/share/url?url=" + encodeURIComponent(refLink), "_blank");
        };
    }
}


// ===========================
// THEME
// ===========================

function setupTheme() {

    const toggle = document.getElementById("dark-mode-toggle");
    const saved = localStorage.getItem("theme");

    if (saved === "light") {
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

    document.querySelectorAll(".nav-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            const target = btn.dataset.screen;

            document.querySelectorAll(".nav-btn")
                .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            document.querySelectorAll(".screen")
                .forEach(s => s.classList.remove("active"));

            const screen = document.getElementById("screen-" + target);
            if (screen) screen.classList.add("active");
        });
    });
}


// ===========================
// BUTTONS
// ===========================

function setupButtons() {

    const main = document.getElementById("main-watch-btn");
    const quick = document.getElementById("quick-watch-btn");

    if (main) main.addEventListener("click", watchAd);
    if (quick) quick.addEventListener("click", watchAd);
}
