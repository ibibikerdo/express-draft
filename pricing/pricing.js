/**
 * pricing/pricing.js
 * Fiyatlandırma bölümüne ait özel JavaScript işlevleri.
 */

window.initPricing = function () {
  const pricingButtons = document.querySelectorAll(".btn-pricing");

  if (pricingButtons.length === 0) return;

  pricingButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Butona tıklandığında data-plan attribute'unu al
      const selectedPlan = this.getAttribute("data-plan");

      // Eğer sayfanızda id'si "message" veya "subject" olan bir iletişim formu input/textarea varsa,
      // değerini otomatik olarak doldurabiliriz.
      const messageField = document.querySelector('[name="message"]');

      if (messageField && selectedPlan) {
        messageField.value = `Merhaba, ${selectedPlan} için detaylı teklif almak istiyorum. Projemin detayları şunlardır:\n\n`;
        // Kullanıcının dikkatini form alanına çek
        messageField.focus();
      }
    });
  });
};

// Sayfa (section) DOM'a yüklendiğinde init metodunu çalıştır.
// (sections-loader kullanıldığı için doğrudan dinlemek yerine DOM yüklendiğini varsayıyoruz)
setTimeout(() => {
  if (typeof window.initPricing === "function") {
    window.initPricing();
  }
}, 500); // Loader'ın HTML'i inject etmesi için ufak bir bekleme süresi
