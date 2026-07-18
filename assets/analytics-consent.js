(function () {
  const MEASUREMENT_ID = "G-9WN7J7ZQR2";
  const CONSENT_KEY = "analyticsConsent";
  const ACCEPTED = "accepted";
  const REJECTED = "rejected";
  let loaded = false;

  function loadAnalytics() {
    if (loaded || window.gtag) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
    document.head.appendChild(tag);

    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      anonymize_ip: true
    });

    bindLeadEvents();
  }

  function bindLeadEvents() {
    document.addEventListener(
      "click",
      function (event) {
        if (!window.gtag) return;
        const target = event.target.closest("a, button");
        if (!target) return;

        const href = target.getAttribute("href") || "";
        let eventName = "";

        if (href.indexOf("tel:") === 0) eventName = "phone_click";
        if (href.indexOf("wa.me") !== -1) eventName = "whatsapp_click";
        if (href.indexOf("mailto:") === 0) eventName = "email_click";
        if (target.matches("button[type='submit']")) eventName = "form_submit_click";

        if (!eventName) return;
        window.gtag("event", eventName, {
          event_category: "lead",
          event_label: (target.textContent || href).trim().slice(0, 90)
        });
      },
      true
    );
  }

  function injectStyles() {
    if (document.getElementById("analytics-consent-style")) return;
    const style = document.createElement("style");
    style.id = "analytics-consent-style";
    style.textContent = `
      .analytics-consent {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 90;
        width: min(420px, calc(100vw - 32px));
        padding: 16px;
        border: 1px solid rgba(216, 224, 231, 0.95);
        border-radius: 8px;
        background: #ffffff;
        color: #15202b;
        box-shadow: 0 18px 42px rgba(13, 28, 43, 0.18);
        font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
      }
      .analytics-consent strong {
        display: block;
        margin-bottom: 6px;
        font-size: 15px;
      }
      .analytics-consent p {
        margin: 0 0 12px;
        color: #536373;
        font-size: 13px;
        line-height: 1.45;
      }
      .analytics-consent a {
        color: #0f766e;
        font-weight: 800;
      }
      .analytics-consent__actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .analytics-consent button {
        min-height: 38px;
        padding: 8px 12px;
        border: 1px solid #d8e0e7;
        border-radius: 8px;
        background: #ffffff;
        color: #15202b;
        font-weight: 800;
        cursor: pointer;
      }
      .analytics-consent button[data-analytics-accept] {
        background: #0f766e;
        border-color: #0f766e;
        color: #ffffff;
      }
      @media (max-width: 720px) {
        .analytics-consent {
          left: 12px;
          right: 12px;
          bottom: 74px;
          width: auto;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function showBanner() {
    if (localStorage.getItem(CONSENT_KEY)) return;
    if (document.querySelector(".analytics-consent")) return;

    injectStyles();

    const banner = document.createElement("section");
    banner.className = "analytics-consent";
    banner.setAttribute("aria-label", "Analiz izni");
    banner.innerHTML = `
      <strong>Ziyaret ölçümü</strong>
      <p>Siteyi iyileştirmek ve hangi başvuruların ihtiyaç doğurduğunu anlamak için anonimleştirilmiş ziyaret ölçümü kullanabiliriz. <a href="kvkk-aydinlatma-metni.html">KVKK metni</a></p>
      <div class="analytics-consent__actions">
        <button type="button" data-analytics-accept>Analiz izni ver</button>
        <button type="button" data-analytics-reject>Sadece gerekli</button>
      </div>
    `;

    banner.querySelector("[data-analytics-accept]").addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, ACCEPTED);
      banner.remove();
      loadAnalytics();
    });

    banner.querySelector("[data-analytics-reject]").addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, REJECTED);
      banner.remove();
    });

    document.body.appendChild(banner);
  }

  function init() {
    if (localStorage.getItem(CONSENT_KEY) === ACCEPTED) {
      loadAnalytics();
      return;
    }
    showBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
