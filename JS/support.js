/* ===== Data ===== */
const donationAmounts = [25, 50, 100, 250, 500, 1000];

const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: "credit-card", color: "blue-gray" },
    { id: "paypal", name: "PayPal", icon: "dollar-sign", color: "blue" },
    { id: "paystack", name: "Paystack", icon: "smartphone", color: "emerald" },
    { id: "cashapp", name: "Cash App", icon: "smartphone", color: "green" },
    { id: "bitcoin", name: "Bitcoin", icon: "bitcoin", color: "orange" },
    { id: "zelle", name: "Zelle", icon: "zap", color: "purple" },
    { id: "venmo", name: "Venmo", icon: "smartphone", color: "blue" },
    { id: "bank", name: "Bank Transfer", icon: "banknote", color: "slate" },
    { id: "check", name: "Check/Money Order", icon: "mail", color: "gray" }
];

const categories = [
    { id: "ministry", title: "Ministry Operations", icon: "heart", color: "primary" },
    { id: "outreach", title: "Community Outreach", icon: "users", color: "secondary" },
    { id: "youth", title: "Youth & Education", icon: "graduation-cap", color: "green" },
    { id: "building", title: "Building & Facilities", icon: "building", color: "accent" },
    { id: "missions", title: "Mission Work", icon: "globe", color: "primary" },
    { id: "emergency", title: "Emergency Fund", icon: "shield", color: "gold" }
];

/* ===== State ===== */
let state = {
    selectedAmount: null,
    isRecurring: false,
    selectedCategory: "ministry",
    selectedPaymentMethod: "card",
    donorName: "",
    donorEmail: "",
    customAmountOneTime: "",
    customAmountMonthly: "",
    isMemorial: false,
    memorialName: ""
};

/* ===== Helpers ===== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const money = (n) => `$${Number(n).toLocaleString()}`;

/* ===== UI Renderers ===== */
function renderCategories() {
    const host = $("#category-list");
    if (!host) return;
    
    host.innerHTML = categories.map(cat => `
        <div class="item${cat.id === state.selectedCategory ? ' is-active' : ''}" data-id="${cat.id}">
            <div class="square ${cat.color}">
                <i data-lucide="${cat.icon}"></i>
            </div>
            <div style="min-width:0;flex:1">
                <div class="b s" style="color:var(--blue)">${cat.title}</div>
            </div>
        </div>
    `).join('');

    // Event delegation for categories
    host.addEventListener('click', (e) => {
        const item = e.target.closest('.item');
        if (!item) return;
        
        state.selectedCategory = item.dataset.id;
        $$('#category-list .item').forEach(el => 
            el.classList.toggle('is-active', el === item)
        );
    });
}

function renderQuickAmounts() {
    const oneTimeHost = $("#one-time-quick");
    const recurringHost = $("#recurring-quick");
    if (!oneTimeHost || !recurringHost) return;

    // One-time amounts
    oneTimeHost.innerHTML = donationAmounts.map(amount => `
        <button type="button" class="btn quick-amount" data-amount="${amount}" data-recurring="false">
            ${money(amount)}
        </button>
    `).join('');

    // Recurring amounts
    recurringHost.innerHTML = [25, 50, 100, 250].map(amount => `
        <button type="button" class="btn quick-amount" data-amount="${amount}" data-recurring="true">
            ${money(amount)}/mo
        </button>
    `).join('');

    // Event delegation for amount buttons
    [oneTimeHost, recurringHost].forEach(host => {
        host.addEventListener('click', (e) => {
            const btn = e.target.closest('.quick-amount');
            if (!btn) return;
            
            const amount = parseInt(btn.dataset.amount);
            const isRecurringBtn = btn.dataset.recurring === 'true';
            
            // Update state
            state.isRecurring = isRecurringBtn;
            state.selectedAmount = amount;
            
            // Clear custom inputs
            state.customAmountOneTime = "";
            state.customAmountMonthly = "";
            $("#custom-amount").value = "";
            $("#custom-monthly").value = "";
            
            // Update tab state if selecting one-time from recurring
            if (!isRecurringBtn && state.isRecurring !== isRecurringBtn) {
                switchTab('one-time');
            }
            
            // Update button states - only within the same container
            host.querySelectorAll('.quick-amount').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Clear other container's active states
            const otherHost = host === oneTimeHost ? recurringHost : oneTimeHost;
            otherHost.querySelectorAll('.quick-amount').forEach(b => b.classList.remove('active'));
            
            refreshDonateButton();
        });
    });
}

function renderPayments() {
    const host = $("#payment-list");
    if (!host) return;
    
    host.innerHTML = paymentMethods.map(pm => `
        <div class="item${pm.id === state.selectedPaymentMethod ? ' is-active' : ''}" data-id="${pm.id}">
            <div class="square ${pm.color}">
                <i data-lucide="${pm.icon}"></i>
            </div>
            <div style="min-width:0;flex:1">
                <div class="b s" style="color:var(--blue)">${pm.name}</div>
            </div>
        </div>
    `).join('');

    // Event delegation for payment methods
    host.addEventListener('click', (e) => {
        const item = e.target.closest('.item');
        if (!item) return;
        showPaymentPanel(item.dataset.id);
    });

    showPaymentPanel(state.selectedPaymentMethod);
}

