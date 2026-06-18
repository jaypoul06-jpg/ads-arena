document.addEventListener("DOMContentLoaded", () => {

  let ads = 0;

  const adsEl = document.getElementById("ads-watched");
  const btn = document.getElementById("watch-ad-btn");

  btn.addEventListener("click", () => {

    if (typeof show_11083093 !== "function") {
      alert("Monetag not loaded");
      return;
    }

    show_11083093().then(() => {
      ads++;
      adsEl.textContent = ads;
      alert("Ad watched!");
    });

  });

});
