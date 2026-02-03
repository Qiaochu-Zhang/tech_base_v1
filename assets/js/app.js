const now = new Date();
const yearSpan = document.querySelector('[data-current-year]');
if (yearSpan) {
  yearSpan.textContent = String(now.getFullYear());
}
