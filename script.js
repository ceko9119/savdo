// ==========================================
// STARS MARKET — WEB APP
// ==========================================

const tg = window.Telegram?.WebApp;

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

async function loadBalance() {

    try {

        const user = getUserInfo();

        if (!user) {
            console.log("Telegram user topilmadi.");
            return;
        }

        const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
            ? "http://127.0.0.1:8000"
            : "";

        const response = await fetch(
            `${API_URL}/api/balance`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: user.id,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name
                })
            }
        );


        if (!response.ok) {
            throw new Error("Balance API xatosi");
        }

        const data = await response.json();

        state.balance = Number(data.balance || 0);

        updateBalanceDisplay();

    } catch (error) {

        console.error("Balansni olishda xato:", error);

    }
}


function updateBalanceDisplay() {

    if (!balanceElement) return;

    balanceElement.textContent =
        new Intl.NumberFormat("uz-UZ").format(state.balance);
}


// ==========================================
// PAGE SYSTEM
// ==========================================

function showPage(pageId) {

    pages.forEach(page => {
        page.classList.toggle(
            "active",
            page.id === pageId
        );
    });

    navItems.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageId
        );
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
// BALANCE MODAL
// ==========================================

function createBalanceModal() {

    if (document.getElementById("balance-modal")) {
        return;
    }

    const modal = document.createElement("div");

    modal.id = "balance-modal";

    modal.innerHTML = `
        <div class="balance-modal-overlay"></div>

        <div class="balance-modal-card">

            <button
                class="balance-modal-close"
                id="balance-modal-close"
                type="button"
            >
                ×
            </button>

            <div class="balance-modal-icon">
                💳
            </div>

            <h2>Balansni to‘ldirish</h2>

            <p class="balance-modal-subtitle">
                Hisobingizga qo‘shmoqchi bo‘lgan summani tanlang.
            </p>

            <div class="balance-amounts">

                <button class="amount-btn" data-amount="10000">
                    10 000 so‘m
                </button>

                <button class="amount-btn" data-amount="25000">
                    25 000 so‘m
                </button>

                <button class="amount-btn" data-amount="50000">
                    50 000 so‘m
                </button>

                <button class="amount-btn" data-amount="100000">
                    100 000 so‘m
                </button>

            </div>

            <div class="custom-amount">

                <label for="custom-balance">
                    Boshqa summa
                </label>

                <div class="amount-input-wrapper">

                    <input
                        id="custom-balance"
                        type="number"
                        min="1000"
                        step="1000"
                        placeholder="Masalan, 75 000"
                    >

                    <span>so‘m</span>

                </div>

            </div>

            <button
                id="continue-payment"
                class="continue-payment"
                type="button"
            >
                Davom etish
            </button>

            <p class="payment-note">
                🔒 To‘lov xavfsiz tarzda amalga oshiriladi.
            </p>

        </div>
    `;

    document.body.appendChild(modal);

    setupBalanceModal();
}


// ==========================================
// OPEN BALANCE MODAL
// ==========================================

function openBalanceModal() {

    createBalanceModal();

    const modal = document.getElementById("balance-modal");

    modal.classList.add("show");

    document.body.classList.add("modal-open");
}


// ==========================================
// CLOSE BALANCE MODAL
// ==========================================

function closeBalanceModal() {

    const modal = document.getElementById("balance-modal");

    if (!modal) return;

    modal.classList.remove("show");

    document.body.classList.remove("modal-open");
}


// ==========================================
// BALANCE MODAL EVENTS
// ==========================================

