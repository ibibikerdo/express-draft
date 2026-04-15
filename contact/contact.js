/**
 * contact/contact.js
 * İletişim formuna ait JavaScript işlevleri.
 */

window.initContact = function () {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const subject = `Yeni İletişim Formu Mesajı: ${data.name}`;
    const body = `Ad Soyad: ${data.name}\nE-posta: ${data.email}\n\nMesaj:\n${data.message}`;

    window.location.href = `mailto:erdoganntvn@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn.textContent;

    submitBtn.textContent = "E-posta İstemcisi Açılıyor...";
    submitBtn.style.backgroundColor = "#25D366";
    form.reset();

    setTimeout(() => {
      submitBtn.textContent = origText;
      submitBtn.style.backgroundColor = "";
    }, 3000);
  });
};

// Sayfa (section) DOM'a yüklendiğinde init metodunu çalıştır.
setTimeout(() => {
  if (typeof window.initContact === "function") {
    window.initContact();
  }
}, 500);
