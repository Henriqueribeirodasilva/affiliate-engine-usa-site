function classifyDevice() {
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function campaignValue(name) {
  return new URLSearchParams(window.location.search).get(name);
}

document.addEventListener("click", event => {
  const link = event.target.closest("[data-affiliate-link]");
  if (!link) return;
  const clickRef = link.getAttribute("data-click-ref");
  if (!/^[a-f0-9]{24}$/.test(clickRef || "")) return;
  let referrerHost = null;
  try { referrerHost = document.referrer ? new URL(document.referrer).hostname : null; } catch { referrerHost = null; }
  const payload = JSON.stringify({
    eventId: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `click-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    clickRef,
    occurredAt: new Date().toISOString(),
    referrerHost,
    deviceType: classifyDevice(),
    utmSource: campaignValue("utm_source"),
    utmMedium: campaignValue("utm_medium"),
    utmCampaign: campaignValue("utm_campaign")
  });
  navigator.sendBeacon("/api/click", new Blob([payload], { type: "application/json" }));
});
