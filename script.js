const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Scroll reveal
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

// Small magnetic movement on primary buttons.
// Disabled on touch devices.
if (window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}


// Expandable package details
document.querySelectorAll(".package-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const details = toggle.nextElementSibling;
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    toggle.setAttribute("aria-expanded", String(!isOpen));
    details.classList.toggle("open", !isOpen);
  });
});

// Subtle mouse-reactive motion for question bubbles
if (window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".question-bubble").forEach((bubble) => {
    bubble.addEventListener("mousemove", (event) => {
      const rect = bubble.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
      bubble.style.transform = `translate(${x * 5}px, ${y * 4 - 5}px) scale(1.04)`;
    });

    bubble.addEventListener("mouseleave", () => {
      bubble.style.transform = "";
    });
  });
}


// Optional image slots.
// Upload images/conversation.jpg and the placeholder is replaced automatically.
document.querySelectorAll("[data-photo-slot]").forEach((slot) => {
  const image = slot.querySelector("[data-optional-photo]");
  if (!image) return;

  const showPhoto = () => slot.classList.add("has-photo");
  const showPlaceholder = () => slot.classList.remove("has-photo");

  if (image.complete) {
    if (image.naturalWidth > 0) showPhoto();
    else showPlaceholder();
  }

  image.addEventListener("load", showPhoto);
  image.addEventListener("error", showPlaceholder);
});


// Booking / aanvraag modal
const bookingModal = document.getElementById("bookingModal");
const bookingForm = document.getElementById("bookingForm");
const bookingSuccess = document.getElementById("bookingSuccess");
const bookingError = document.getElementById("bookingError");
const selectedPackage = document.getElementById("selectedPackage");
const selectedPrice = document.getElementById("selectedPrice");
const bookingPackageName = document.getElementById("bookingPackageName");
const bookingPackagePrice = document.getElementById("bookingPackagePrice");
const bookingDate = document.getElementById("bookingDate");
if (bookingDate) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  bookingDate.min = localToday;
}

function openBooking(packageName = "Nog niet gekozen", price = "") {
  if (!bookingModal) return;

  selectedPackage.value = packageName;
  selectedPrice.value = price;
  bookingPackageName.textContent = packageName;
  bookingPackagePrice.textContent = price;

  bookingForm.hidden = false;
  bookingSuccess.hidden = true;
  bookingError.textContent = "";

  bookingModal.classList.add("is-open");
  bookingModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("booking-open");

  setTimeout(() => {
    const firstInput = bookingForm.querySelector('input:not([type="hidden"])');
    firstInput?.focus();
  }, 80);
}

function closeBooking() {
  if (!bookingModal) return;
  bookingModal.classList.remove("is-open");
  bookingModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("booking-open");
}

document.querySelectorAll(".booking-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openBooking(
      trigger.dataset.package || "Nog niet gekozen",
      trigger.dataset.price || ""
    );
  });
});

document.querySelectorAll("[data-close-booking]").forEach((button) => {
  button.addEventListener("click", closeBooking);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && bookingModal?.classList.contains("is-open")) {
    closeBooking();
  }
});

bookingForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  bookingError.textContent = "";

  const action = bookingForm.getAttribute("action") || "";

  // Until a real Formspree ID is configured, show a helpful message instead
  // of pretending the request was actually sent.
  if (action.includes("YOUR_FORM_ID")) {
    bookingError.textContent =
      "Het formulier staat klaar, maar moet nog aan Formspree worden gekoppeld. Vervang YOUR_FORM_ID in index.html door je eigen Formspree-ID.";
    return;
  }

  const submitButton = bookingForm.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Versturen...";

  try {
    const response = await fetch(action, {
      method: "POST",
      body: new FormData(bookingForm),
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) throw new Error("Form submission failed");

    bookingForm.reset();
    bookingForm.hidden = true;
    bookingSuccess.hidden = false;
    bookingSuccess.querySelector("button")?.focus();
  } catch (error) {
    bookingError.textContent =
      "Versturen lukt op dit moment niet. Probeer het later opnieuw of neem rechtstreeks contact op.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});


// Custom example audio players
const allExamplePlayers = document.querySelectorAll("[data-player]");

function formatAudioTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

allExamplePlayers.forEach((player) => {
  const audio = player.querySelector("audio");
  const playButton = player.querySelector("[data-play]");
  const track = player.querySelector("[data-track]");
  const progress = player.querySelector("[data-progress]");
  const time = player.querySelector("[data-time]");

  const updatePlayer = () => {
    const ratio = audio.duration ? audio.currentTime / audio.duration : 0;
    progress.style.width = `${ratio * 100}%`;
    time.textContent = formatAudioTime(audio.currentTime);
  };

  playButton.addEventListener("click", () => {
    if (audio.paused) {
      allExamplePlayers.forEach((otherPlayer) => {
        const otherAudio = otherPlayer.querySelector("audio");
        if (otherAudio !== audio) otherAudio.pause();
      });
      audio.play();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => {
    playButton.textContent = "❚❚";
    playButton.setAttribute("aria-label", "Pauzeren");
  });

  audio.addEventListener("pause", () => {
    playButton.textContent = "▶";
    playButton.setAttribute("aria-label", "Afspelen");
  });

  audio.addEventListener("timeupdate", updatePlayer);

  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    updatePlayer();
  });

  track.addEventListener("click", (event) => {
    if (!audio.duration) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  });
});


// ----------------------------------------------------------
// v20 — separate aanvraagflow for Portret
// ----------------------------------------------------------
const portretForm = document.getElementById("portretForm");
const portretError = document.getElementById("portretError");
const portretDeadlineText = document.getElementById("portretDeadlineText");

function openPortretBooking() {
  if (!bookingModal || !portretForm || !bookingForm) return;

  bookingForm.hidden = true;
  portretForm.hidden = false;
  bookingSuccess.hidden = true;
  bookingError.textContent = "";
  if (portretError) portretError.textContent = "";

  const title = document.getElementById("bookingTitle");
  if (title) title.textContent = "Bespreek een Portret";

  const intro = document.querySelector(".booking-header > p:last-child");
  if (intro) {
    intro.textContent =
      "Een Portret bestaat uit meerdere interviews en wordt daarom niet op één datum ingepland. Vertel kort over het idee; daarna bespreken we samen wie er geïnterviewd worden en hoe de planning eruitziet.";
  }

  bookingModal.classList.add("is-open");
  bookingModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("booking-open");

  setTimeout(() => {
    portretForm.querySelector('input:not([type="hidden"])')?.focus();
  }, 80);
}

function openStandardBookingV20(packageName = "Nog niet gekozen", price = "") {
  if (!bookingModal || !bookingForm || !portretForm) return;

  selectedPackage.value = packageName;
  selectedPrice.value = price;
  bookingPackageName.textContent = packageName;
  bookingPackagePrice.textContent = price;

  portretForm.hidden = true;
  bookingForm.hidden = false;
  bookingSuccess.hidden = true;
  bookingError.textContent = "";
  if (portretError) portretError.textContent = "";

  const title = document.getElementById("bookingTitle");
  if (title) title.textContent = "Plan een Tijdcapsule";

  const intro = document.querySelector(".booking-header > p:last-child");
  if (intro) {
    intro.textContent =
      "Vul een moment in dat goed uitkomt. De aanvraag is nog niet definitief; daarna volgt persoonlijk contact om de afspraak te bevestigen.";
  }

  bookingModal.classList.add("is-open");
  bookingModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("booking-open");

  setTimeout(() => {
    bookingForm.querySelector('input:not([type="hidden"])')?.focus();
  }, 80);
}

// Capture phase prevents the older click handler from opening the standard form first.
document.querySelectorAll(".booking-trigger").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    if (trigger.dataset.bookingType === "portret") {
      event.stopImmediatePropagation();
      openPortretBooking();
    }
  }, true);
});

portretForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (portretError) portretError.textContent = "";

  const action = portretForm.getAttribute("action") || "";

  if (action.includes("YOUR_FORM_ID")) {
    if (portretError) {
      portretError.textContent =
        "Het formulier staat klaar, maar moet nog aan Formspree worden gekoppeld. Vervang YOUR_FORM_ID in index.html door je eigen Formspree-ID.";
    }
    return;
  }

  const submitButton = portretForm.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Versturen...";

  try {
    const response = await fetch(action, {
      method: "POST",
      body: new FormData(portretForm),
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) throw new Error("Portret form submission failed");

    portretForm.reset();
    portretForm.hidden = true;
    bookingSuccess.hidden = false;

    const successTitle = bookingSuccess.querySelector("h2");
    const successText = bookingSuccess.querySelector("p:not(.eyebrow)");
    if (successTitle) successTitle.textContent = "Je Portret-aanvraag is ontvangen.";
    if (successText) {
      successText.textContent =
        "Er wordt contact met je opgenomen om het idee, de mogelijke interviews en de planning samen te bespreken.";
    }

    bookingSuccess.querySelector("button")?.focus();
  } catch (error) {
    if (portretError) {
      portretError.textContent =
        "Versturen lukt op dit moment niet. Probeer het later opnieuw of neem rechtstreeks contact op.";
    }
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});


// ----------------------------------------------------------
// v30 — keep the three main package cards equally tall when closed
// ----------------------------------------------------------
const packageGridForHeight = document.querySelector(".package-grid");

function equalizePackageHeights() {
  if (!packageGridForHeight) return;

  if (window.innerWidth <= 1080) {
    packageGridForHeight.style.removeProperty("--equal-package-height");
    return;
  }

  const cards = [...packageGridForHeight.querySelectorAll(":scope > .package")];
  if (!cards.length) return;

  packageGridForHeight.classList.add("measuring-closed");
  packageGridForHeight.style.setProperty("--equal-package-height", "0px");

  // Force a layout pass with all cards in their natural closed state.
  void packageGridForHeight.offsetHeight;

  const tallest = Math.ceil(
    Math.max(...cards.map((card) => card.getBoundingClientRect().height))
  );

  packageGridForHeight.style.setProperty("--equal-package-height", `${tallest}px`);
  packageGridForHeight.classList.remove("measuring-closed");
}

window.addEventListener("load", equalizePackageHeights);

let packageResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(packageResizeTimer);
  packageResizeTimer = setTimeout(equalizePackageHeights, 120);
});

// Re-measure once web fonts have settled, since that can change line wrapping.
document.fonts?.ready.then(equalizePackageHeights);
