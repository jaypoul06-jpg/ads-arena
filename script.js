document.addEventListener("DOMContentLoaded", async () => {

  // =========================
  // TELEGRAM USER
  // =========================
  const tg = window.Telegram?.WebApp;
  if (tg) tg.ready();

  const user = tg?.initDataUnsafe?.user || {
    id: "demo",
    first_name: "Guest",
    last_name: ""
  };

  const userId = String(user.id);
  const userName = `${user.first_name} ${user.last_name || ""}`.trim();

  // =========================
  // FIREBASE
  // =========================
  const db = window.db;
  const fb = window.fb;

  const userRef = fb.doc(db, "users", userId);

  // CREATE USER IF NOT EXISTS
  const snap = await fb.getDoc(userRef);

  if (!snap.exists()) {
    await fb.setDoc(userRef, {
      name: userName,
      ads: 0,
      referrals: 0,
      weeklyAds: 0,
      createdAt: Date.now()
    });
  }

  // =========================
  // LOAD DATA
  // =========================
  async function getData() {
    const s = await fb.getDoc(userRef);
    return s.data();
  }

  let data = await getData();

  // =========================
  // UI ELEMENTS
  // =========================
  const el = (id) => document.getElementById(id);

  el("user-name").textContent = userName;
  el("user-name2").textContent = userName;

  const refLink = `https://t.me/Ads_Arena_Bot?start=${userId}`;
  el("ref-link").textContent = refLink;

  // =========================
  // RENDER UI
  // =========================
  function render(d) {

    el("ads-watched").textContent = d.ads || 0;
    el("ref-count").textContent = d.referrals || 0;

    el("p-ads").textContent = d.ads || 0;
    el("p-ref").textContent = d.referrals || 0;

    // simple rank logic
    let rank = "Rising";
    if (d.weeklyAds >= 100) rank = "🔥 Elite";
    else if (d.weeklyAds >= 50) rank = "💎 Pro";
    else if (d.weeklyAds >= 20) rank = "⚡ Active";

    el("weekly-rank").textContent = rank;
    el("p-rank").textContent = rank;
  }

  render(data);

  // =========================
  // WATCH ADS (MONETAG)
  // =========================
  window.watchAd = async function () {

    if (typeof show_11083093 !== "function") {
      alert("Ad not loaded yet");
      return;
    }

    show_11083093().then(async () => {

      await fb.updateDoc(userRef, {
        ads: fb.increment(1),
        weeklyAds: fb.increment(1)
      });

      data = await getData();
      render(data);

    }).catch(() => {
      alert("Ad not completed");
    });
  };

  el("watch-ad-btn").onclick = window.watchAd;

  // =========================
  // REFERRAL COPY / SHARE
  // =========================
  el("copy-btn").onclick = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      alert("Copied!");
    } catch {
      alert("Copy failed");
    }
  };

  el("share-btn").onclick = () => {
    window.open(
      "https://t.me/share/url?url=" + encodeURIComponent(refLink),
      "_blank"
    );
  };

  // =========================
  // NAVIGATION (FIXED FOR YOUR CSS)
  // =========================
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {

      document.querySelectorAll(".nav-btn")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      document.querySelectorAll(".screen")
        .forEach(s => s.classList.remove("active"));

      document.getElementById("screen-" + btn.dataset.tab)
        .classList.add("active");
    });
  });

});
