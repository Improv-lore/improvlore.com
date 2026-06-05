// Progressive enhancement for District/Insider ticket buttons.
//
// Every button rendered with [data-ticket-slug] starts life as a plain
// "Buy Ticket" link. On load we ask District's public API for the live state
// of that event and rewrite the button: show the price when tickets are on
// sale, or disable it with "Sold Out" / "Tickets coming soon". If anything
// fails (offline, CORS, unknown slug) the original link is left untouched, so
// the button never ends up worse than the static version.
//
// API: https://api-events.district.in/event/getBySlug/<slug>
// The slug is the URL path segment immediately before "/event".

(function () {
  const API = "https://api-events.district.in/event/getBySlug/";

  // "https://district.in/some-event-slug/event" -> "some-event-slug"
  function slugFromUrl(url) {
    try {
      const parts = new URL(url).pathname.split("/").filter(Boolean);
      const i = parts.lastIndexOf("event");
      return i > 0 ? parts[i - 1] : parts[parts.length - 1] || null;
    } catch (e) {
      return null;
    }
  }

  // Walk every ticket tier across all shows and report whether any are buyable.
  function hasAvailableTickets(data) {
    const shows = (data && data.venue && data.venue.shows) || [];
    for (const show of shows) {
      if (show.sold_out) continue;
      for (const group of show.items_for_sale || []) {
        for (const item of group.items || []) {
          if (
            item.item_state === "available" &&
            item.quantity_available_for_purchase > 0
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function decorate(btn, data) {
    const state = data.event_state;

    if (state === "sold_out" || (state === "available" && !hasAvailableTickets(data))) {
      setDisabled(btn, "Sold Out");
      return;
    }
    if (state === "coming_soon" || state === "tba") {
      setDisabled(btn, "Tickets coming soon");
      return;
    }

    // On sale. Append the price string ("199 onwards") when present.
    const price = (data.price_string || "").trim();
    btn.textContent = price ? `Buy Tickets · ₹${price}` : "Buy Tickets";
  }

  function setDisabled(btn, label) {
    btn.textContent = label;
    btn.setAttribute("aria-disabled", "true");
    btn.classList.add("btn-disabled");
    // Neutralise the link without removing it from the DOM.
    btn.removeAttribute("href");
    btn.removeAttribute("target");
  }

  async function enhance(btn) {
    const slug = btn.dataset.ticketSlug || slugFromUrl(btn.getAttribute("href"));
    if (!slug) return;
    try {
      const res = await fetch(API + encodeURIComponent(slug), {
        headers: { accept: "application/json" },
      });
      if (!res.ok) return;
      const json = await res.json();
      const data = json && json.data;
      if (data) decorate(btn, data);
    } catch (e) {
      // Leave the original button as-is.
    }
  }

  function init() {
    document
      .querySelectorAll("a.btn[data-ticket-slug]")
      .forEach((btn) => enhance(btn));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