function setupBalanceModal() {

    const modal = document.getElementById("balance-modal");

    const closeButton =
        document.getElementById("balance-modal-close");

    const overlay =
        modal.querySelector(".balance-modal-overlay");

    const amountButtons =
        modal.querySelectorAll(".amount-btn");

    const customInput =
        document.getElementById("custom-balance");

    const continueButton =
        document.getElementById("continue-payment");


    closeButton.addEventListener(
        "click",
        closeBalanceModal
    );


    overlay.addEventListener(
        "click",
        closeBalanceModal
    );


    amountButtons.forEach(button => {

        button.addEventListener("click", () => {

            amountButtons.forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            customInput.value =
                button.dataset.amount;
        });

    });


    continueButton.addEventListener("click", () => {
        const amount = Number(customInput.value);

        if (!amount || amount < 1000 || amount > 5000000) {
            const msg = `Minimum: 1 000 so‘m\nMaksimum: 5 000 000 so‘m`;

            if (tg) {
                tg.showAlert(msg);
            } else {
                alert(msg);
            }
            return;
        }

        const formattedAmount = new Intl.NumberFormat("uz-UZ").format(amount);
        const cardNumber = "9860 3401 0162 0888";
        const cardOwner = "Sh. D.";

        // Modal kartasi ichini to'lov yo'riqnomasiga o'zgartirish
        const modalCard = modal.querySelector(".balance-modal-card");
        modalCard.innerHTML = `
            <button class="balance-modal-close" id="balance-modal-close-step2" type="button">×</button>
            <div class="balance-modal-icon">💳</div>
            <h2>Karta ma’lumotlari</h2>
            <p class="balance-modal-subtitle">
                Quyidagi kartaga <b>${formattedAmount} so‘m</b> o‘tkazing.
            </p>

            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px; margin: 14px 0; text-align: left;">
                <div style="font-size: 12px; opacity: 0.7; margin-bottom: 4px;">Karta raqami:</div>
                <div style="font-size: 18px; font-weight: bold; letter-spacing: 1px; color: #4facfe; display: flex; justify-content: space-between; align-items: center;">
                    <span>${cardNumber}</span>
                    <button id="copy-card-btn" style="background: rgba(79, 172, 254, 0.2); border: none; color: #4facfe; padding: 4px 8px; border-radius: 6px; font-size: 12px; cursor: pointer;">Nusxalash</button>
                </div>
                <div style="font-size: 13px; margin-top: 8px; opacity: 0.9;">Egasining ismi: <b>${cardOwner}</b></div>
            </div>

            <div style="background: rgba(255, 77, 77, 0.15); border: 1px solid rgba(255, 77, 77, 0.3); border-radius: 10px; padding: 10px 12px; margin-bottom: 16px; color: #ff6b6b; font-size: 12px; line-height: 1.4; text-align: left;">
                ⚠️ <b>DIQQAT!</b> Siz kiritgan summa bilan <b>bir xil miqdorda (${formattedAmount} so‘m)</b> pul o‘tkazishingiz kerak. Aks holda hisobga olinmaydi!
            </div>

            <button id="paid-confirm-btn" class="continue-payment" type="button" style="background: linear-gradient(135deg, #11998e, #38ef7d); font-weight: bold;">
                ✅ To‘lov qildim
            </button>
        `;

        document.getElementById("balance-modal-close-step2").addEventListener("click", closeBalanceModal);

        const copyBtn = document.getElementById("copy-card-btn");
        if (copyBtn) {
            copyBtn.addEventListener("click", () => {
                navigator.clipboard.writeText(cardNumber.replace(/\s/g, "")).then(() => {
                    copyBtn.textContent = "Nusxalandi!";
                    setTimeout(() => copyBtn.textContent = "Nusxalash", 2000);
                });
            });
        }

        const paidConfirmBtn = document.getElementById("paid-confirm-btn");
        if (paidConfirmBtn) {
            paidConfirmBtn.addEventListener("click", async () => {
                paidConfirmBtn.disabled = true;
                paidConfirmBtn.textContent = "Yuborilmoqda...";

                const user = getUserInfo();
                const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
                    ? "http://127.0.0.1:8000"
                    : "";

                if (user && user.id) {
                    try {
                        await fetch(`${API_URL}/api/deposit/confirm`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                user_id: user.id,
                                amount: amount,
                                username: user.username,
                                first_name: user.first_name,
                                last_name: user.last_name
                            })
                        });
                    } catch (err) {
                        console.error("Deposit confirm API error:", err);
                    }
                }

                // Kutish holatini modalda ko'rsatish
                modalCard.innerHTML = `
                    <button class="balance-modal-close" id="balance-modal-close-step3" type="button">×</button>
                    <div class="balance-modal-icon">⏳</div>
                    <h2>To‘lov ko‘rib chiqilmoqda</h2>
                    <p class="balance-modal-subtitle">
                        Summa: <b>${formattedAmount} so‘m</b>
                    </p>

                    <div style="background: rgba(255, 193, 7, 0.12); border: 1px solid rgba(255, 193, 7, 0.3); border-radius: 12px; padding: 14px; margin: 16px 0; color: #ffca28; font-size: 13px; line-height: 1.5; text-align: left;">
                        ⏳ To‘lov so‘rovi adminlar guruhiga yuborildi. Admin kartani tekshirib, to‘lovni tasdiqlagandan so‘ng balansingizga pul avtomatik qo‘shiladi.
                    </div>

                    <button id="close-waiting-btn" class="continue-payment" type="button" style="background: rgba(255, 255, 255, 0.15); color: #fff;">
                        Tushundim
                    </button>
                `;

                document.getElementById("balance-modal-close-step3").addEventListener("click", closeBalanceModal);
                const closeWaitingBtn = document.getElementById("close-waiting-btn");
                if (closeWaitingBtn) {
                    closeWaitingBtn.addEventListener("click", closeBalanceModal);
                }
            });
        }
    });




}


// ==========================================
// BALANCE BUTTON
// ==========================================

if (addBalanceButton) {

    addBalanceButton.addEventListener(
        "click",
        openBalanceModal
    );

}


// ==========================================
// HOME QUICK PRODUCTS
// ==========================================

const starsCard =
    document.querySelector(".stars-card");

const premiumCard =
    document.querySelector(".premium-card");

const giftCard =
    document.querySelector(".gift-card");


