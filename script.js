/* ==========================================
   4A REAL ESTATE - JAVASCRIPT
   ========================================== */

const WHATSAPP_NUMBER = "923333959207";
const WHATSAPP_API = `https://wa.me/${WHATSAPP_NUMBER}`;

const WHATSAPP_DEFAULT_MESSAGE =
    "Hello Muhammad Ayan, I found 4A Real Estate and I'm interested in property investment. Please share the available projects and payment plans.";

function openWhatsApp(message = "") {
    const text = encodeURIComponent(message || WHATSAPP_DEFAULT_MESSAGE);
    window.open(`${WHATSAPP_API}?text=${text}`, "_blank");
}

function openWhatsAppProject(projectName) {
    const message = encodeURIComponent(
        `Hello Muhammad Ayan, I found 4A Real Estate and I'm interested in ${projectName}. Please share the latest prices, payment plan and available units.`
    );
    window.open(`${WHATSAPP_API}?text=${message}`, "_blank");
}

function openWhatsAppCategory(type) {
    const labels = {
        residential: "Residential Property",
        commercial: "Commercial Property",
        hospitality: "Hospitality Investment",
        investment: "Investment Opportunity"
    };
    const label = labels[type] || "Property";
    const message = encodeURIComponent(
        `Hello Muhammad Ayan, I found 4A Real Estate and I'm interested in ${label}. Please share the available options, latest prices and payment plans.`
    );
    window.open(`${WHATSAPP_API}?text=${message}`, "_blank");
}

function openWhatsAppInsight(title) {
    const message = encodeURIComponent(
        `Hello Muhammad Ayan, I found 4A Real Estate and I'd like to discuss: ${title}. Please share your guidance.`
    );
    window.open(`${WHATSAPP_API}?text=${message}`, "_blank");
}

function getPaymentPlan() {
    const message = encodeURIComponent(
        "Hello Muhammad Ayan, I found 4A Real Estate and I'd like to know the current payment plans and installment options for the available projects."
    );
    window.open(`${WHATSAPP_API}?text=${message}`, "_blank");
}

function bookVisit() {
    const message = encodeURIComponent(
        "Hello Muhammad Ayan, I would like to schedule a project visit. Please let me know the available dates and projects."
    );
    window.open(`${WHATSAPP_API}?text=${message}`, "_blank");
}

/* ==========================================
   INVESTMENT CALCULATOR
   ========================================== */

function formatNumber(n) {
    const rounded = Math.round(n);
    if (Math.abs(rounded) < 1000) return rounded.toString();
    const s = String(rounded);
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    const restFormatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return restFormatted + "," + last3;
}

function calculateInvestment() {
    const valueEl = document.getElementById("propValue");
    const downEl = document.getElementById("downPct");
    const durationEl = document.getElementById("duration");
    if (!valueEl || !downEl || !durationEl) return null;

    const propValue = parseFloat(valueEl.value) || 0;
    const downPct = Math.min(100, Math.max(0, parseFloat(downEl.value) || 0));
    const duration = parseInt(durationEl.value, 10) || 0;

    if (propValue <= 0 || duration <= 0) {
        setCalcResult("resInitial", 0);
        setCalcResult("resBalance", 0);
        setCalcResult("resMonthly", 0);
        return null;
    }

    const initial = propValue * (downPct / 100);
    const balance = propValue - initial;
    const monthly = balance / duration;

    setCalcResult("resInitial", initial);
    setCalcResult("resBalance", balance);
    setCalcResult("resMonthly", monthly);

    return { propValue, downPct, duration, initial, balance, monthly };
}

function setCalcResult(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value > 0 ? `PKR ${formatNumber(value)}` : "—";
}

function sendCalculatorWhatsApp() {
    const result = calculateInvestment();
    if (!result) {
        alert("Please enter a valid property value and payment duration.");
        return;
    }
    const message = encodeURIComponent(
        "Hello Muhammad Ayan, I used the 4A Real Estate investment calculator and would like personalized details.\n\n" +
        "📊 My Estimate\n" +
        `🏠 Property Value: PKR ${formatNumber(result.propValue)}\n` +
        `📉 Down Payment: ${result.downPct}% (PKR ${formatNumber(result.initial)})\n` +
        `💵 Remaining Balance: PKR ${formatNumber(result.balance)}\n` +
        `🗓️ Duration: ${result.duration} months\n` +
        `💰 Estimated Monthly: PKR ${formatNumber(result.monthly)}\n\n` +
        "Please share the latest prices, availability and payment plans for suitable projects."
    );
    window.open(`${WHATSAPP_API}?text=${message}`, "_blank");
}

