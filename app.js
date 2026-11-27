/* ============================================================
   USTAWIENIA KALENDARZA — JEDYNE MIEJSCE, KTÓRE EDYTUJESZ W KODZIE
   ============================================================ */
const CALENDAR_CONFIG = {
  // Wklej tutaj link CSV z Google Sheets (Plik -> Udostępnij -> Opublikuj w internecie -> CSV):
  sheetCsvUrl: "WKLEJ_TUTAJ_LINK_CSV_Z_GOOGLE_SHEETS",

  year: 2026,
  month: 12, // 12 = grudzień
  title: "Nasz Kalendarz Adwentowy",
  subtitle: "24 małe niespodzianki — po jednej każdego dnia grudnia",
  previewKey: "mikolaj", // tryb podglądu: dodaj ?preview=mikolaj na końcu adresu
  shuffleDays: false     // true = pomieszane okienka jak w papierowym kalendarzu
};

/* ============================================================
   LOGIKA KALENDARZA (poniżej nie trzeba nic zmieniać)
   ============================================================ */
(function () {
  const LOCKED_MESSAGES = [
    "Nie podglądaj! To okienko jeszcze śpi ❄️",
    "Cierpliwości — ten dzień dopiero przed nami ✨",
    "Mikołaj pilnuje tego okienka! Wróć później 🎅",
    "Jeszcze chwila! Dobre rzeczy wymagają czasu 🎄"
  ];

  let toastTimer = null;

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add("hidden");
    }, 2800);
  }

  // Bezpieczny parser CSV (obsługuje przecinki, cudzysłowy i entery w komórkach)
  function parseCSV(csvText) {
    const text = csvText.replace(/^﻿/, ""); // usuwa BOM
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];

      if (inQuotes) {
        if (char === '"' && next === '"') {
          field += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          field += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ",") {
          row.push(field);
          field = "";
        } else if (char === "" && next === "
") {
          row.push(field);
          rows.push(row);
          row = [];
          field = "";
          i++;
        } else if (char === "
" || char === "") {
          row.push(field);
          rows.push(row);
          row = [];
          field = "";
        } else {
          field += char;
        }
      }
    }

    if (field.length > 0 || row.length > 0) {
      row.push(field);
      rows.push(row);
    }

    if (rows.length < 2) return [];

    const headers = rows[0].map((h) => h.trim().toLowerCase());
    const idx = {
      day: headers.indexOf("day"),
      title: headers.indexOf("title"),
      text: headers.indexOf("text"),
      image: headers.indexOf("image"),
      coupon: headers.indexOf("coupon"),
      mediaEmbed: headers.indexOf("mediaembed")
    };

    const items = [];
    for (let r = 1; r < rows.length; r++) {
      const cols = rows[r];
      const rawDay = idx.day >= 0 ? (cols[idx.day] || "").trim() : "";
      const dayNum = parseInt(rawDay, 10);
      if (isNaN(dayNum)) continue;

      items.push({
        day: dayNum,
        title: idx.title >= 0 ? (cols[idx.title] || "").trim() : `Dzień ${dayNum}`,
        text: idx.text >= 0 ? (cols[idx.text] || "").trim() : "",
        image: idx.image >= 0 ? (cols[idx.image] || "").trim() : "",
        coupon: idx.coupon >= 0 ? (cols[idx.coupon] || "").trim() : "",
        mediaEmbed: idx.mediaEmbed >= 0 ? (cols[idx.mediaEmbed] || "").trim() : ""
      });
    }

    return items.sort((a, b) => a.day - b.day);
  }

  function getOpenedDays(storageKey) {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  }

  function saveOpenedDays(storageKey, set) {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...set]));
    } catch {
      // Ignoruj w trybie prywatnym
    }
  }

  function deterministicShuffle(array, seed) {
    const copy = [...array];
    let s = seed;
    for (let i = copy.length - 1; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function openModal(item) {
    const modal = document.getElementById("day-modal");
    const badge = document.getElementById("modal-day-badge");
    const title = document.getElementById("modal-title");
    const imgWrap = document.getElementById("modal-image-wrap");
    const img = document.getElementById("modal-image");
    const text = document.getElementById("modal-text");
    const couponBox = document.getElementById("modal-coupon");
    const couponText = document.getElementById("modal-coupon-text");
    const mediaBox = document.getElementById("modal-media");

    badge.textContent = `${item.day} grudnia`;
    title.textContent = item.title || `Dzień ${item.day}`;
    text.textContent = item.text || "";

    if (item.image) {
      img.src = item.image;
      img.alt = item.title || `Zdjęcie z dnia ${item.day}`;
      img.onerror = () => imgWrap.classList.add("hidden");
      imgWrap.classList.remove("hidden");
    } else {
      img.src = "";
      imgWrap.classList.add("hidden");
    }

    if (item.coupon) {
      couponText.textContent = item.coupon;
      couponBox.classList.remove("hidden");
    } else {
      couponBox.classList.add("hidden");
    }

    mediaBox.innerHTML = "";
    mediaBox.classList.remove("is-video", "is-spotify");
    if (item.mediaEmbed) {
      const iframe = document.createElement("iframe");
      iframe.src = item.mediaEmbed;
      iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      iframe.loading = "lazy";
      if (item.mediaEmbed.includes("spotify.com")) {
        mediaBox.classList.add("is-spotify");
      } else {
        mediaBox.classList.add("is-video");
      }
      mediaBox.appendChild(iframe);
      mediaBox.classList.remove("hidden");
    } else {
      mediaBox.classList.add("hidden");
    }

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    const modal = document.getElementById("day-modal");
    document.getElementById("modal-media").innerHTML = "";
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function initSnow() {
    const canvas = document.getElementById("snow-canvas");
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const flakeCount = Math.min(75, Math.floor(width / 16));
    const flakes = Array.from({ length: flakeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.7 + 0.35,
      drift: Math.random() * 0.6 - 0.3,
      alpha: Math.random() * 0.55 + 0.25
    }));

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const f of flakes) {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha})`;
        ctx.fill();

        f.y += f.speedY;
        f.x += f.drift + Math.sin(f.y * 0.01) * 0.25;

        if (f.y > height + 5) {
          f.y = -5;
          f.x = Math.random() * width;
        }
        if (f.x > width + 5) f.x = -5;
        if (f.x < -5) f.x = width + 5;
      }
      requestAnimationFrame(draw);
    }

    draw();
  }

  function renderCalendar(daysData) {
    const config = CALENDAR_CONFIG;
    const params = new URLSearchParams(window.location.search);
    const isPreview = Boolean(config.previewKey && params.get("preview") === config.previewKey);
    if (isPreview) {
      document.getElementById("preview-banner").classList.remove("hidden");
    }

    const storageKey = `advent_opened_${config.year}_${config.month}`;
    const openedDays = getOpenedDays(storageKey);

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    function isDayUnlocked(dayNum) {
      if (isPreview) return true;
      const targetDate = new Date(config.year, config.month - 1, dayNum);
      return todayMidnight >= targetDate;
    }

    function isExactToday(dayNum) {
      return (
        now.getFullYear() === config.year &&
        now.getMonth() === config.month - 1 &&
        now.getDate() === dayNum
      );
    }

    function updateStatusPill() {
      const pill = document.getElementById("status-pill");
      const firstDay = new Date(config.year, config.month - 1, 1);
      if (!isPreview && todayMidnight < firstDay) {
        const diffDays = Math.ceil((firstDay - todayMidnight) / (1000 * 60 * 60 * 24));
        const word = diffDays === 1 ? "dzień" : "dni";
        pill.textContent = `Startujemy za ${diffDays} ${word} ❄️`;
      } else {
        pill.textContent = `Otwarte okienka: ${openedDays.size} / ${daysData.length}`;
      }
    }

    const orderedDays = config.shuffleDays
      ? deterministicShuffle(daysData, config.year)
      : daysData;

    const grid = document.getElementById("calendar-grid");
    grid.innerHTML = "";

    orderedDays.forEach((item) => {
      const unlocked = isDayUnlocked(item.day);
      const opened = openedDays.has(item.day);
      const today = isExactToday(item.day);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "door";
      btn.setAttribute("aria-label", `Okienko ${item.day}`);

      if (!unlocked) {
        btn.classList.add("is-locked");
      } else if (opened) {
        btn.classList.add("is-opened");
      } else if (today) {
        btn.classList.add("is-today", "is-available");
      } else {
        btn.classList.add("is-available");
      }

      const stateLabel = !unlocked
        ? "🔒"
        : opened
        ? "✦ Otwarte"
        : today
        ? "★ Dzisiaj!"
        : "Otwórz";

      btn.innerHTML = `
        <span class="door-number">${item.day}</span>
        <span class="door-state">${stateLabel}</span>
      `;

      btn.addEventListener("click", () => {
        if (!unlocked) {
          btn.classList.remove("shake");
          void btn.offsetWidth;
          btn.classList.add("shake");

          const targetDate = new Date(config.year, config.month - 1, item.day);
          const daysLeft = Math.ceil((targetDate - todayMidnight) / (1000 * 60 * 60 * 24));
          const baseMsg = LOCKED_MESSAGES[item.day % LOCKED_MESSAGES.length];
          const suffix = daysLeft === 1 ? "(został 1 dzień)" : `(zostało ${daysLeft} dni)`;
          showToast(`${baseMsg} ${suffix}`);
          return;
        }

        if (!openedDays.has(item.day)) {
          openedDays.add(item.day);
          saveOpenedDays(storageKey, openedDays);
          btn.classList.remove("is-today", "is-available");
          btn.classList.add("is-opened");
          btn.querySelector(".door-state").textContent = "✦ Otwarte";
          updateStatusPill();
        }

        openModal(item);
      });

      grid.appendChild(btn);
    });

    updateStatusPill();
  }

  async function init() {
    document.getElementById("calendar-title").textContent = CALENDAR_CONFIG.title;
    document.getElementById("calendar-subtitle").textContent = CALENDAR_CONFIG.subtitle;
    document.title = CALENDAR_CONFIG.title;

    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("day-modal").addEventListener("click", (e) => {
      if (e.target.id === "day-modal") closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    initSnow();

    const grid = document.getElementById("calendar-grid");
    const statusPill = document.getElementById("status-pill");
    const url = (CALENDAR_CONFIG.sheetCsvUrl || "").trim();

    if (!url || url.includes("WKLEJ_TUTAJ")) {
      statusPill.textContent = "Wymagana konfiguracja";
      grid.innerHTML =
        '<div class="error-message">Otwórz plik <strong>app.js</strong> i wklej swój link CSV z Google Sheets w polu <code>sheetCsvUrl</code> (szczegóły w INSTRUKCJA.txt).</div>';
      return;
    }

    try {
      const separator = url.includes("?") ? "&" : "?";
      const response = await fetch(`${url}${separator}t=${Date.now()}`, {
        cache: "no-store"
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const csvText = await response.text();
      const daysData = parseCSV(csvText);

      if (daysData.length === 0) {
        throw new Error("Brak wierszy z numerem dnia w arkuszu.");
      }

      renderCalendar(daysData);
    } catch (err) {
      console.error("Błąd ładowania arkusza:", err);
      statusPill.textContent = "Błąd ładowania";
      grid.innerHTML =
        '<div class="error-message">Nie udało się pobrać danych z Google Sheets. Upewnij się, że arkusz jest opublikowany jako <strong>CSV</strong> i link w <code>app.js</code> jest poprawny.</div>';
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
