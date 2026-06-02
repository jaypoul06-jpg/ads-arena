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
});
