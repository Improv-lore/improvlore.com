// Kids-workshop announcement popup, shown only on the homepage. Toggle and
// copy live here so it can be flipped on/off and edited without touching
// markup.
//
// HOW TO USE
//   - enabled: set to false to hide the popup. That's the on/off.
//   - heading / body: the popup copy.
//   - ctaLabel / ctaHref: the primary button. Point it at /kids/ (the full
//     page with the form) or anywhere else you'd rather send people.
//   - dismissLabel: label for the "not now" close action.
//
// Shows on every load of "/" (no dismissal memory) until closed for that
// view. Rendered by layouts/kids-popup.njk, included from base.njk.

export default {
  enabled: true,

  heading: "Got a kid aged 7–16?",
  body: "We're building a brand-new improv workshop just for children. Help us shape it: tell us about your child and what you'd love a workshop to cover, and we'll keep you posted as it comes together.",

  ctaLabel: "Tell us about your child",
  ctaHref: "/kids/",
  dismissLabel: "Not now",
};