function showPaymentPanel(id) {
    state.selectedPaymentMethod = id;
    
    // Update active states
    $$('#payment-list .item').forEach(el => 
        el.classList.toggle('is-active', el.dataset.id === id)
    );
    
    // Hide all panels and show selected one
    $$('.pm').forEach(p => p.classList.add('hidden'));
    const panel = $(`#pm-${id}`);
    if (panel) panel.classList.remove('hidden');
}

function switchTab(tab) {
    $$('.tabs-trigger').forEach(t => t.classList.remove('is-active'));
    $(`.tabs-trigger[data-tab="${tab}"]`)?.classList.add('is-active');
    
    $$('.tabs-content').forEach(c => c.classList.remove('is-active'));
    $(`[data-content="${tab}"]`)?.classList.add('is-active');
    
    state.isRecurring = tab === 'recurring';
    clearAmountSelection();
}

function clearAmountSelection() {
    state.selectedAmount = null;
    state.customAmountOneTime = "";
    state.customAmountMonthly = "";
    $("#custom-amount").value = "";
    $("#custom-monthly").value = "";
    
    // Clear all active amount buttons
    $$('.quick-amount').forEach(btn => btn.classList.remove('active'));
    
    refreshDonateButton();
}

/* ===== Donation UI ===== */
function refreshDonateButton() {
    const btn = $("#donate-btn");
    const label = $("#donate-btn-text");
    
    const amount = state.isRecurring
        ? (state.selectedAmount ?? Number(state.customAmountMonthly) || 0)
        : (state.selectedAmount ?? Number(state.customAmountOneTime) || 0);
    
    const isValid = state.donorName.trim() && 
                   /\S+@\S+\.\S+/.test(state.donorEmail) && 
                   amount > 0;
    
    if (btn) btn.disabled = !isValid;
    if (label) {
        label.textContent = `${state.isRecurring ? "Set Up Monthly" : "Donate"} ${money(amount)}`;
    }
    
    // Update recurring annual display
    const recurringAnnual = $("#recurring-annual");
    if (recurringAnnual && state.isRecurring) {
        const monthlyAmount = state.selectedAmount ?? Number(state.customAmountMonthly) || 0;
        recurringAnnual.textContent = `${money(monthlyAmount * 12)} annually - Your consistent support provides sustainable ministry funding`;
    }
}

/* ===== Event Handlers ===== */
function handleDonate(e) {
    e.preventDefault();
    
    const amount = state.isRecurring
        ? (state.selectedAmount ?? Number(state.customAmountMonthly) || 0)
        : (state.selectedAmount ?? Number(state.customAmountOneTime) || 0);

    if (state.selectedPaymentMethod === "paystack") {
        // Paystack integration - replace with your actual key
        if (typeof PaystackPop !== 'undefined') {
            const handler = PaystackPop.setup({
                key: 'pk_test_xxxxxxxxxxxxxxxxxx', // Replace with your key
                email: state.donorEmail || "donor@example.com",
                amount: amount * 100, // Convert to kobo
                currency: "NGN",
                ref: 'REV_' + Math.floor((Math.random() * 1000000000) + 1),
                onClose: () => alert('Payment window closed.'),
                callback: (response) => {
                    alert('Payment successful! Reference: ' + response.reference);
                    // Add your success handling logic here
                }
            });
            handler.openIframe();
        } else {
            alert('Paystack not loaded. Please try again.');
        }
    } else {
        // Handle other payment methods
        alert(`Thank you ${state.donorName} for your donation of ${money(amount)} via ${state.selectedPaymentMethod}!`);
    }
}

function setupInputHandlers() {
    // Donor info inputs
    $("#donor-name")?.addEventListener("input", (e) => {
        state.donorName = e.target.value;
        refreshDonateButton();
    });
    
    $("#donor-email")?.addEventListener("input", (e) => {
        state.donorEmail = e.target.value;
        refreshDonateButton();
    });

    // Custom amount inputs
    $("#custom-amount")?.addEventListener("input", (e) => {
        state.isRecurring = false;
        state.selectedAmount = null;
        state.customAmountOneTime = e.target.value;
        
        // Clear all quick amount buttons
        $$('.quick-amount').forEach(btn => btn.classList.remove('active'));
        refreshDonateButton();
    });

    $("#custom-monthly")?.addEventListener("input", (e) => {
        state.isRecurring = true;
        state.selectedAmount = null;
        state.customAmountMonthly = e.target.value;
        
        // Clear all quick amount buttons
        $$('.quick-amount').forEach(btn => btn.classList.remove('active'));
        refreshDonateButton();
    });

    // Memorial toggle
    $("#memorial-switch")?.addEventListener("change", (e) => {
        state.isMemorial = e.target.checked;
        $("#memorial-name-wrap")?.classList.toggle("hidden", !state.isMemorial);
    });

    $("#memorial-name")?.addEventListener("input", (e) => {
        state.memorialName = e.target.value;
    });

    // Tab switching
    $$('.tabs-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const tab = trigger.dataset.tab;
            switchTab(tab);
        });
    });

    // Form submission
    $("#donate-btn")?.addEventListener("click", handleDonate);
}

/* ===== Initialize ===== */
function init() {
    renderCategories();
    renderQuickAmounts();
    renderPayments();
    setupInputHandlers();
    refreshDonateButton();

    // Initialize Lucide icons if available
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init);