["propValue", "downPct", "duration"].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", calculateInvestment);
    el.addEventListener("change", calculateInvestment);
});

/* ==========================================
   PROPERTY MATCHING
   ========================================== */

let currentGoal = null;

const goalData = {
    home: {
        title: "Looking for a Home",
        text: "We can help you explore residential options such as apartments and terraces in selected MGC projects, matched to your budget and preferred location.",
        message: "Hello Muhammad Ayan, I'm looking for a home and I'd like help exploring suitable residential options in Islamabad/Rawalpindi."
    },
    commercial: {
        title: "Commercial Investment",
        text: "Explore commercial opportunities such as retail and mixed-use units in projects like MGC Jewel, MGC Divine, MGC-5 and Picasso by MGC.",
        message: "Hello Muhammad Ayan, I'm interested in commercial property investment and would like details on suitable options."
    },
    hospitality: {
        title: "Hospitality Investment",
        text: "Consider hospitality opportunities such as branded hotel suites, including Best Western Plus at MGC Jewel and Holiday Inn & Suites in DHA Phase II.",
        message: "Hello Muhammad Ayan, I'm interested in hospitality investment and would like details on hotel suite opportunities."
    },
    longterm: {
        title: "Long-Term Investment",
        text: "For long-term goals, investors often explore growing areas like Bahria Town Phase 8 and Mumtaz City across different MGC projects.",
        message: "Hello Muhammad Ayan, I'm interested in long-term property investment and would like recommendations based on my budget."
    },
    unsure: {
        title: "Let's Figure It Out Together",
        text: "No problem. Share your budget and goals on WhatsApp and we'll guide you toward suitable opportunities.",
        message: "Hello Muhammad Ayan, I'm not sure which property suits me. Could you help me explore options based on my budget?"
    }
};

function setGoal(key) {
    const data = goalData[key];
    if (!data) return;
    currentGoal = key;

    const buttons = document.querySelectorAll(".goal-btn");
    buttons.forEach(function (btn) {
        btn.classList.remove("active");
        if (btn.getAttribute("onclick") && btn.getAttribute("onclick").indexOf(`setGoal('${key}')`) !== -1) {
            btn.classList.add("active");
        }
    });

    const title = document.getElementById("matchTitle");
    const text = document.getElementById("matchText");
    const result = document.getElementById("matchingResult");
    if (title) title.textContent = data.title;
    if (text) text.textContent = data.text;
    if (result) {
        result.hidden = false;
        result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

function openWhatsAppGoal() {
    const data = goalData[currentGoal];
    const message = data ? data.message : "Hello Muhammad Ayan, I'd like help finding the right property.";
    openWhatsApp(message);
}

/* ==========================================
   PROJECT SELECTION
   ========================================== */

function selectProject(projectName) {
    const select = document.getElementById("preferredProject");
    if (select) {
        const normalized = projectName.replace(/ and /gi, " & ");
        Array.prototype.forEach.call(select.options, function (opt) {
            const optName = (opt.value === opt.textContent.trim()) ? opt.value : opt.textContent.trim();
            if (
                opt.value.toLowerCase() === normalized.toLowerCase() ||
                optName.toLowerCase() === normalized.toLowerCase() ||
                optName.toLowerCase() === projectName.toLowerCase()
            ) {
                select.value = opt.value;
            }
        });
    }

    const contact = document.getElementById("contact");
    if (contact) contact.scrollIntoView({ behavior: "smooth" });

    const nameInput = document.getElementById("name");
    if (nameInput) {
        setTimeout(function () {
            nameInput.focus();
        }, 700);
    }
}

/* ==========================================
   LEAD FORM
   ========================================== */

function submitForm(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const interest = document.getElementById("interest").value;
    const project = document.getElementById("preferredProject").value;
    const budget = document.getElementById("budget").value;
    const message = document.getElementById("message").value.trim();
    const consent = document.getElementById("consent").checked;

    if (!name || !phone || !interest || !project || !budget || !consent) {
        alert("Please fill in all required fields and provide consent.");
        return;
    }

    if (!isValidPhone(phone)) {
        alert("Please enter a valid phone number.");
        return;
    }

    const whatsappMessage = encodeURIComponent(
        "📋 New Inquiry - 4A Real Estate 📋\n\n" +
        `👤 Name: ${name}\n` +
        `📱 Phone/WhatsApp: ${phone}\n` +
        `🏷️ Interested In: ${interest}\n` +
        `🏢 Preferred Project: ${project}\n` +
        `💰 Budget: ${budget}\n` +
        (message ? `💬 Message: ${message}\n` : "") +
        "\nPlease contact me with the latest details. Thank you!"
    );

    window.open(`${WHATSAPP_API}?text=${whatsappMessage}`, "_blank");

    const form = document.getElementById("leadForm");
    const success = document.getElementById("formSuccess");
    if (form) form.hidden = true;
    if (success) success.hidden = false;
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\-\+\s\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

/* ==========================================
   SMOOTH SCROLL
   ========================================== */

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href && href !== "#") {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    });
});

