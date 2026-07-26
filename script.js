// ==========================================
// STARS MARKET — WEB APP
// ==========================================

const tg = window.Telegram?.WebApp;

// Telegram Web App
if (tg) {
    tg.ready();
    tg.expand();
}


// ==========================================
// STATE
// ==========================================

const state = {
    balance: 0,
    user: tg?.initDataUnsafe?.user || null
};


// ==========================================
// ELEMENTS
// ==========================================

const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll(".nav-item");

const balanceElement = document.getElementById("balance");
const addBalanceButton = document.getElementById("add-balance-btn");


// ==========================================
// BALANCE
// ==========================================

function updateBalance() {

    if (!balanceElement) return;

    balanceElement.textContent =
        new Intl.NumberFormat("uz-UZ").format(state.balance);
}


// ==========================================
// PAGE SYSTEM
// ==========================================

function showPage(pageId) {

    pages.forEach(page => {
        page.classList.remove("active");

        if (page.id === pageId) {
            page.classList.add("active");
        }
    });


    navItems.forEach(button => {

        button.classList.remove("active");

        if (button.dataset.page === pageId) {
            button.classList.add("active");
        }

    });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ==========================================
// BOTTOM NAVIGATION
// ==========================================

navItems.forEach(button => {

    button.addEventListener("click", () => {

        const pageId = button.dataset.page;

        if (!pageId) return;

        showPage(pageId);

    });

});


// ==========================================
// BALANCE BUTTON
// ==========================================

if (addBalanceButton) {

    addBalanceButton.addEventListener("click", () => {

        if (tg) {

            tg.showAlert(
                "Balans to'ldirish bo'limini keyingi bosqichda ulaymiz."
            );

        } else {

            alert(
                "Balans to'ldirish bo'limini keyingi bosqichda ulaymiz."
            );

        }

    });

}


// ==========================================
// HOME QUICK PRODUCTS
// ==========================================

const starsCard = document.querySelector(".stars-card");
const premiumCard = document.querySelector(".premium-card");
const giftCard = document.querySelector(".gift-card");


if (starsCard) {

    starsCard.addEventListener("click", () => {

        showPage("home-page");

        if (tg) {
            tg.showAlert(
                "Stars xarid qilish bo'limini keyingi bosqichda yaratamiz."
            );
        }

    });

}


if (premiumCard) {

    premiumCard.addEventListener("click", () => {

        showPage("premium-page");

    });

}


if (giftCard) {

    giftCard.addEventListener("click", () => {

        showPage("nft-page");

    });

}


// ==========================================
// USER INFO
// ==========================================

function getUserInfo() {

    if (!state.user) {
        return null;
    }

    return {
        id: state.user.id,
        first_name: state.user.first_name || "",
        last_name: state.user.last_name || "",
        username: state.user.username || "",
        photo_url: state.user.photo_url || ""
    };

}


// ==========================================
// INIT
// ==========================================

updateBalance();

showPage("home-page");


// ==========================================
// DEBUG
// ==========================================

console.log("Stars Market Web App ishga tushdi.");

console.log(
    "Telegram user:",
    getUserInfo()
);