if (starsCard) {

    starsCard.addEventListener("click", () => {

        showPage("home-page");

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

updateBalanceDisplay();
loadBalance()

showPage("home-page");


// ==========================================
// PRODUCT PURCHASE LOGIC
// ==========================================

async function buyProduct(productType, productName, amount, recipientUsername) {
    const user = getUserInfo();

    if (!user || !user.id) {
        const msg = "Foydalanuvchi ma'lumotlari topilmadi. Telegram orqali kiring.";
        if (tg) tg.showAlert(msg); else alert(msg);
        return;
    }

    if (state.balance < amount) {
        const msg = `Balansingizda mablag‘ yetarli emas!\nKerakli summa: ${new Intl.NumberFormat("uz-UZ").format(amount)} so‘m\nHozirgi balans: ${new Intl.NumberFormat("uz-UZ").format(state.balance)} so‘m\n\nHisobingizni to‘ldirishni xohlaysizmi?`;
        if (confirm(msg)) {
            openBalanceModal();
        }
        return;
    }

    const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:8000"
        : "";

    try {
        const response = await fetch(`${API_URL}/api/orders/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: user.id,
                product_type: productType,
                product_name: productName,
                amount: amount,
                recipient_username: recipientUsername || user.username,
                first_name: user.first_name,
                username: user.username
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const msg = data.detail || "Xarid qilishda xatolik yuz berdi.";
            if (tg) tg.showAlert(msg); else alert(msg);
            return;
        }

        // Yangi balansni o'rnatish
        state.balance = Number(data.new_balance || 0);
        updateBalanceDisplay();

        const successMsg = `🎉 Xaridingiz muvaffaqiyatli amalga oshirildi!\n\n📦 ${productName}\n💰 ${new Intl.NumberFormat("uz-UZ").format(amount)} so‘m\n\nXarid haqida ma'lumot izohlar kanaliga uzatildi!`;
        if (tg) tg.showAlert(successMsg); else alert(successMsg);

    } catch (error) {
        console.error("Purchase error:", error);
        const msg = "Xarid qilish jarayonida tarmoq xatosi yuz berdi.";
        if (tg) tg.showAlert(msg); else alert(msg);
    }
}

// Stars narxi va hisoblash
const starsInput = document.getElementById("stars-amount");
const starsPriceEl = document.getElementById("stars-price");
const starsUsernameInput = document.getElementById("stars-username");
const selfUserBtn = document.getElementById("self-user-btn");
const buyStarsBtn = document.getElementById("buy-stars-btn");
const quickStarsBtns = document.querySelectorAll(".quick-stars button");

const STAR_PRICE = 250; // 1 Star = 250 so'm (sozlanishi mumkin)

function updateStarsPrice() {
    if (!starsInput || !starsPriceEl) return;
    const count = Number(starsInput.value) || 0;
    const totalPrice = count * STAR_PRICE;
    starsPriceEl.textContent = new Intl.NumberFormat("uz-UZ").format(totalPrice);
}

if (starsInput) {
    starsInput.addEventListener("input", updateStarsPrice);
}

quickStarsBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (starsInput) {
            starsInput.value = btn.dataset.stars;
            updateStarsPrice();
        }
    });
});

if (selfUserBtn) {
    selfUserBtn.addEventListener("click", () => {
        const user = getUserInfo();
        if (user && starsUsernameInput) {
            starsUsernameInput.value = user.username ? `@${user.username}` : user.id;
        }
    });
}

if (buyStarsBtn) {
    buyStarsBtn.addEventListener("click", () => {
        const count = Number(starsInput?.value || 0);
        const username = starsUsernameInput?.value.trim() || "";

        if (!count || count < 1) {
            const msg = "Iltimos, kamida 1 ta Stars kiriting.";
            if (tg) tg.showAlert(msg); else alert(msg);
            return;
        }

        const totalPrice = count * STAR_PRICE;
        buyProduct("stars", `⭐ ${count} Stars`, totalPrice, username);
    });
}

// Premium va boshqa mahsulotlarni sotib olish tugmalari
const buyProductBtns = document.querySelectorAll(".buy-product-btn");

const PRODUCT_PRICES = {
    "premium_3": { name: "💎 3 oylik Premium", price: 145000, type: "premium" },
    "premium_6": { name: "💎 6 oylik Premium", price: 215000, type: "premium" },
    "premium_12": { name: "💎 12 oylik Premium", price: 375000, type: "premium" },
    "gift_nft": { name: "🎁 Gift / NFT", price: 50000, type: "gift" }
};

buyProductBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const prodKey = btn.dataset.product;
        const prodInfo = PRODUCT_PRICES[prodKey] || {
            name: btn.dataset.name || "🎁 Mahsulot",
            price: Number(btn.dataset.price) || 50000,
            type: "product"
        };

        const user = getUserInfo();
        const username = user ? (user.username ? `@${user.username}` : user.id) : "";

        buyProduct(prodInfo.type, prodInfo.name, prodInfo.price, username);
    });
});

// DEBUG
console.log("Stars Market Web App ready.");

