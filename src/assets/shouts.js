const shouts = [
  "join us",
  "come improvise",
  "get on stage",
  "this is your sign",
  "be there!"
];

const colors = ["#f5c400", "#2ecc71", "#2563eb", "#ff5ca8"];

function injectShouts() {
  // Only 8% chance of showing a shout on this page
  if (Math.random() > 0.08) return;

  const containers = document.querySelectorAll(".event-detail-content, .about-intro, .page-section");
  const allParagraphs = [];

  containers.forEach((container) => {
    const paragraphs = Array.from(container.querySelectorAll("p"));
    allParagraphs.push(...paragraphs);
  });

  if (allParagraphs.length < 2) return;

  // Pick one random paragraph
  const targetPara = allParagraphs[Math.floor(Math.random() * allParagraphs.length)];
  const shout = shouts[Math.floor(Math.random() * shouts.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const rotation = Math.random() * 6 - 3;

  const shoutEl = document.createElement("p");
  shoutEl.className = "random-shout";
  shoutEl.setAttribute("aria-hidden", "true");
  shoutEl.style.setProperty("--random-stroke", color);
  shoutEl.style.setProperty("--random-rotation", `${rotation}deg`);

  const span = document.createElement("span");
  span.textContent = shout;
  shoutEl.appendChild(span);

  targetPara.parentNode.insertBefore(shoutEl, targetPara.nextSibling);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectShouts);
} else {
  injectShouts();
}
