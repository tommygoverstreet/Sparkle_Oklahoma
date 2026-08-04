const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;
const storedTheme = localStorage.getItem("sparkle-theme");

if (storedTheme === "dark") {
  root.classList.add("dark");
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll('.nav a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (nav && nav.classList.contains("open")) {
      nav.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    }
  });
});

document.querySelectorAll(".faq-item").forEach((item) => {
  const button = item.querySelector(".faq-question");
  button?.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("sparkle-theme", isDark ? "dark" : "light");
  });
}

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.className = "form-status";
    formStatus.textContent = "Sending your request...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      formStatus.classList.add("is-success");
      formStatus.textContent = "Thanks! Your request was sent successfully. Sparkle Oklahoma will follow up by email soon.";
      contactForm.reset();
    } catch (error) {
      formStatus.classList.add("is-error");
      formStatus.textContent = "We couldn't send the form right now. Please call 405-409-3466 or email shanklinemma@gmail.com.";
    }
  });
}
