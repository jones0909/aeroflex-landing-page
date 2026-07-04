async function loadCmsContent() {
  try {
    const response = await fetch("/content/site.json", { cache: "no-store" });
    if (!response.ok) return;
    const content = await response.json();

    document.title = content.seo_title || document.title;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta && content.seo_description) {
      descriptionMeta.setAttribute("content", content.seo_description);
    }

    document.querySelectorAll("[data-cms]").forEach((element) => {
      const value = content[element.dataset.cms];
      if (typeof value === "string") element.textContent = value;
    });

    document.querySelectorAll("[data-cms-src]").forEach((element) => {
      const value = content[element.dataset.cmsSrc];
      if (typeof value === "string" && value) element.setAttribute("src", value);
    });

    document.querySelectorAll("[data-cms-email]").forEach((element) => {
      const value = content[element.dataset.cmsEmail];
      if (typeof value === "string" && value) element.setAttribute("href", `mailto:${value}`);
    });
  } catch (error) {
    console.warn("Using built-in AeroFlex content because CMS content could not be loaded.", error);
  }
}

loadCmsContent();

const fitModes = [
  {
    mode: "FLOW",
    pressure: "24",
    adjustment: "0.5",
    description: "Balanced pressure and everyday performance. Your default for training miles.",
    rotation: 0
  },
  {
    mode: "RACE",
    pressure: "32",
    adjustment: "0.2",
    description: "A firmer, more responsive hold tuned for pace work and race-day propulsion.",
    rotation: 120
  },
  {
    mode: "EASE",
    pressure: "18",
    adjustment: "1.0",
    description: "Gentle, flexible support that lets your foot recover after the longest efforts.",
    rotation: 240
  }
];

let activeMode = 0;
const dial = document.querySelector(".dial");
const mode = document.querySelector("#fit-mode");
const pressure = document.querySelector("#fit-pressure");
const adjustment = document.querySelector("#fit-adjustment");
const description = document.querySelector("#fit-description");

dial.addEventListener("click", () => {
  activeMode = (activeMode + 1) % fitModes.length;
  const next = fitModes[activeMode];
  dial.style.transform = `rotate(${next.rotation}deg)`;
  mode.parentElement.style.transform = `rotate(-${next.rotation}deg)`;
  mode.textContent = next.mode;
  pressure.textContent = next.pressure;
  adjustment.textContent = next.adjustment;
  description.textContent = next.description;
});

const menuButton = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
menuButton.addEventListener("click", () => {
  const open = header.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.textContent = open ? "Close" : "Menu";
});

document.querySelectorAll(".desktop-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Menu";
  });
});

const signupForm = document.querySelector("#signup-form");
const signupMessage = document.querySelector(".form-message");
signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = signupForm.email.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valid) {
    signupMessage.textContent = "Please enter a valid email address.";
    return;
  }
  signupMessage.textContent = "You're on the list. We'll meet you at the starting line.";
  signupForm.reset();
});
