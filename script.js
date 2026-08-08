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