/* ==========================================
   MOBILE MENU
   ========================================== */

function setMenuState(open) {
    const navLinks = document.querySelector(".nav-links");
    const hamburger = document.querySelector(".hamburger");
    if (open) {
        document.body.classList.add("menu-open");
        if (hamburger) hamburger.setAttribute("aria-expanded", "true");
    } else {
        document.body.classList.remove("menu-open");
        if (hamburger) hamburger.setAttribute("aria-expanded", "false");
    }
    if (navLinks) navLinks.classList.toggle("open", open);
    if (hamburger) hamburger.classList.toggle("active", open);
}

function toggleMenu() {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;
    setMenuState(!navLinks.classList.contains("open"));
}

function closeMenu() {
    setMenuState(false);
}

function setupMobileMenu() {
    if (setupMobileMenu.initialized) return;
    setupMobileMenu.initialized = true;

    document.querySelectorAll(".nav-link").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (e) {
        const nav = document.querySelector(".navbar");
        if (nav && !nav.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeMenu();
        }
    });
}

setupMobileMenu();

/* ==========================================
   INPUT FORMATTING
   ========================================== */

const nameInput = document.getElementById("name");
if (nameInput) {
    nameInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^a-zA-Z\s\-\']|^[\s\-']+|[\s\-']+$/g, "");
    });
}

const phoneInput = document.getElementById("phone");
if (phoneInput) {
    phoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^\d\-\+\(\)\s]/g, "");
    });
}

/* ==========================================
   ANIMATIONS
   ========================================== */

const animationStyles = document.createElement("style");
animationStyles.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .fade-in {
        animation: fadeIn 0.6s ease-out forwards;
    }
`;
document.head.appendChild(animationStyles);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initializeAOS() {
    if (prefersReducedMotion) return;
    const elements = document.querySelectorAll(
        ".property-card, .featured-card, .stat-box, .why-card, .insight-card, .category-card, .payment-card"
    );
    elements.forEach(function (el, index) {
        el.style.animation = `slideUp 0.6s ease-out ${index * 0.08}s both`;
    });
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px"
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            if (prefersReducedMotion) {
                observer.unobserve(entry.target);
                return;
            }
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll("section").forEach(function (section) {
    observer.observe(section);
});

/* ==========================================
   RESIZE
   ========================================== */

let resizeTimer;
window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        if (window.innerWidth >= 992) {
            closeMenu();
        }
        setupMobileMenu();
    }, 250);
});

/* ==========================================
   ANALYTICS / TRACKING
   ========================================== */

function trackPageView() {
    console.log("Page View:", {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer || "direct"
    });
}

trackPageView();

document.querySelectorAll(".btn").forEach(function (button) {
    button.addEventListener("click", function () {
        console.log("Button clicked:", this.textContent);
    });
});

/* ==========================================
   INIT
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    console.log("4A Real Estate website loaded successfully");
    initializeAOS();
    setupMobileMenu();
    calculateInvestment();
});

console.log("✓ 4A Real Estate - JavaScript loaded and ready");