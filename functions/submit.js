// Cloudflare Pages Function: POST /submit
//
// The site's two public forms (contact, testimonial) post here instead of
// straight to Google Forms. This endpoint is the server-side half of Cloudflare
// Turnstile: it verifies the Turnstile token with Cloudflare's siteverify API
// (using the secret key, which never reaches the browser), and only on a valid
// token does it forward the submission on to the right Google Form. A bot that
// skips the widget has no valid token, so its POST is rejected here.
//
// Required Pages environment variable (Dashboard -> Pages project -> Settings
// -> Environment variables, for Production AND Preview):
//   TURNSTILE_SECRET_KEY   the secret key from the Turnstile widget
//
// The browser sends application/x-www-form-urlencoded with:
//   form                       which form this is: "contact" | "testimonial"
//   cf-turnstile-response      the Turnstile token
//   entry.*                    the Google Form fields, already keyed by entry ID
//
// We forward every entry.* field through untouched, so the entry-ID mapping
// stays entirely in the page templates (the existing contract) and this
// function never needs to know the individual fields.

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// The Google Form formResponse endpoints, one per form. Keep these server-side
// so the function controls where a verified submission is allowed to go.
const FORM_ACTIONS = {
  contact:
    "https://docs.google.com/forms/d/e/1FAIpQLScVGlLUHvSgII5k7CeEijb48vaqdK9OcHr0Awx6KKIiHDujog/formResponse",
  testimonial:
    "https://docs.google.com/forms/d/e/1FAIpQLSdSgJSgBZzuny-0SxhF04B5r0SzPd0MagNcDVQdKehYQuqjrg/formResponse",
};

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return json(405, { ok: false, error: "method_not_allowed" });
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    // Misconfiguration: fail closed rather than letting unverified posts through.
    return json(500, { ok: false, error: "server_not_configured" });
  }

  let incoming;
  try {
    incoming = await request.formData();
  } catch (err) {
    return json(400, { ok: false, error: "bad_request" });
  }

  const which = incoming.get("form");
  const action = FORM_ACTIONS[which];
  if (!action) {
    return json(400, { ok: false, error: "unknown_form" });
  }

  const token = incoming.get("cf-turnstile-response");
  if (!token) {
    return json(400, { ok: false, error: "missing_token" });
  }

  // Verify the token. We pass the client IP for a stronger check; siteverify
  // treats it as optional. A token is single-use and short-lived.
  const verifyBody = new FormData();
  verifyBody.append("secret", env.TURNSTILE_SECRET_KEY);
  verifyBody.append("response", token);
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) verifyBody.append("remoteip", ip);

  let outcome;
  try {
    const verifyResp = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body: verifyBody,
    });
    outcome = await verifyResp.json();
  } catch (err) {
    return json(502, { ok: false, error: "verify_unreachable" });
  }

  if (!outcome.success) {
    return json(403, {
      ok: false,
      error: "turnstile_failed",
      codes: outcome["error-codes"] || [],
    });
  }

  // Token good. Rebuild the Google Form payload from every entry.* field the
  // browser sent, dropping our own control fields. This keeps the entry-ID
  // mapping in the templates and out of this function.
  const forward = new URLSearchParams();
  for (const [key, value] of incoming.entries()) {
    if (key.startsWith("entry.")) forward.append(key, value);
  }

  try {
    // Google Forms returns no CORS headers, but server-to-server we can read
    // the status. A 200 means it accepted the response.
    const gResp = await fetch(action, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: forward.toString(),
    });
    if (!gResp.ok) {
      return json(502, { ok: false, error: "forward_failed", status: gResp.status });
    }
  } catch (err) {
    return json(502, { ok: false, error: "forward_unreachable" });
  }

  return json(200, { ok: true });
}
