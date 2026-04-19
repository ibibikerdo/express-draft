// portfolio item render fonksiyonunda (createPortfolioItem veya benzeri),
// portfolio-overlay'den ÖNCE şu satırı ekle:

/*
  <div class="portfolio-zoom-icon">
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6"/>
      <line x1="16" y1="16" x2="21" y2="21"/>
      <line x1="11" y1="8" x2="11" y2="14"/>
      <line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  </div>
*/

// Örnek: eğer item HTML string ile oluşturuluyorsa:
function renderPortfolioItem(item) {
  return `
        <div class="portfolio-item ${item.size || ""}" 
             data-src="${item.src}" 
             data-title="${item.title}"
             data-category="${item.category || ""}">
            <div class="portfolio-image">
                <img src="${item.src}" alt="${item.title}" loading="lazy" />
            </div>
            <div class="portfolio-zoom-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="6"/>
                    <line x1="16" y1="16" x2="21" y2="21"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
            </div>
            <div class="portfolio-overlay">
                <h3>${item.title}</h3>
                <p>${item.category || ""}</p>
            </div>
        </div>
    `;
}
