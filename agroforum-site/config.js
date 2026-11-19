// Fill these in before launch. Empty values are safe: the form still works and falls back to WhatsApp.
window.CFG = {
  // Google Apps Script web app URL that appends a row to Google Sheets (POST, JSON body)
  SHEET_URL: "",
  // WhatsApp number in international format, digits only (it appears only inside the link)
  WA: "77471673817",
  // Kaspi payment links or QR pages, one per package
  KASPI: { participant: "", dinner: "", exhibit: "", speaker: "" },
  // Remaining partner places: change by hand as places are sold
  LEFT: { exhibit: 20, speaker: 20 },
  // Organiser websites: the card opens the link in a new tab. Leave empty and the card stays plain (not clickable).
  ORG: { kasipker: "", caea: "", kaznaru: "https://www.kaznaru.edu.kz/" },
  // Opening ceremony, Almaty time (UTC+5)
  START: "2026-12-03T09:30:00+05:00"
};
