// PAGE NAVIGATION

function openPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");

}

// TELEGRAM WEB APP

let tg = window.Telegram?.WebApp;

if (tg) {

    tg.expand();

    const user = tg.initDataUnsafe?.user;

    if (user) {

        document.getElementById("userName").innerText =
            user.first_name || "User";

        document.getElementById("profileName").innerText =
            user.first_name || "User";

        if (user.photo_url) {

            document.getElementById("userPhoto").src =
                user.photo_url;

            document.getElementById("profilePhoto").src =
                user.photo_url;

        }

    }

}

// DEMO USER DATA
// Replace with API calls later

let userData = {

    adsWatched: 1250,
    referrals: 25,
    referralEarnings: 2.50,
    weeklyRank: 12,
    points: 8750

};

// UPDATE UI

function updateUI() {

    const ads = document.getElementById("adsWatched");
    const refs = document.getElementById("totalReferrals");
    const rank = document.getElementById("weeklyRank");

    if (ads) ads.innerText = userData.adsWatched;
    if (refs) refs.innerText = userData.referrals;
    if (rank) rank.innerText = "#" + userData.weeklyRank;

}

// WATCH ADS BUTTON

const watchBtn = document.getElementById("watchAdsBtn");

if (watchBtn) {

    watchBtn.addEventListener("click", async () => {

        watchBtn.disabled = true;
        watchBtn.innerText = "Loading Ad...";

        // PLACE MONETAG SCRIPT HERE LATER

        setTimeout(() => {

            userData.adsWatched++;
            userData.points += 70;

            updateUI();

            addActivity(
                "Watched Ad +70 Points"
            );

            alert(
                "Ad completed successfully!\n+70 Points"
            );

            watchBtn.disabled = false;
            watchBtn.innerText = "WATCH ADS";

        }, 3000);

    });

}

// ACTIVITY LOG

function addActivity(text) {

    const list =
        document.getElementById("activityList");

    if (!list) return;

    const li = document.createElement("li");

    li.innerText = text;

    list.prepend(li);

}

// COPY REFERRAL LINK

const copyBtn =
    document.getElementById("copyLinkBtn");

if (copyBtn) {

    copyBtn.addEventListener("click", () => {

        const link =
            document.getElementById("referralLink");

        navigator.clipboard.writeText(
            link.value
        );

        alert("Referral link copied!");

    });

}

// SHARE REFERRAL LINK

const shareBtn =
    document.getElementById("shareBtn");

if (shareBtn) {

    shareBtn.addEventListener("click", () => {

        const link =
            document.getElementById("referralLink").value;

        if (navigator.share) {

            navigator.share({

                title: "Ads Arena",
                text:
                    "Join Ads Arena and start earning!",

                url: link

            });

        } else {

            window.open(
                `https://t.me/share/url?url=${encodeURIComponent(link)}`,
                "_blank"
            );

        }

    });

}

// LEADERBOARD DEMO

const leaderboardData = [

    {
        name: "Ahsan Ali",
        ads: 12500,
        reward: "$4.00"
    },

    {
        name: "Zain Khan",
        ads: 10300,
        reward: "$2.00"
    },

    {
        name: "Hassan",
        ads: 8500,
        reward: "$0.7778"
    }

];

// LOAD LEADERBOARD

function loadLeaderboard() {

    const board =
        document.querySelector(".leaderboard");

    if (!board) return;

    board.innerHTML = "";

    leaderboardData.forEach((user, index) => {

        const row =
            document.createElement("div");

        row.className = "leader-item";

        row.innerHTML = `

            <span>
                ${index + 1}. ${user.name}
            </span>

            <span>
                ${user.reward}
            </span>

        `;

        board.appendChild(row);

    });

}

// ADMIN CHECK

const ADMIN_IDS = [

    123456789

    // Replace with your Telegram ID

];

function checkAdmin() {

    if (!tg) return;

    const user =
        tg.initDataUnsafe?.user;

    if (!user) return;

    if (
        ADMIN_IDS.includes(user.id)
    ) {

        console.log(
            "Admin Access Granted"
        );

    } else {

        const adminPage =
            document.getElementById("adminPage");

        if (adminPage) {

            adminPage.remove();

        }

    }

}

// WEEKLY REWARD CHECK

function getRewardTier(ads) {

    if (ads >= 10000) {

        return "$4.00";

    }

    if (ads >= 8000) {

        return "$2.00";

    }

    if (ads >= 5000) {

        return "$0.7778";

    }

    return "Not Qualified";

}

// WITHDRAW REQUEST

function requestWithdrawal(amount) {

    alert(
        `Withdrawal request submitted: $${amount}`
    );

    // Future API Call

}

// API PLACEHOLDERS

async function loadUserData() {

    // Future Backend Endpoint

    console.log(
        "Load user data from MongoDB"
    );

}

async function loadReferrals() {

    console.log(
        "Load referrals from API"
    );

}

async function loadRankings() {

    console.log(
        "Load rankings from API"
    );

}

async function submitAdWatch() {

    console.log(
        "Save watched ad to backend"
    );

}

// INITIALIZATION

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateUI();

        loadLeaderboard();

        checkAdmin();

        loadUserData();

    }
);
