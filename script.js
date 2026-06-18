document.addEventListener("DOMContentLoaded", () => {

  const tg = window.Telegram?.WebApp;
  if (tg) tg.ready();

  const user = tg?.initDataUnsafe?.user || {
    id: "demo",
    first_name: "Guest"
  };

  const userId = user.id;

  let data = JSON.parse(localStorage.getItem("ads_arena_" + userId)) || {
    ads: 0,
    referrals: 0,
    history: []
  };

  function save() {
    localStorage.setItem("ads_arena_" + userId, JSON.stringify(data));
  }

  // UI
  document.getElementById("user-name").textContent =
    user.first_name + " " + (user.last_name || "");

  document.getElementById("ref-link").value =
    "https://t.me/Ads_Arena_Bot?start=" + userId;

  function updateUI() {
    document.getElementById("ads-watched").textContent = data.ads;
    document.getElementById("ref-count").textContent = data.referrals;
    document.getElementById("ref-total").textContent = data.referrals;

    document.getElementById("p-ads").textContent = data.ads;
    document.getElementById("p-ref").textContent = data.referrals;

    document.getElementById("weekly-rank").textContent =
      data.ads >= 50 ? "Top Player" : "Rising";

    document.getElementById("p-rank").textContent =
      data.ads >= 50 ? "Top Player" : "Rising";
  }

  function addHistory(text) {
    data.history.unshift(text);
    data.history = data.history.slice(0, 10);

    document.getElementById("history").innerHTML =
      data.history.map(h => `<div>${h}</div>`).join("");
  }

  // WATCH AD
  window.show_11083093 = window.show_11083093;

  function watchAd() {
    if (typeof show_11083093 !== "function") {
      alert("Ad not ready");
      return;
    }

    show_11083093().then(() => {
      data.ads += 1;
      addHistory("Watched Ad +1");
      save();
      updateUI();
    }).catch(() => {
      alert("Ad not completed");
    });
  }

  document.getElementById("watch-ad-btn").onclick = watchAd;

  // REFERRAL
  document.getElementById("copy-btn").onclick = () => {
    navigator.clipboard.writeText(document.getElementById("ref-link").value);
    alert("Copied");
  };

  document.getElementById("share-btn").onclick = () => {
    window.open("https://t.me/share/url?url=" +
      encodeURIComponent(document.getElementById("ref-link").value));
  };

  // NAV
  document.querySelectorAll(".nav button").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".screen")
        .forEach(s => s.classList.remove("active"));

      document.getElementById("screen-" + btn.dataset.tab)
        .classList.add("active");
    };
  });

  updateUI();
});
