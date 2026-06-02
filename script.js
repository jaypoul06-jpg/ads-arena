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
addHistory("Watched Monetag Ad", 70);
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

});// Extra ADS ARENA Features

if (!userData.history) userData.history = [];
if (!userData.referrals) userData.referrals = [];
if (!userData.refEarnings) userData.refEarnings = 0;

function addHistory(title, points) {
    userData.history.unshift({
        title,
        points,
        date: new Date().toLocaleString()
    });

    if (userData.history.length > 50) {
        userData.history.length = 50;
    }

    saveData();
    renderHistory();
}

function renderHistory() {

    const recent = document.getElementById("recent-history");
    const ads = document.getElementById("ad-history-list");
    const earnings = document.getElementById("earnings-history-list");

    const html = userData.history.length
        ? userData.history.map(item => `
            <div class="history-item">
                <div class="h-left">
                    <div class="h-title">${item.title}</div>
                    <div class="h-date">${item.date}</div>
                </div>
                <div class="h-pts">+${item.points}</div>
            </div>
        `).join("")
        : `<p class="empty-msg">No history yet.</p>`;

    if (recent) recent.innerHTML = html;
    if (ads) ads.innerHTML = html;
    if (earnings) earnings.innerHTML = html;
}

function updateProfileStats() {

    const set = (id,val)=>{
        const el=document.getElementById(id);
        if(el) el.textContent=val;
    };

    set("pstat-balance", userData.balance);
    set("pstat-total", userData.totalEarned);
    set("pstat-ads", userData.adsWatched);
    set("pstat-refs", userData.referrals.length);

    set("stat-refs", userData.referrals.length);

    const refTotal=document.getElementById("ref-total");
    if(refTotal) refTotal.textContent=userData.referrals.length;

    const refEarn=document.getElementById("ref-earnings");
    if(refEarn) refEarn.textContent=userData.refEarnings;
}

function setupReferral() {

    const refLink =
      "https://t.me/Ads_Arena_Bot?start=" +
      btoa("user_" + Date.now());

    const refText=document.getElementById("ref-link-text");
    if(refText) refText.textContent=refLink;

    const copyBtn=document.getElementById("copy-ref-btn");

    if(copyBtn){
        copyBtn.onclick=()=>{
            navigator.clipboard.writeText(refLink);
            alert("Referral link copied!");
        };
    }

    const shareBtn=document.getElementById("share-ref-btn");

    if(shareBtn){
        shareBtn.onclick=()=>{
            window.open(
              "https://t.me/share/url?url=" +
              encodeURIComponent(refLink),
              "_blank"
            );
        };
    }
}

function setupTheme() {

    const toggle =
      document.getElementById("dark-mode-toggle");

    const savedTheme =
      localStorage.getItem("theme");

    if(savedTheme==="light"){
        document.body.classList.add("light-mode");
        if(toggle) toggle.checked=false;
    }

    if(toggle){
        toggle.addEventListener("change",()=>{

            if(toggle.checked){
                document.body.classList.remove("light-mode");
                localStorage.setItem("theme","dark");
            }else{
                document.body.classList.add("light-mode");
                localStorage.setItem("theme","light");
            }
renderHistory();
updateProfileStats();
setupReferral();
setupTheme();
        });
    
