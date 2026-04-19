/**
 * contact/contact.js
 */

window.initContact = function () {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = form.querySelector('[name="firstName"]')?.value.trim() || "";
    const lastName  = form.querySelector('[name="lastName"]')?.value.trim()  || "";
    const email     = form.querySelector('[name="email"]')?.value.trim()     || "";
    const message   = form.querySelector('[name="message"]')?.value.trim()   || "";

    const subject = `Yeni Proje Teklifi: ${firstName} ${lastName}`;
    const body = [
      `Ad Soyad: ${firstName} ${lastName}`,
      `E-posta: ${email}`,
      ``,
      `Proje Özeti:`,
      message,
    ].join("\n");

    window.location.href = `mailto:erdoganntvn@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const submitBtn  = form.querySelector(".contact-submit");
    const textEl     = submitBtn.querySelector(".contact-submit-text");
    const arrowEl    = submitBtn.querySelector(".contact-submit-arrow");

    submitBtn.classList.add("sent");
    if (textEl)  textEl.textContent  = "Gönderildi";
    if (arrowEl) arrowEl.textContent = "✓";

    form.reset();

    setTimeout(() => {
      submitBtn.classList.remove("sent");
      if (textEl)  textEl.textContent  = "Teklif Gönder";
      if (arrowEl) arrowEl.textContent = "→";
    }, 3500);
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", window.initContact);
} else {
  window.initContact();
}