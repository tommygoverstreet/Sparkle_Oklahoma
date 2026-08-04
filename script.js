// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// Smooth scroll for nav links
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        nav.classList.remove('open');
      }
    }
  });
});

// FAQ accordion (AEO-friendly content still visible in HTML)
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.style.display === 'block';
    document.querySelectorAll('.faq-answer').forEach(a => (a.style.display = 'none'));
    if (!isOpen) {
      answer.style.display = 'block';
    }
  });
});

// Contact form (front-end only demo)
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    formStatus.textContent = 'Thank you! We’ll reach out soon to confirm your cleaning details.';
    contactForm.reset();
  });
}

// Newsletter form (front-end only demo)
const newsletterForm = document.getElementById('newsletterForm');
const newsletterStatus = document.getElementById('newsletterStatus');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    newsletterStatus.textContent = 'You’re subscribed! Expect cleaning tips and seasonal specials in your inbox.';
    newsletterForm.reset();
  });
}
